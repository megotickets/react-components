(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3185],{74705:function(e,t,n){Promise.resolve().then(n.t.bind(n,31796,23)),Promise.resolve().then(n.bind(n,39241))},39241:function(e,t,n){"use strict";n.r(t),n.d(t,{Providers:function(){return o}});var r=n(89075),i=n(76733);function o(e){let{children:t}=e;return(0,r.jsx)(i.Qgv,{children:t})}},31796:function(){},76733:function(e,t,n){"use strict";n.d(t,{AhJ:function(){return w.Ah},Iqj:function(){return T},JwV:function(){return L},Qgv:function(){return C},RJ0:function(){return o.R},RZ8:function(){return x.NL},TLF:function(){return P},XgL:function(){return y},_y0:function(){return E},aNw:function(){return I},aeS:function(){return b},csQ:function(){return m.cs},ecV:function(){return m.ec},laj:function(){return m.l},mAM:function(){return w.mA},n9M:function(){return m.n9},nDS:function(){return F},o$C:function(){return w.o$},pQX:function(){return w.pQ},v4o:function(){return a.v},vc:function(){return S},wsL:function(){return v.w},yXc:function(){return l.y},yue:function(){return s.y},zPj:function(){return m.zP}});var r=n(7960),i=n(18020),o=n(5871),s=n(50620),c=n(56826),a=n(92866),l=n(44528),u=n(57664),d=n(28405);n(79152);var h=n(6840),p=n(67273),g=n(50511),f=n(89075),x=n(10918),w=n(9795),m=n(30954),y=n(28127),v=n(99008),j=(0,g.createContext)(void 0),b=()=>{let e=(0,g.useContext)(j);if(void 0===e)throw Error("useCustomization deve essere usato all'interno di un CustomizationProvider");return e},k=e=>{let{children:t}=e,[n,r]=g.useState({}),[i,o]=g.useState({}),[s,c]=g.useState(0);return(0,f.jsx)(j.Provider,{value:{style:n,setStyle:r,providerConfiguration:i,setProviderConfiguration:o,forceChainId:s,setForceChainId:c},children:t})},S=(0,x.vX)({appName:"Mego Wallet",projectId:"b04bcb017e647637f86b206334c538e6",chains:[o.R,s.y,c.F,a.v,l.y,u.u,d.L],transports:{[o.R.id]:(0,r.d)(),[s.y.id]:(0,r.d)(),[c.F.id]:(0,r.d)(),[a.v.id]:(0,r.d)(),[l.y.id]:(0,r.d)(),[u.u.id]:(0,r.d)(),[d.L.id]:(0,r.d)()}});function C(e){let{children:t}=e,[n]=(0,g.useState)(()=>new h.S({defaultOptions:{queries:{refetchOnWindowFocus:!1,retry:0,staleTime:3e4}}}));return(0,f.jsx)(k,{children:(0,f.jsx)(p.aH,{client:n,children:(0,f.jsx)(i.F,{config:S,children:(0,f.jsx)(x.pj,{children:t})})})})}var I=e=>{let{message:t="Loading, please wait..."}=e;return(0,f.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},children:[(0,f.jsx)("div",{style:{width:"48px",height:"48px",borderRadius:"50%",boxShadow:"0 -1px 0 rgba(255, 255, 255, 1)",animation:"spin 1s linear infinite"}}),(0,f.jsx)("p",{className:"mego-font-medium",style:{marginTop:"16px",color:"white"},children:t}),(0,f.jsx)("style",{children:"\n        @keyframes spin {\n          0% { transform: rotate(0deg); }\n          100% { transform: rotate(360deg); }\n        }\n      "})]})},L=function(e,t){let n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];localStorage.setItem("reddeemWithMego","1"),window&&(window.location="https://wallet.mego.tools/auth/apple?origin=".concat(e.replace("http://","").replace("https://",""),"&message=").concat(t).concat(n?"&encoded=true":""))},P=function(e,t){let n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];localStorage.setItem("redeemWithMego","1"),window&&(window.location="https://wallet.mego.tools/auth/google?origin=".concat(e.replace("http://","").replace("https://",""),"&message=").concat(t).concat(n?"&encoded=true":""))},F=async function(e,t){let n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];try{let r="https://wallet.mego.tools/auth/google?origin=".concat(e.replace("http://","").replace("https://",""),"&message=").concat(t).concat(n?"&encoded=true":""),i=window.open(r,"megoSignPopup","width=500,height=600");if(!i)return{error:!0,signature:""};let o=await new Promise((t,n)=>{let r=setInterval(()=>{try{if(i.closed){clearInterval(r),n(Error("Popup chiuso dall'utente"));return}if(i.location.href.includes(e)){let e=new URLSearchParams(i.location.search).get("signature");e&&(clearInterval(r),i.close(),t(e))}}catch(e){return{error:!0,signature:""}}},500)});return{error:!1,signature:o}}catch(e){return{error:!0,signature:""}}},E=async function(e,t){let n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];try{let r="https://wallet.mego.tools/auth/apple?origin=".concat(e.replace("http://","").replace("https://",""),"&message=").concat(t).concat(n?"&encoded=true":""),i=window.open(r,"megoSignPopup","width=500,height=600");if(!i)return{error:!0,signature:""};let o=await new Promise((t,n)=>{let r=setInterval(()=>{try{if(i.closed){clearInterval(r),n(Error("Popup chiuso dall'utente"));return}if(i.location.href.includes(e)){let e=new URLSearchParams(i.location.search).get("signature");e&&(clearInterval(r),i.close(),t(e))}}catch(e){return{error:!0,signature:""}}},500)});return{error:!1,signature:o}}catch(e){return{error:!0,signature:""}}},T=e=>{let{popupData:t,onClose:n}=e,[r,i]=(0,g.useState)(!1),[o,s]=(0,g.useState)("hidden");(0,g.useEffect)(()=>{if(t.isOpen){i(!1),s("entering");let e=setTimeout(()=>{s("visible")},10),n=setTimeout(()=>{c()},t.autoCloseTime||3e3);return()=>{clearTimeout(e),clearTimeout(n)}}},[t.isOpen,t.autoCloseTime]);let c=()=>{i(!0),s("exiting"),setTimeout(()=>{n(),i(!1),s("hidden")},300)};if(!t.isOpen&&!r)return null;let a=()=>{switch(t.modality){case"success":return"#10B981";case"error":return"#EF4444";default:return"#FFFFFF"}};return(0,f.jsxs)("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1e3,pointerEvents:"none"},children:[(0,f.jsx)("div",{style:{backgroundColor:"rgba(0, 0, 0, 0.5)",position:"absolute",top:0,left:0,width:"100%",height:"100%",opacity:"visible"===o?1:0,transition:"opacity 0.3s ease",pointerEvents:"auto"},onClick:c}),(0,f.jsxs)("div",{style:{backgroundColor:"black",border:"1px solid #333",borderRadius:"12px",padding:"24px",width:"90%",maxWidth:"400px",display:"flex",flexDirection:"column",alignItems:"center",transform:"visible"===o?"translateY(0)":"entering"===o||"exiting"===o?"translateY(30%)":"translateY(100%)",opacity:"visible"===o?1:"entering"===o||"exiting"===o?1:0,transition:"transform 0.3s ease, opacity 0.3s ease",boxShadow:"0 10px 25px rgba(0, 0, 0, 0.5)",zIndex:1001,pointerEvents:"auto"},children:[(()=>{switch(t.modality){case"success":return(0,f.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:a(),strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,f.jsx)("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),(0,f.jsx)("polyline",{points:"22 4 12 14.01 9 11.01"})]});case"error":return(0,f.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:a(),strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,f.jsx)("circle",{cx:"12",cy:"12",r:"10"}),(0,f.jsx)("line",{x1:"15",y1:"9",x2:"9",y2:"15"}),(0,f.jsx)("line",{x1:"9",y1:"9",x2:"15",y2:"15"})]});default:return(0,f.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:a(),strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,f.jsx)("circle",{cx:"12",cy:"12",r:"10"}),(0,f.jsx)("line",{x1:"12",y1:"16",x2:"12",y2:"12"}),(0,f.jsx)("line",{x1:"12",y1:"8",x2:"12.01",y2:"8"})]})}})(),(0,f.jsx)("h3",{style:{color:"white",fontSize:"18px",fontWeight:"bold",margin:"16px 0 8px",textAlign:"center"},children:t.title}),(0,f.jsx)("p",{style:{color:"white",fontSize:"14px",margin:"0 0 24px",textAlign:"center"},children:t.message}),(0,f.jsx)("button",{onClick:c,style:{padding:"10px 40px",borderRadius:"50px",border:"none",background:"linear-gradient(to right, #4ADE80, #3B82F6)",color:"white",fontWeight:"bold",cursor:"pointer",transition:"opacity 0.2s ease"},onMouseOver:e=>e.currentTarget.style.opacity="0.9",onMouseOut:e=>e.currentTarget.style.opacity="1",children:"Ok"})]})]})}}},function(e){e.O(0,[5348,8633,4852,4999,1744],function(){return e(e.s=74705)}),_N_E=e.O()}]);