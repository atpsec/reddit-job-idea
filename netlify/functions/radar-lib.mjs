import { getStore } from '@netlify/blobs';

export const SUBREDDITS = [
  'ClaudeAI','vibecoding','passive_income','SideProject','Entrepreneur','startups',
  'marketing','micro_saas','founder','apps','macapps','microsaas','IMadeThis',
  'iOSAppsMarketing','juststart','SaaSMarketing','DigitalMarketing','ChatGPT'
];

const SIGNALS = [
  ['is there a tool',18],['looking for',10],['alternative',10],['wish there',18],
  ['how do you automate',16],['manual',11],['too expensive',14],['frustrat',12],
  ['pain',10],['problem',9],['struggl',12],['hate',9],['annoy',9],['need a',8],
  ['would pay',20],['does anyone know',11],['recommend',5],['workflow',7],
  ['tedious',12],['time consuming',12],['repetitive',12],['broken',9]
];

const strip = (s='') => s.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const tag = (xml,name) => strip((xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`,'i'))||[])[1]||'');
const attr = (xml,name,key) => ((xml.match(new RegExp(`<${name}[^>]*${key}=["']([^"']+)["'][^>]*>`,'i'))||[])[1]||'');

function score(text){
  const t=text.toLowerCase();
  let points=22;
  for(const [needle,p] of SIGNALS) if(t.includes(needle)) points+=p;
  if(/\b(build|app|saas|tool|software|automation|api|dashboard|plugin|extension)\b/i.test(text)) points+=8;
  if(/\?/.test(text)) points+=4;
  return Math.min(100,points);
}

function parseFeed(xml, subreddit){
  const entries=[...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map(m=>m[0]);
  return entries.slice(0,12).map(entry=>{
    const title=tag(entry,'title');
    const summary=tag(entry,'content')||tag(entry,'summary');
    const url=attr(entry,'link','href');
    const published=tag(entry,'updated')||tag(entry,'published');
    const author=tag(entry,'name');
    return {
      id:url||`${subreddit}:${title}`,
      subreddit:`r/${subreddit}`,
      title,
      summary:summary.slice(0,700),
      url,
      author,
      published,
      signalScore:score(`${title} ${summary}`)
    };
  }).filter(x=>x.title&&x.url);
}

async function fetchFeed(subreddit){
  const url=`https://www.reddit.com/r/${encodeURIComponent(subreddit)}/new/.rss`;
  const res=await fetch(url,{headers:{'User-Agent':'reddit-opportunity-radar/1.0 personal research RSS reader','Accept':'application/atom+xml,application/xml;q=0.9,*/*;q=0.1'},signal:AbortSignal.timeout(7000)});
  if(!res.ok) throw new Error(`${subreddit}: HTTP ${res.status}`);
  return parseFeed(await res.text(),subreddit);
}

export async function collectRadar(){
  const settled=await Promise.allSettled(SUBREDDITS.map(fetchFeed));
  const items=[]; const errors=[];
  settled.forEach((r,i)=>r.status==='fulfilled'?items.push(...r.value):errors.push({subreddit:`r/${SUBREDDITS[i]}`,error:String(r.reason?.message||r.reason)}));
  const seen=new Set();
  const unique=items.filter(x=>!seen.has(x.id)&&seen.add(x.id)).sort((a,b)=>b.signalScore-a.signalScore || new Date(b.published)-new Date(a.published)).slice(0,120);
  return {updatedAt:new Date().toISOString(),items:unique,errors,sources:SUBREDDITS.map(x=>`r/${x}`)};
}

export async function readRadar(){
  const store=getStore({name:'reddit-radar',consistency:'strong'});
  return await store.get('latest',{type:'json'});
}

export async function writeRadar(data){
  const store=getStore({name:'reddit-radar',consistency:'strong'});
  await store.setJSON('latest',data);
  return data;
}
