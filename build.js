const fs=require('fs');
require('./gen.js');
const lib=fs.readFileSync(__dirname+'/lib.js','utf8');
const prog=fs.readFileSync(__dirname+'/program.json','utf8');
let t=fs.readFileSync(__dirname+'/app.template.html','utf8');
t=t.replace('/*__LIB__*/',()=>lib).replace('/*__PROGRAM__*/',()=>prog);
fs.writeFileSync(__dirname+'/kettle-and-bar.html',t); // artifact version (no document skeleton)
// standalone page for the repo (GitHub Pages etc.)
const head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#2346D5"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" type="image/png" href="icons/icon-32.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png"></head><body>';
fs.writeFileSync(__dirname+'/index.html',head+t+'<script type="module" src="firebase-sync.js"></script><script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script></body></html>');
console.log('bytes',t.length);
