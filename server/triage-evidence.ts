import type {EvidenceSource} from '../src/app/reports/triage-contracts.js';
const decode=(s:string)=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/\s+/g,' ').trim();
async function text(url:string,fetcher:typeof fetch,signal?:AbortSignal){
 const r=await fetcher(url,{redirect:'error',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(7000)]):AbortSignal.timeout(7000)});
 if(!r.ok)throw new Error('Evidence unavailable');
 const reader=r.body?.getReader();if(!reader)throw new Error('Missing evidence body');let chunks='',bytes=0;const decoder=new TextDecoder();
 try{while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>350000)throw new Error('Evidence too large');chunks+=decoder.decode(value,{stream:true});}}finally{await reader.cancel().catch(()=>undefined);}
 return chunks+decoder.decode();
}
/** Controlled public PubMed retrieval only. Models never select request hosts or URLs. */
export async function fetchEvidence(queries:string[],fetcher:typeof fetch=fetch,signal?:AbortSignal):Promise<EvidenceSource[]>{
 const sources:EvidenceSource[]=[];
 for(const raw of queries.slice(0,2)){
  const query=raw.replace(/https?:\/\/\S+/g,'').replace(/[^a-zA-Z0-9 ()-]/g,' ').trim().slice(0,180);if(query.length<4)continue;
  try{
   const search=new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');search.search=new URLSearchParams({db:'pubmed',term:query,retmax:'2',retmode:'json'}).toString();
   const result=JSON.parse(await text(search.toString(),fetcher,signal));
   const ids=(result.esearchresult?.idlist??[]).filter((id:unknown)=>typeof id==='string'&&/^\d+$/.test(id)).slice(0,2) as string[];if(!ids.length)continue;
   const url=new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi');url.search=new URLSearchParams({db:'pubmed',id:ids.join(','),retmode:'xml'}).toString();
   const xml=await text(url.toString(),fetcher,signal);
   for(const article of xml.matchAll(/<PubmedArticle>([\s\S]*?)<\/PubmedArticle>/g)){
    const pmid=article[1].match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1];const title=decode(article[1].match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/)?.[1]??'');
    const abstract=[...article[1].matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)].map(m=>decode(m[1])).join(' ');
    if(pmid&&ids.includes(pmid)&&title&&abstract.length>50&&!sources.some(s=>s.id===pmid))sources.push({id:pmid,url:`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,title,text:abstract.slice(0,9000),retrievedAt:new Date().toISOString()});
   }
  }catch{/* No fetched support means uncertainty, never invented evidence. */}
 }
 return sources;
}
