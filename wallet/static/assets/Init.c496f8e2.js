import{r as v}from"./request.8719c5ef.js";import{c as h}from"./global.29babadb.js";import{_ as g,r as l}from"./index.8beb2e62.js";import{e as b,f as t,r as y,o as a,g as x,c as d,w as _,h as p,t as B,p as C,i as k,j as o}from"./vendor.16549db7.js";var w="/assets/logo.4505e4b5.png";function I(){return v({url:"/init",method:"get"})}const f=e=>(C("data-v-595a571f"),e=e(),k(),e),j={class:"wow"},D=f(()=>o("div",{class:"title"},"Anyweb",-1)),E=f(()=>o("div",{class:"image-holder"},[o("img",{alt:"Vue logo",src:w})],-1)),S=p(" \u521D\u59CB\u5316\u94B1\u5305 "),N=b({setup(e){const s=t(!1),r=t(!0),n=t(!1),u=t("\u8BFB\u53D6\u6570\u636E\u4E2D");I().then(c=>{c.code===h.NULL?s.value=!0:l.push({name:"home"})}).catch(()=>{u.value="\u51FA\u9519\u4E86",n.value=!0}).finally(()=>{r.value=!1});function m(){l.push({name:"create"})}return(c,V)=>{const i=y("a-button");return a(),x("div",j,[D,E,s.value?(a(),d(i,{key:0,type:"primary",shape:"round",onClick:m},{default:_(()=>[S]),_:1})):(a(),d(i,{key:1,type:"primary",shape:"round",ghost:"",danger:n.value,loading:r.value},{default:_(()=>[p(B(u.value),1)]),_:1},8,["danger","loading"]))])}}});var T=g(N,[["__scopeId","data-v-595a571f"]]);export{T as default};
