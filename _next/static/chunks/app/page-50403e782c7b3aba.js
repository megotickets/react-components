(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1931],{22809:function(e,s,l){Promise.resolve().then(l.bind(l,79452))},79452:function(e,s,l){"use strict";l.r(s),l.d(s,{default:function(){return i}});var t=l(89075),o=l(68064);l(25267);var n=l(50511);function a(){return(0,t.jsxs)("div",{className:"flex flex-col gap-4 p-4",children:[(0,t.jsx)("h2",{className:"text-xl font-bold mb-4",children:"Dettagli Evento"}),(0,t.jsx)(o.Sjq,{ticketId:"694b4ce9-9f0c-4756-8dcb-ad0889078da6"}),(0,t.jsx)(o.Sjq,{ticketId:"254054d2-ae01-4fb9-9fde-9cd4c8ae72d3"})]})}function r(){let{loggedAs:e,provider:s,signMessageWithGoogle:l,signMessageWithApple:r}=(0,o.Z_N)(),{isConnected:i}=(0,o.mAM)(),[d,c]=(0,n.useState)(""),[u,m]=(0,n.useState)(null),g=e=>e?e.toLowerCase().includes("google")?"Google":e.toLowerCase().includes("apple")?"Apple":e:"Nessun provider";(0,n.useEffect)(()=>{var e,s;let l=new URLSearchParams(null===(s=window)||void 0===s?void 0:null===(e=s.location)||void 0===e?void 0:e.search).get("signature");l&&m(l)},[]);let[x,h]=(0,n.useState)(!1);return(0,t.jsxs)("div",{className:"flex flex-col gap-4 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full ".concat(e?"bg-green-500":"bg-red-500")}),(0,t.jsx)("p",{className:"text-lg font-medium text-white",children:e?"Connesso":"Disconnesso"})]}),(0,t.jsxs)("div",{className:"bg-gray-800 p-3 rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-gray-400 mb-1",children:"Provider"}),(0,t.jsx)("p",{className:"text-white font-mono truncate",children:g(s)})]}),e&&((null==s?void 0:s.toLowerCase().includes("google"))||(null==s?void 0:s.toLowerCase().includes("apple")))&&(0,t.jsxs)("div",{className:"mt-4 bg-gray-800 p-4 rounded-lg",children:[(0,t.jsx)("h3",{className:"text-white font-medium mb-3",children:"Test Firma con Mego"}),(0,t.jsxs)("div",{className:"mb-3",children:[(0,t.jsx)("label",{className:"text-sm text-gray-400 block mb-1",children:"Messaggio da firmare"}),(0,t.jsx)("textarea",{value:d,onChange:e=>c(e.target.value),className:"w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500",rows:3})]}),(0,t.jsxs)("button",{onClick:()=>{let e=window.location.href.split("?")[0];(null==s?void 0:s.toLowerCase().includes("google"))?l(e,d):(null==s?void 0:s.toLowerCase().includes("apple"))?r(e,d):alert("Firma disponibile solo con provider Google o Apple")},disabled:0===d.length,className:"bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ".concat(0===d.length?"opacity-50 cursor-not-allowed":""),children:["Firma con ",g(s)]}),u&&(0,t.jsxs)("div",{className:"mt-4 bg-gray-800 p-4 rounded-lg",children:[(0,t.jsx)("h3",{className:"text-white font-medium mb-3",children:"Firma conseguita"}),(0,t.jsx)("p",{className:"text-white",children:u})]})]}),(0,t.jsx)(a,{})]})}function i(){return(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{children:"@megotickets/wallet"}),(0,t.jsx)(o.Qgv,{children:(0,t.jsxs)(o.grn,{children:[(0,t.jsx)(o.HOu,{forceChainId:10,customStyle:{modalStyle:{}}}),(0,t.jsx)("div",{className:"mt-10",children:(0,t.jsx)(r,{})})]})})]})}},25267:function(){}},function(e){e.O(0,[2908,637,8064,4852,4999,1744],function(){return e(e.s=22809)}),_N_E=e.O()}]);