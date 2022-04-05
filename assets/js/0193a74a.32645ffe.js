"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[768],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return h}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(n),h=i,f=d["".concat(c,".").concat(h)]||d[h]||u[h]||a;return n?r.createElement(f,o(o({ref:t},p),{},{components:n})):r.createElement(f,o({ref:t},p))}));function h(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var s=2;s<a;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8887:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return p},default:function(){return d}});var r=n(7462),i=n(3366),a=(n(7294),n(3905)),o=["components"],l={id:"CheckArgs",title:"Interface: CheckArgs",sidebar_label:"CheckArgs",sidebar_position:0,custom_edit_url:null},c=void 0,s={unversionedId:"api/interfaces/CheckArgs",id:"api/interfaces/CheckArgs",isDocsHomePage:!1,title:"Interface: CheckArgs",description:"Hierarchy",source:"@site/docs/api/interfaces/CheckArgs.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/CheckArgs",permalink:"/Bluehawk/api/interfaces/CheckArgs",editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"CheckArgs",title:"Interface: CheckArgs",sidebar_label:"CheckArgs",sidebar_position:0,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"BlockTagNode",permalink:"/Bluehawk/api/interfaces/BlockTagNode"},next:{title:"CopyArgs",permalink:"/Bluehawk/api/interfaces/CopyArgs"}},p=[{value:"Hierarchy",id:"hierarchy",children:[],level:2},{value:"Properties",id:"properties",children:[{value:"ignore",id:"ignore",children:[{value:"Defined in",id:"defined-in",children:[],level:4}],level:3},{value:"json",id:"json",children:[{value:"Defined in",id:"defined-in-1",children:[],level:4}],level:3},{value:"paths",id:"paths",children:[{value:"Defined in",id:"defined-in-2",children:[],level:4}],level:3},{value:"waitForListeners",id:"waitforlisteners",children:[{value:"Inherited from",id:"inherited-from",children:[],level:4},{value:"Defined in",id:"defined-in-3",children:[],level:4}],level:3}],level:2}],u={toc:p};function d(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"hierarchy"},"Hierarchy"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"ActionArgs"},(0,a.kt)("inlineCode",{parentName:"a"},"ActionArgs"))),(0,a.kt)("p",{parentName:"li"},"\u21b3 ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"CheckArgs"))))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("h3",{id:"ignore"},"ignore"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"ignore"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string")," ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"string"),"[]"),(0,a.kt)("h4",{id:"defined-in"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/7bfd652/src/bluehawk/actions/check.ts#L9"},"src/bluehawk/actions/check.ts:9")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"json"},"json"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"json"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/7bfd652/src/bluehawk/actions/check.ts#L10"},"src/bluehawk/actions/check.ts:10")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"paths"},"paths"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"paths"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string"),"[]"),(0,a.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/7bfd652/src/bluehawk/actions/check.ts#L8"},"src/bluehawk/actions/check.ts:8")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"waitforlisteners"},"waitForListeners"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"waitForListeners"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"inherited-from"},"Inherited from"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"ActionArgs"},"ActionArgs"),".",(0,a.kt)("a",{parentName:"p",href:"ActionArgs#waitforlisteners"},"waitForListeners")),(0,a.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/7bfd652/src/bluehawk/actions/ActionArgs.ts#L2"},"src/bluehawk/actions/ActionArgs.ts:2")))}d.isMDXComponent=!0}}]);