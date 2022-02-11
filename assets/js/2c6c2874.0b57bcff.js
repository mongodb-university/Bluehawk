"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[972],{3905:function(e,r,n){n.d(r,{Zo:function(){return d},kt:function(){return k}});var t=n(7294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function i(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?i(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function o(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},i=Object.keys(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=t.createContext({}),u=function(e){var r=t.useContext(s),n=r;return e&&(n="function"==typeof e?e(r):l(l({},r),e)),n},d=function(e){var r=u(e.components);return t.createElement(s.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},c=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),c=u(n),k=a,h=c["".concat(s,".").concat(k)]||c[k]||p[k]||i;return n?t.createElement(h,l(l({ref:r},d),{},{components:n})):t.createElement(h,l({ref:r},d))}));function k(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var i=n.length,l=new Array(i);l[0]=c;var o={};for(var s in r)hasOwnProperty.call(r,s)&&(o[s]=r[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var u=2;u<i;u++)l[u]=n[u];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}c.displayName="MDXCreateElement"},6443:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return o},contentTitle:function(){return s},metadata:function(){return u},toc:function(){return d},default:function(){return c}});var t=n(7462),a=n(3366),i=(n(7294),n(3905)),l=["components"],o={id:"PushParserPayload",title:"Interface: PushParserPayload",sidebar_label:"PushParserPayload",sidebar_position:0,custom_edit_url:null},s=void 0,u={unversionedId:"api/interfaces/PushParserPayload",id:"api/interfaces/PushParserPayload",isDocsHomePage:!1,title:"Interface: PushParserPayload",description:"Properties",source:"@site/docs/api/interfaces/PushParserPayload.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/PushParserPayload",permalink:"/Bluehawk/api/interfaces/PushParserPayload",editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"PushParserPayload",title:"Interface: PushParserPayload",sidebar_label:"PushParserPayload",sidebar_position:0,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"Project",permalink:"/Bluehawk/api/interfaces/Project"},next:{title:"PushParserTokenConfiguration",permalink:"/Bluehawk/api/interfaces/PushParserTokenConfiguration"}},d=[{value:"Properties",id:"properties",children:[{value:"endToken",id:"endtoken",children:[{value:"Defined in",id:"defined-in",children:[],level:4}],level:3},{value:"fullText",id:"fulltext",children:[{value:"Defined in",id:"defined-in-1",children:[],level:4}],level:3},{value:"includePopTokenInSubstring",id:"includepoptokeninsubstring",children:[{value:"Defined in",id:"defined-in-2",children:[],level:4}],level:3},{value:"includePushTokenInSubstring",id:"includepushtokeninsubstring",children:[{value:"Defined in",id:"defined-in-3",children:[],level:4}],level:3},{value:"parserId",id:"parserid",children:[{value:"Defined in",id:"defined-in-4",children:[],level:4}],level:3}],level:2}],p={toc:d};function c(e){var r=e.components,n=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,t.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"properties"},"Properties"),(0,i.kt)("h3",{id:"endtoken"},"endToken"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"endToken"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"TokenType")),(0,i.kt)("h4",{id:"defined-in"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/0ab0d3b/src/bluehawk/parser/lexer/makePushParserTokens.ts#L16"},"src/bluehawk/parser/lexer/makePushParserTokens.ts:16")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"fulltext"},"fullText"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"fullText"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"string")),(0,i.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/0ab0d3b/src/bluehawk/parser/lexer/makePushParserTokens.ts#L12"},"src/bluehawk/parser/lexer/makePushParserTokens.ts:12")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"includepoptokeninsubstring"},"includePopTokenInSubstring"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"includePopTokenInSubstring"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"boolean")),(0,i.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/0ab0d3b/src/bluehawk/parser/lexer/makePushParserTokens.ts#L15"},"src/bluehawk/parser/lexer/makePushParserTokens.ts:15")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"includepushtokeninsubstring"},"includePushTokenInSubstring"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"includePushTokenInSubstring"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"boolean")),(0,i.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/0ab0d3b/src/bluehawk/parser/lexer/makePushParserTokens.ts#L14"},"src/bluehawk/parser/lexer/makePushParserTokens.ts:14")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"parserid"},"parserId"),(0,i.kt)("p",null,"\u2022 ",(0,i.kt)("strong",{parentName:"p"},"parserId"),": ",(0,i.kt)("inlineCode",{parentName:"p"},"string")),(0,i.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/0ab0d3b/src/bluehawk/parser/lexer/makePushParserTokens.ts#L13"},"src/bluehawk/parser/lexer/makePushParserTokens.ts:13")))}c.isMDXComponent=!0}}]);