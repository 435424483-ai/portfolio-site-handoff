const {test}=require('node:test'),assert=require('node:assert/strict'),http=require('node:http');
const createApi=require('./gpt-api.cjs');
test('local GPT proxy: key isolation, origin checks, input validation and response handling',async()=>{
 let calls=0,lastBody,mode='ok';
 const handler=createApi({initialKey:'',fetchImpl:async(url,options)=>{calls++;lastBody=JSON.parse(options.body);assert.equal(url,'https://api.openai.com/v1/responses');assert.ok(options.headers.Authorization.startsWith('Bearer sk-'));if(mode==='401')return {ok:false,status:401};if(mode==='network')throw new Error('internal confidential diagnostic');return {ok:true,json:async()=>mode==='incomplete'?{status:'incomplete',output:[]}:{status:'completed',output:[{type:'reasoning'},{type:'message',content:[{type:'output_text',text:'保留真实成果，让表达更清晰。'}]}]}}}});
 const server=http.createServer(async(req,res)=>{await handler(req,res)});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const call=async(route,data,origin=base)=>{const response=await fetch(base+'/api/gpt/'+route,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json','X-Portfolio-Editor':'1',Origin:origin}:{},body:data?JSON.stringify(data):undefined});return {status:response.status,body:await response.json()}};
 try{
  assert.equal((await call('status')).body.configured,false);
  assert.equal((await call('rewrite',{text:'原文',instruction:''})).status,409);
  assert.equal((await call('connect',{key:'sk-test-only-not-a-real-key'},'https://example.org')).status,403);
  assert.equal((await call('connect',{key:'invalid'})).status,400);
  const connection=await call('connect',{key:'sk-test-only-not-a-real-key'});assert.equal(connection.status,200);assert.ok(!JSON.stringify(connection).includes('sk-'));
  assert.equal((await call('rewrite',{text:'x'.repeat(5001),instruction:''})).status,400);assert.equal(calls,0);
  const output=await call('rewrite',{text:'完成 20 张海报。',instruction:'更简洁'});assert.equal(output.body.text,'保留真实成果，让表达更清晰。');assert.equal(lastBody.store,false);assert.equal(lastBody.model,'gpt-5-mini');assert(lastBody.input.includes('20'));
  mode='401';assert.equal((await call('rewrite',{text:'原文',instruction:''})).status,401);
  mode='incomplete';assert.equal((await call('rewrite',{text:'原文',instruction:''})).status,502);
  mode='network';const failed=await call('rewrite',{text:'原文',instruction:''});assert.equal(failed.status,502);assert.ok(!JSON.stringify(failed).includes('confidential'));
  assert.equal((await call('disconnect',{})).body.configured,false);assert.equal((await call('status')).body.configured,false);
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve))}
});
