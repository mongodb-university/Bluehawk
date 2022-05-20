"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[92],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return f}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),p=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},s=function(e){var t=p(e.components);return n.createElement(u.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),c=p(r),f=a,k=c["".concat(u,".").concat(f)]||c[f]||d[f]||i;return r?n.createElement(k,l(l({ref:t},s),{},{components:r})):n.createElement(k,l({ref:t},s))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=c;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var p=2;p<i;p++)l[p]=r[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}c.displayName="MDXCreateElement"},168:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return u},default:function(){return f},frontMatter:function(){return o},metadata:function(){return p},toc:function(){return d}});var n=r(7462),a=r(3366),i=(r(7294),r(3905)),l=["components"],o={id:"PayloadQuery",title:"Interface: PayloadQuery",sidebar_label:"PayloadQuery",sidebar_position:0,custom_edit_url:null},u=void 0,p={unversionedId:"develop/api/interfaces/PayloadQuery",id:"develop/api/interfaces/PayloadQuery",title:"Interface: PayloadQuery",description:"Properties",source:"@site/docs/develop/api/interfaces/PayloadQuery.md",sourceDirName:"develop/api/interfaces",slug:"/develop/api/interfaces/PayloadQuery",permalink:"/Bluehawk/develop/api/interfaces/PayloadQuery",draft:!1,editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"PayloadQuery",title:"Interface: PayloadQuery",sidebar_label:"PayloadQuery",sidebar_position:0,custom_edit_url:null},sidebar:"mainSidebar",previous:{title:"ParseResult",permalink:"/Bluehawk/develop/api/interfaces/ParseResult"},next:{title:"PluginArgs",permalink:"/Bluehawk/develop/api/interfaces/PluginArgs"}},s={},d=[{value:"Properties",id:"properties",level:2},{value:"groups",id:"groups",level:3},{value:"Index signature",id:"index-signature",level:4},{value:"Defined in",id:"defined-in",level:4},{value:"offset",id:"offset",level:3},{value:"Defined in",id:"defined-in-1",level:4},{value:"result",id:"result",level:3},{value:"Defined in",id:"defined-in-2",level:4},{value:"text",id:"text",level:3},{value:"Defined in",id:"defined-in-3",level:4},{value:"tokens",id:"tokens",level:3},{value:"Defined in",id:"defined-in-4",level:4}],c={toc:d};function f(e){var t=e.components,r=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("h3",{id:"groups"},"groups"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"groups"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"Object")),(0,i.kt)("h4",{id:"index-signature"},"Index signature"),(0,i.kt)("p",null,"\u25aa ","[groupName: ",(0,i.kt)("inlineCode",{parentName:"p"},"string"),"]",": ",(0,i.kt)("inlineCode",{parentName:"p"},"IToken"),"[]"),(0,i.kt)("h4",{id:"defined-in"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/lexer/makePayloadPattern.ts#L11"},"src/bluehawk/parser/lexer/makePayloadPattern.ts:11")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"offset"},"offset"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"offset"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"number")),(0,i.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/lexer/makePayloadPattern.ts#L9"},"src/bluehawk/parser/lexer/makePayloadPattern.ts:9")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"result"},"result"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"result"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"RegExpExecArray")),(0,i.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/lexer/makePayloadPattern.ts#L14"},"src/bluehawk/parser/lexer/makePayloadPattern.ts:14")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"text"},"text"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"text"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"string")),(0,i.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/lexer/makePayloadPattern.ts#L8"},"src/bluehawk/parser/lexer/makePayloadPattern.ts:8")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"tokens"},"tokens"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"tokens"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"IToken"),"[]"),(0,i.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/lexer/makePayloadPattern.ts#L10"},"src/bluehawk/parser/lexer/makePayloadPattern.ts:10")))}f.isMDXComponent=!0}}]);