import {afterEach,it,expect,vi} from 'vitest';
import {GroqAdapter,getAdapter} from '../../../api/hint';
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
it('uses Groq with conversation context and returns only the final answer',async()=>{
 vi.stubEnv('GROQ_API_KEY','test-groq-key');vi.stubEnv('GROQ_HINT_MODEL','');
 const fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({choices:[{message:{content:' Useful explanation ',reasoning:'private reasoning'}}]})));vi.stubGlobal('fetch',fetchMock);
 expect(await new GroqAdapter().generateHint({questionText:'Question',previousAttempts:2,messages:[{role:'user',content:'Previous question'},{role:'assistant',content:'Previous reply'}]})).toEqual({text:'Useful explanation',source:'groq'});
 const [url,request]=fetchMock.mock.calls[0];const body=JSON.parse(request.body);
 expect(url).toBe('https://api.groq.com/openai/v1/chat/completions');expect(request.headers.Authorization).toBe('Bearer test-groq-key');
 expect(body.model).toBe('openai/gpt-oss-120b');expect(body.reasoning_effort).toBe('low');expect(body.include_reasoning).toBe(false);
 expect(body.messages).toEqual(expect.arrayContaining([{role:'user',content:'Previous question'},{role:'assistant',content:'Previous reply'}]));
});
it('selects Groq when configured',()=>{vi.stubEnv('HINT_AI_PROVIDER','groq');expect(getAdapter()).toBeInstanceOf(GroqAdapter);});
it('fails before making a request without a key',async()=>{vi.stubEnv('GROQ_API_KEY','');const f=vi.fn();vi.stubGlobal('fetch',f);await expect(new GroqAdapter().generateHint({questionText:'Question',previousAttempts:2})).rejects.toThrow('503');expect(f).not.toHaveBeenCalled();});
it.each([401,403,404,429,500])('reports safe errors without retrying on %s',async status=>{
 vi.stubEnv('GROQ_API_KEY','test');const f=vi.fn().mockResolvedValue(new Response('private provider error',{status}));vi.stubGlobal('fetch',f);
 const request=new GroqAdapter().generateHint({questionText:'Question',previousAttempts:2});await expect(request).rejects.toThrow(String(status));await expect(request).rejects.not.toThrow('private provider error');expect(f).toHaveBeenCalledTimes(1);
});
it('rejects empty output instead of exposing reasoning',async()=>{vi.stubEnv('GROQ_API_KEY','test');vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({choices:[{message:{content:'',reasoning:'reasoning'}}]}))));await expect(new GroqAdapter().generateHint({questionText:'Question',previousAttempts:2})).rejects.toThrow('502');});
