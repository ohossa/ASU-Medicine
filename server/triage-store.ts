import {randomUUID} from 'node:crypto';
import {evalRedis} from './report-store.js';
import {cairoDay} from './tutor-metrics.js';
import type {TriageAssessment,TriageLabel} from '../src/app/reports/triage-contracts.js';
const prefix='asu_triage:v1:';
export const dailyLimit=()=>Math.max(1,Math.min(200,Number(process.env.TRIAGE_DAILY_CALL_LIMIT)||50));
export interface TriageStore{
 read(keys:string[]):Promise<Record<string,TriageAssessment>>;save(a:TriageAssessment,lease:string):Promise<boolean>;
 lease():Promise<string|null>;release(token:string):Promise<void>;reserve():Promise<boolean>;
 labels():Promise<TriageLabel[]>;label(value:TriageLabel):Promise<void>;
 mode(value?:'shadow'|'prioritized'):Promise<'shadow'|'prioritized'>;
}
export const TRIAGE_LEASE_LUA=`if redis.call('SET',KEYS[1],ARGV[1],'NX','EX',90) then return 1 end return 0`;
export const TRIAGE_SAVE_LUA=`if redis.call('GET',KEYS[1])~=ARGV[1] then return 0 end redis.call('SET',KEYS[2],ARGV[2]);return 1`;
export const TRIAGE_BUDGET_LUA=`local n=tonumber(redis.call('GET',KEYS[1]) or '0');if n>=tonumber(ARGV[1]) then return 0 end;redis.call('INCR',KEYS[1]);redis.call('EXPIRE',KEYS[1],172800);return 1`;
export const triageStore:TriageStore={
 async read(keys){const out:Record<string,TriageAssessment>={};for(let i=0;i<keys.length;i+=400){const batch=keys.slice(i,i+400);if(!batch.length)continue;const rows=await evalRedis(`local rows={};for i,k in ipairs(KEYS) do table.insert(rows,redis.call('GET',k) or '') end;return rows`,batch.map(k=>prefix+'assessment:'+k)) as string[];rows.forEach((r,j)=>{if(r)out[batch[j]]=JSON.parse(r);});}return out;},
 async save(a,lease){return Number(await evalRedis(TRIAGE_SAVE_LUA,[prefix+'lease',prefix+'assessment:'+a.fingerprint],[lease,JSON.stringify(a)]))===1;},
 async lease(){const token=randomUUID();return Number(await evalRedis(TRIAGE_LEASE_LUA,[prefix+'lease'],[token]))===1?token:null;},
 async release(token){await evalRedis(`if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end;return 0`,[prefix+'lease'],[token]);},
 async reserve(){
  const quota=await evalRedis(`return redis.call('GET',KEYS[1])`,['asu_tutor:v1:quota:groq']);
  if(quota){const q=JSON.parse(String(quota));if(Date.now()-Date.parse(q.observedAt)<120000&&((q.remainingRequests!==null&&q.remainingRequests<10)||(q.remainingTokens!==null&&q.remainingTokens<6000)))return false;}
  return Number(await evalRedis(TRIAGE_BUDGET_LUA,[prefix+'calls:'+cairoDay()],[String(dailyLimit())]))===1;
 },
 async labels(){const rows=await evalRedis(`return redis.call('HVALS',KEYS[1])`,[prefix+'labels']) as string[];return rows.map(r=>JSON.parse(r));},
 async label(value){await evalRedis(`redis.call('HSET',KEYS[1],ARGV[1],ARGV[2]);redis.call('RPUSH',KEYS[2],ARGV[2]);return 1`,[prefix+'labels',prefix+'label-audit'],[value.key,JSON.stringify(value)]);},
 async mode(value){if(value)await evalRedis(`redis.call('SET',KEYS[1],ARGV[1]);return 1`,[prefix+'mode'],[value]);return String(await evalRedis(`return redis.call('GET',KEYS[1])`,[prefix+'mode']))==='prioritized'?'prioritized':'shadow';},
};
