import{r as p,o as _,c as m,a as h,b as v,A as y,d as g}from"./vendor.16549db7.js";const E=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}};E();var A=(s,i)=>{const n=s.__vccOpts||s;for(const[r,e]of i)n[r]=e;return n};const L={};function O(s,i){const n=p("router-view");return _(),m(n)}var P=A(L,[["render",O]]);const b="modulepreload",u={},R="/",c=function(i,n){return!n||n.length===0?i():Promise.all(n.map(r=>{if(r=`${R}${r}`,r in u)return;u[r]=!0;const e=r.endsWith(".css"),t=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${t}`))return;const o=document.createElement("link");if(o.rel=e?"stylesheet":b,e||(o.as="script",o.crossOrigin=""),o.href=r,document.head.appendChild(o),e)return new Promise((d,f)=>{o.addEventListener("load",d),o.addEventListener("error",f)})})).then(()=>i())},l=h({history:v(),routes:[{path:"/",component:()=>c(()=>import("./Init.c496f8e2.js"),["assets/Init.c496f8e2.js","assets/Init.d8b9e83d.css","assets/request.8719c5ef.js","assets/vendor.16549db7.js","assets/global.29babadb.js"])},{path:"/create",name:"create",component:()=>c(()=>import("./Create.59b00936.js"),["assets/Create.59b00936.js","assets/Create.230f9606.css","assets/request.8719c5ef.js","assets/vendor.16549db7.js","assets/debounce.6d543512.js","assets/HexCard.04a5fad8.js","assets/HexCard.e8443a0f.css","assets/global.29babadb.js"])},{path:"/home",name:"home",component:()=>c(()=>import("./Home.af77575f.js"),["assets/Home.af77575f.js","assets/Home.eddb1f5b.css","assets/HexCard.04a5fad8.js","assets/HexCard.e8443a0f.css","assets/vendor.16549db7.js","assets/global.29babadb.js","assets/request.8719c5ef.js"])},{path:"/test",component:()=>c(()=>import("./Test.da5819b0.js"),["assets/Test.da5819b0.js","assets/request.8719c5ef.js","assets/vendor.16549db7.js","assets/debounce.6d543512.js"])}]});function k(s){s.use(l)}function I(s){s.use(y)}const a=g(P);k(a);I(a);l.isReady().then(()=>{a.mount("#app")});export{A as _,l as r};