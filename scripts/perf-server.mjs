import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root=path.resolve(process.env.PERF_ROOT||'dist');
const types={html:'text/html; charset=utf-8',css:'text/css',js:'text/javascript',json:'application/json',svg:'image/svg+xml',webp:'image/webp',jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',woff:'font/woff',woff2:'font/woff2',mp4:'video/mp4',webm:'video/webm',avif:'image/avif',pdf:'application/pdf'};
http.createServer((req,res)=>{
 let file;try{file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));}catch{res.writeHead(400).end();return;}
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 let status=200;if(!fs.existsSync(file)){file=path.join(root,'404.html');status=404;}
 const size=fs.statSync(file).size,ext=path.extname(file).slice(1);
 const headers={'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-cache','Accept-Ranges':'bytes'};
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):size-1,size-1);if(start>end){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);return;}
 if(/^(html|css|js|json|svg)$/.test(ext)&&req.headers['accept-encoding']?.includes('gzip')){const body=gzipSync(fs.readFileSync(file));res.writeHead(status,{...headers,'Content-Encoding':'gzip','Vary':'Accept-Encoding','Content-Length':body.length});res.end(body);return;}
 res.writeHead(status,{...headers,'Content-Length':size});fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PERF_PORT)||5180,'127.0.0.1',()=>console.log('Performance server: http://127.0.0.1:5180'));
