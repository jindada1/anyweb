import{r as g}from"./request.93e175a3.js";import{c as h}from"./global.29babadb.js";import{_ as y,u as b,r as d}from"./index.09beee5d.js";import{f as x,g as t,r as B,o,h as C,c as l,w as _,i as p,t as k,p as w,j as I,k as s}from"./vendor.f58d8c59.js";var j="./assets/logo.4505e4b5.png";function S(){return g({url:"/init",method:"get"})}const m=e=>(w("data-v-51ce1c63"),e=e(),I(),e),D={class:"wow"},E=m(()=>s("div",{class:"title"},"Anyweb",-1)),N=m(()=>s("div",{class:"image-holder"},[s("img",{alt:"Vue logo",src:j})],-1)),V=p(" \u521D\u59CB\u5316\u94B1\u5305 "),q=x({setup(e){const f=b(),n=t(!1),r=t(!0),c=t(!1),u=t("\u8BFB\u53D6\u6570\u636E\u4E2D");S().then(a=>{a.code===h.NULL?n.value=!0:(f.commit("initConfig",a.data),d.push({name:"home"}))}).catch(()=>{u.value="\u51FA\u9519\u4E86",c.value=!0}).finally(()=>{r.value=!1});function v(){d.push({name:"create"})}return(a,A)=>{const i=B("a-button");return o(),C("div",D,[E,N,n.value?(o(),l(i,{key:0,type:"primary",shape:"round",onClick:v},{default:_(()=>[V]),_:1})):(o(),l(i,{key:1,type:"primary",shape:"round",ghost:"",danger:c.value,loading:r.value},{default:_(()=>[p(k(u.value),1)]),_:1},8,["danger","loading"]))])}}});var z=y(q,[["__scopeId","data-v-51ce1c63"]]);export{z as default};
