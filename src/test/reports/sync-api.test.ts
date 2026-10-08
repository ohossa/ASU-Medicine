import {describe,it,expect,vi,afterEach} from 'vitest';
import {decompress} from 'lz-string';
const mocks=vi.hoisted(()=>({set:vi.fn(),del:vi.fn(),scan:vi.fn(),get:vi.fn(),verifyToken:vi.fn(async()=>({sub:'owner'}))}));
vi.mock('@clerk/backend',()=>({verifyToken:mocks.verifyToken}));
vi.mock('@upstash/redis',()=>({Redis:class {set=mocks.set;del=mocks.del;scan=mocks.scan;get=mocks.get;}}));
afterEach(()=>{vi.unstubAllEnvs();vi.resetModules();vi.clearAllMocks();});
async function call(body:any){
 vi.stubEnv('UPSTASH_REDIS_REST_URL','https://redis.test');vi.stubEnv('UPSTASH_REDIS_REST_TOKEN','test');vi.stubEnv('REDIS_URL','');
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
