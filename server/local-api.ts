import {loadEnv,type Plugin} from 'vite';
/** Execute the same authenticated handlers locally; never replace them with mock access. */
export function localApi():Plugin{return {name:'asu-local-api',apply:'serve',configureServer(server){
 if(server.config.mode==='test')return;
 const env=loadEnv(server.config.mode,process.cwd(),'');
 for(const [key,value] of Object.entries(env))if(!key.startsWith('VITE_')&&process.env[key]===undefined)process.env[key]=value;
 const origins=['http://127.0.0.1:'+server.config.server.port,'http://localhost:'+server.config.server.port];
 process.env.REPORT_ALLOWED_ORIGINS=[...(process.env.REPORT_ALLOWED_ORIGINS??'https://asu.codes,https://www.asu.codes').split(','),...origins].join(',');
 server.middlewares.use(async(req,res,next)=>{
  const url=new URL(req.url??'/', 'http://localhost');const routes:Record<string,string>={'/api/question-reports':'/api/question-reports.ts','/api/question-bank':'/api/question-bank.ts','/api/sync':'/api/sync.ts','/api/learning':'/api/learning.ts'};
  const route=routes[url.pathname];if(!route)return next();
  try{let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>2*1024*1024){res.statusCode=413;res.end(JSON.stringify({error:'Request too large.'}));return;}}
   const module=await server.ssrLoadModule(route);
   const response={setHeader:(name:string,value:string)=>res.setHeader(name,value),status:(code:number)=>{res.statusCode=code;return response;},json:(value:unknown)=>res.end(JSON.stringify(value))};
   await module.default({method:req.method,headers:req.headers,url:req.url,query:Object.fromEntries(url.searchParams),body:body||undefined},response);
  }catch{res.statusCode=503;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Local API could not start. Check server configuration.'}));}
 });
}};}
