import {createHash} from 'node:crypto';
import {evalRedis} from './report-store.js';
import {ReportError} from './report-service.js';
import type {EditStore,QuestionEdit} from './question-edit-service.js';
const prefix='asu_question_edits:v1:';
export const SAVE_EDIT_LUA=`local old=redis.call('HGET',KEYS[1],ARGV[1]);local revision=0;if old then revision=cjson.decode(old).revision end;if revision~=tonumber(ARGV[2]) then return {409,''} end;local r=cjson.decode(ARGV[3]);r.revision=revision+1;local raw=cjson.encode(r);redis.call('HSET',KEYS[1],ARGV[1],raw);redis.call('LPUSH',KEYS[2],raw);redis.call('SADD',KEYS[3],r.moduleCode);return {200,raw}`;
function decode(raw:string):QuestionEdit{const entry=JSON.parse(raw);entry.question=JSON.parse(entry.question);return entry;}
export const editStore:EditStore={
 async list(moduleCode){const rows=await evalRedis("return redis.call('HVALS',KEYS[1])",[prefix+moduleCode]);return (rows as string[]).map(decode);},
 async save(edit,revision){const field=createHash('sha256').update(edit.chapterId+':'+edit.questionId).digest('hex');const response=await evalRedis(SAVE_EDIT_LUA,[prefix+edit.moduleCode,prefix+'history:'+edit.moduleCode,prefix+'modules'],[field,String(revision),JSON.stringify({...edit,question:JSON.stringify(edit.question)})]) as [number,string];if(response[0]!==200)throw new ReportError(409,'This question was edited in another window. Reload before saving.');return decode(response[1]);},
 async history(moduleCode){const rows=await evalRedis("return redis.call('LRANGE',KEYS[1],0,-1)",[prefix+'history:'+moduleCode]);return (rows as string[]).map(decode);},
};

export async function editedModules():Promise<string[]>{return await evalRedis("return redis.call('SMEMBERS',KEYS[1])",[prefix+'modules']) as string[];}
