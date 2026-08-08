import { collectRadar, readRadar, writeRadar } from './radar-lib.mjs';

export default async (req) => {
  try {
    const url=new URL(req.url);
    const force=url.searchParams.get('refresh')==='1';
    let data=await readRadar();
    const age=data?.updatedAt ? Date.now()-new Date(data.updatedAt).getTime() : Infinity;
    if(force || !data || age>8*60*60*1000){
      data=await writeRadar(await collectRadar());
    }
    return Response.json(data,{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  } catch (error) {
    return Response.json({error:'Radar verisi alınamadı',detail:String(error?.message||error)},{status:502});
  }
};

export const config={path:'/api/reddit-radar'};
