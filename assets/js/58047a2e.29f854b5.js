"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4424],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return f}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),d=u(r),f=a,m=d["".concat(s,".").concat(f)]||d[f]||c[f]||i;return r?n.createElement(m,l(l({ref:t},p),{},{components:r})):n.createElement(m,l({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var u=2;u<i;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},1846:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return o},contentTitle:function(){return s},metadata:function(){return u},toc:function(){return p},default:function(){return d}});var n=r(7462),a=r(3366),i=(r(7294),r(3905)),l=["components"],o={id:"ParseResult",title:"Interface: ParseResult",sidebar_label:"ParseResult",sidebar_position:0,custom_edit_url:null},s=void 0,u={unversionedId:"develop/api/interfaces/ParseResult",id:"develop/api/interfaces/ParseResult",isDocsHomePage:!1,title:"Interface: ParseResult",description:"Properties",source:"@site/docs/develop/api/interfaces/ParseResult.md",sourceDirName:"develop/api/interfaces",slug:"/develop/api/interfaces/ParseResult",permalink:"/Bluehawk/develop/api/interfaces/ParseResult",editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"ParseResult",title:"Interface: ParseResult",sidebar_label:"ParseResult",sidebar_position:0,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"ListTagArgs",permalink:"/Bluehawk/develop/api/interfaces/ListTagArgs"},next:{title:"PayloadQuery",permalink:"/Bluehawk/develop/api/interfaces/PayloadQuery"}},p=[{value:"Properties",id:"properties",children:[{value:"errors",id:"errors",children:[{value:"Defined in",id:"defined-in",children:[],level:4}],level:3},{value:"languageSpecification",id:"languagespecification",children:[{value:"Defined in",id:"defined-in-1",children:[],level:4}],level:3},{value:"source",id:"source",children:[{value:"Defined in",id:"defined-in-2",children:[],level:4}],level:3},{value:"tagNodes",id:"tagnodes",children:[{value:"Defined in",id:"defined-in-3",children:[],level:4}],level:3}],level:2}],c={toc:p};function d(e){var t=e.components,r=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("h3",{id:"errors"},"errors"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"errors"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"BluehawkError"),"[]"),(0,i.kt)("h4",{id:"defined-in"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/5a52a1b/src/bluehawk/parser/ParseResult.ts#L7"},"src/bluehawk/parser/ParseResult.ts:7")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"languagespecification"},"languageSpecification"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,i.kt)("strong",{parentName:"p"},"languageSpecification"),": ",(0,i.kt)("a",{parentName:"p",href:"LanguageSpecification"},(0,i.kt)("inlineCode",{parentName:"a"},"LanguageSpecification"))),(0,i.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/5a52a1b/src/bluehawk/parser/ParseResult.ts#L10"},"src/bluehawk/parser/ParseResult.ts:10")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"source"},"source"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"source"),": ",(0,i.kt)("a",{parentName:"p",href:"../classes/Document"},(0,i.kt)("inlineCode",{parentName:"a"},"Document"))),(0,i.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/5a52a1b/src/bluehawk/parser/ParseResult.ts#L9"},"src/bluehawk/parser/ParseResult.ts:9")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"tagnodes"},"tagNodes"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"tagNodes"),": ",(0,i.kt)("a",{parentName:"p",href:"../modules#anytagnode"},(0,i.kt)("inlineCode",{parentName:"a"},"AnyTagNode")),"[]"),(0,i.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/5a52a1b/src/bluehawk/parser/ParseResult.ts#L8"},"src/bluehawk/parser/ParseResult.ts:8")))}d.isMDXComponent=!0}}]);