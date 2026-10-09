import {describe,it,expect,vi,afterEach} from 'vitest';
import {compress,decompress} from 'lz-string';
const mocks=vi.hoisted(()=>({set:vi.fn(),del:vi.fn(),scan:vi.fn(),get:vi.fn(),eval:vi.fn(),verifyToken:vi.fn(async()=>({sub:'owner'}))}));
vi.mock('@clerk/backend',()=>({verifyToken:mocks.verifyToken}));
vi.mock('@upstash/redis',()=>({Redis:class {set=mocks.set;del=mocks.del;scan=mocks.scan;get=mocks.get;eval=mocks.eval;}}));
afterEach(()=>{vi.unstubAllEnvs();vi.resetModules();vi.clearAllMocks();});
async function call(body:any,configure?:()=>void){
 vi.stubEnv('UPSTASH_REDIS_REST_URL','https://redis.test');vi.stubEnv('UPSTASH_REDIS_REST_TOKEN','test');vi.stubEnv('REDIS_URL','');
 mocks.eval.mockImplementation(async(_script,keys,args)=>{await mocks.set(keys[0],args[1]);return 1;});
 configure?.();
 const {default:handler}=await import('../../../api/sync');
 const res={setHeader:vi.fn(),status:vi.fn(),json:vi.fn()};res.status.mockReturnValue(res);
 await handler({method:'POST',headers:{authorization:'Bearer test'},body},res);return res;
}
describe('account cloud sync delta contract',()=>{
 it('retains omitted keys, deletes only null, and stores shuffle without expiry',async()=>{
 const res=await call({'asu_preferences:owner:shuffle':{enabled:true,timestamp:1},theme:null});
 expect(res.status).toHaveBeenCalledWith(200);expect(mocks.scan).not.toHaveBeenCalled();
 expect(mocks.del).toHaveBeenCalledExactlyOnceWith('asu_data:owner:theme');
 const [key,value,options]=mocks.set.mock.calls[0];expect(key).toBe('asu_data:owner:asu_preferences:owner:shuffle');expect(JSON.parse(decompress(value)!)).toEqual({enabled:true,timestamp:1});expect(options).toBeUndefined();
 });
 it('never copies another account preference or saved attempt',async()=>{
 await call({'asu_preferences:other:shuffle':{enabled:true},'asu_quiz_session:other:1:all':{current:9}});
 expect(mocks.set).not.toHaveBeenCalled();expect(mocks.del).not.toHaveBeenCalled();
 });
 it('rejects array bodies rather than treating them as a snapshot',async()=>{const res=await call(['bad']);expect(res.status).toHaveBeenCalledWith(400);expect(mocks.set).not.toHaveBeenCalled();});
});

it('stores the owner academic year permanently and ignores another account year',async()=>{
 const res=await call({'asu_preferences:owner:academic-year':{year:3,version:1,timestamp:1},'asu_preferences:other:academic-year':{year:2,version:1,timestamp:1}});
 expect(res.status).toHaveBeenCalledWith(200);expect(mocks.set).toHaveBeenCalledTimes(1);
 expect(mocks.set.mock.calls[0][0]).toBe('asu_data:owner:asu_preferences:owner:academic-year');expect(mocks.set.mock.calls[0][2]).toBeUndefined();
});
it('rejects invalid academic year data before writing any keys',async()=>{
 const res=await call({theme:'dark','asu_preferences:owner:academic-year':{year:9,version:1,timestamp:1}});
 expect(res.status).toHaveBeenCalledWith(400);expect(mocks.set).not.toHaveBeenCalled();
});

it('merges phone and computer histories instead of replacing the account history',async()=>{
 mocks.get.mockResolvedValue(compress(JSON.stringify([{id:'phone',pct:100,date:'2026-10-09'}])));
 const res=await call({endocrine_essay_quiz_history:[{id:'computer',pct:50,date:'2026-10-10'}]});
 expect(res.status).toHaveBeenCalledWith(200);
 const [,value]=mocks.set.mock.calls[0];
 expect(JSON.parse(decompress(value)!).map((r:{id:string})=>r.id).sort()).toEqual(['computer','phone']);
});

it('retries atomic conflicts so simultaneous device histories both survive',async()=>{
 let raw:string|null=null;
 const configure=()=>{
   mocks.get.mockImplementation(async()=>{const before=raw;await Promise.resolve();return before;});
   mocks.eval.mockImplementation(async(_script,_keys,args)=>{
     if ((raw??'')!==args[0]) return 0;
     raw=args[1];return 1;
   });
 };
 const [phone,computer]=await Promise.all([
   call({endocrine_essay_quiz_history:[{id:'phone',pct:100,date:'2026-10-09'}]},configure),
   call({endocrine_essay_quiz_history:[{id:'computer',pct:50,date:'2026-10-10'}]},configure),
 ]);
 expect(phone.status).toHaveBeenCalledWith(200);expect(computer.status).toHaveBeenCalledWith(200);
 expect(JSON.parse(decompress(raw!)!).map((r:{id:string})=>r.id).sort()).toEqual(['computer','phone']);
 expect(mocks.eval.mock.calls.length).toBeGreaterThan(2);
});
it('does not replace a newer phone resume with an older computer save',async()=>{
 mocks.get.mockResolvedValue(compress(JSON.stringify({timestamp:20,current:16,answers:{0:true}})));
 const res=await call({'asu_quiz_session:owner:1:Oral':{timestamp:10,current:1,answers:{}}});
 expect(res.status).toHaveBeenCalledWith(200);
 expect(JSON.parse(decompress(mocks.set.mock.calls[0][1])!)).toMatchObject({timestamp:20,current:16});
});
