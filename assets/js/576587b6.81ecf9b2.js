"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8915],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(n),f=i,k=d["".concat(s,".").concat(f)]||d[f]||u[f]||a;return n?r.createElement(k,o(o({ref:t},c),{},{components:n})):r.createElement(k,o({ref:t},c))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var p=2;p<a;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1722:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return l},metadata:function(){return p},toc:function(){return u}});var r=n(7462),i=n(3366),a=(n(7294),n(3905)),o=["components"],l={id:"CheckArgs",title:"Interface: CheckArgs",sidebar_label:"CheckArgs",sidebar_position:0,custom_edit_url:null},s=void 0,p={unversionedId:"develop/api/interfaces/CheckArgs",id:"develop/api/interfaces/CheckArgs",title:"Interface: CheckArgs",description:"Hierarchy",source:"@site/docs/develop/api/interfaces/CheckArgs.md",sourceDirName:"develop/api/interfaces",slug:"/develop/api/interfaces/CheckArgs",permalink:"/Bluehawk/develop/api/interfaces/CheckArgs",draft:!1,editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"CheckArgs",title:"Interface: CheckArgs",sidebar_label:"CheckArgs",sidebar_position:0,custom_edit_url:null},sidebar:"mainSidebar",previous:{title:"BlockTagNode",permalink:"/Bluehawk/develop/api/interfaces/BlockTagNode"},next:{title:"CheckResult",permalink:"/Bluehawk/develop/api/interfaces/CheckResult"}},c={},u=[{value:"Hierarchy",id:"hierarchy",level:2},{value:"Properties",id:"properties",level:2},{value:"ignore",id:"ignore",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"json",id:"json",level:3},{value:"Defined in",id:"defined-in-1",level:4},{value:"logLevel",id:"loglevel",level:3},{value:"Inherited from",id:"inherited-from",level:4},{value:"Defined in",id:"defined-in-2",level:4},{value:"paths",id:"paths",level:3},{value:"Defined in",id:"defined-in-3",level:4},{value:"waitForListeners",id:"waitforlisteners",level:3},{value:"Inherited from",id:"inherited-from-1",level:4},{value:"Defined in",id:"defined-in-4",level:4}],d={toc:u};function f(e){var t=e.components,n=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"hierarchy"},"Hierarchy"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("a",{parentName:"p",href:"ActionArgs"},(0,a.kt)("inlineCode",{parentName:"a"},"ActionArgs"))),(0,a.kt)("p",{parentName:"li"},"\u21b3 ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("inlineCode",{parentName:"strong"},"CheckArgs"))))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("h3",{id:"ignore"},"ignore"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"ignore"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string")," ","|"," ",(0,a.kt)("inlineCode",{parentName:"p"},"string"),"[]"),(0,a.kt)("h4",{id:"defined-in"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/6f4d9a1/src/bluehawk/actions/check.ts#L9"},"src/bluehawk/actions/check.ts:9")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"json"},"json"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"json"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/6f4d9a1/src/bluehawk/actions/check.ts#L10"},"src/bluehawk/actions/check.ts:10")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"loglevel"},"logLevel"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"logLevel"),": ",(0,a.kt)("a",{parentName:"p",href:"../enums/LogLevel"},(0,a.kt)("inlineCode",{parentName:"a"},"LogLevel"))),(0,a.kt)("h4",{id:"inherited-from"},"Inherited from"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"ActionArgs"},"ActionArgs"),".",(0,a.kt)("a",{parentName:"p",href:"ActionArgs#loglevel"},"logLevel")),(0,a.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/6f4d9a1/src/bluehawk/actions/ActionArgs.ts#L3"},"src/bluehawk/actions/ActionArgs.ts:3")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"paths"},"paths"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("strong",{parentName:"p"},"paths"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"string"),"[]"),(0,a.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/6f4d9a1/src/bluehawk/actions/check.ts#L8"},"src/bluehawk/actions/check.ts:8")),(0,a.kt)("hr",null),(0,a.kt)("h3",{id:"waitforlisteners"},"waitForListeners"),(0,a.kt)("p",null,"\u2022 ",(0,a.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,a.kt)("strong",{parentName:"p"},"waitForListeners"),": ",(0,a.kt)("inlineCode",{parentName:"p"},"boolean")),(0,a.kt)("h4",{id:"inherited-from-1"},"Inherited from"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"ActionArgs"},"ActionArgs"),".",(0,a.kt)("a",{parentName:"p",href:"ActionArgs#waitforlisteners"},"waitForListeners")),(0,a.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/6f4d9a1/src/bluehawk/actions/ActionArgs.ts#L4"},"src/bluehawk/actions/ActionArgs.ts:4")))}f.isMDXComponent=!0}}]);