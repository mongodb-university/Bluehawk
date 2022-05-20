"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[583],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return f}});var i=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,i,a=function(e,n){if(null==e)return{};var t,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var p=i.createContext({}),c=function(e){var n=i.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=c(e.components);return i.createElement(p.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},d=i.forwardRef((function(e,n){var t=e.components,a=e.mdxType,r=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=c(t),f=a,g=d["".concat(p,".").concat(f)]||d[f]||s[f]||r;return t?i.createElement(g,o(o({ref:n},u),{},{components:t})):i.createElement(g,o({ref:n},u))}));function f(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var r=t.length,o=new Array(r);o[0]=d;var l={};for(var p in n)hasOwnProperty.call(n,p)&&(l[p]=n[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<r;c++)o[c]=t[c];return i.createElement.apply(null,o)}return i.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2343:function(e,n,t){t.r(n),t.d(n,{assets:function(){return u},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return s}});var i=t(7462),a=t(3366),r=(t(7294),t(3905)),o=["components"],l={id:"LanguageSpecification",title:"Interface: LanguageSpecification",sidebar_label:"LanguageSpecification",sidebar_position:0,custom_edit_url:null},p=void 0,c={unversionedId:"develop/api/interfaces/LanguageSpecification",id:"develop/api/interfaces/LanguageSpecification",title:"Interface: LanguageSpecification",description:"Properties",source:"@site/docs/develop/api/interfaces/LanguageSpecification.md",sourceDirName:"develop/api/interfaces",slug:"/develop/api/interfaces/LanguageSpecification",permalink:"/Bluehawk/develop/api/interfaces/LanguageSpecification",draft:!1,editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"LanguageSpecification",title:"Interface: LanguageSpecification",sidebar_label:"LanguageSpecification",sidebar_position:0,custom_edit_url:null},sidebar:"mainSidebar",previous:{title:"IVisitor",permalink:"/Bluehawk/develop/api/interfaces/IVisitor"},next:{title:"LineTagNode",permalink:"/Bluehawk/develop/api/interfaces/LineTagNode"}},u={},s=[{value:"Properties",id:"properties",level:2},{value:"blockComments",id:"blockcomments",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"languageId",id:"languageid",level:3},{value:"Defined in",id:"defined-in-1",level:4},{value:"lineComments",id:"linecomments",level:3},{value:"Defined in",id:"defined-in-2",level:4},{value:"parserPushers",id:"parserpushers",level:3},{value:"Defined in",id:"defined-in-3",level:4},{value:"stringLiterals",id:"stringliterals",level:3},{value:"Defined in",id:"defined-in-4",level:4}],d={toc:s};function f(e){var n=e.components,t=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,i.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("h3",{id:"blockcomments"},"blockComments"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,r.kt)("strong",{parentName:"p"},"blockComments"),": ","[",(0,r.kt)("inlineCode",{parentName:"p"},"RegExp"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"RegExp"),"][]"),(0,r.kt)("h4",{id:"defined-in"},"Defined in"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/LanguageSpecification.ts#L9"},"src/bluehawk/parser/LanguageSpecification.ts:9")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"languageid"},"languageId"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("strong",{parentName:"p"},"languageId"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"string")),(0,r.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/LanguageSpecification.ts#L3"},"src/bluehawk/parser/LanguageSpecification.ts:3")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"linecomments"},"lineComments"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,r.kt)("strong",{parentName:"p"},"lineComments"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"RegExp"),"[]"),(0,r.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/LanguageSpecification.ts#L6"},"src/bluehawk/parser/LanguageSpecification.ts:6")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"parserpushers"},"parserPushers"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,r.kt)("strong",{parentName:"p"},"parserPushers"),": { ",(0,r.kt)("inlineCode",{parentName:"p"},"endNewParserAfterPopToken?"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"boolean")," ; ",(0,r.kt)("inlineCode",{parentName:"p"},"languageId"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"string")," ; ",(0,r.kt)("inlineCode",{parentName:"p"},"patterns"),": ","[",(0,r.kt)("inlineCode",{parentName:"p"},"RegExp"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"RegExp"),"]"," ; ",(0,r.kt)("inlineCode",{parentName:"p"},"startNewParserOnPushToken?"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"boolean"),"  }[]"),(0,r.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/LanguageSpecification.ts#L22"},"src/bluehawk/parser/LanguageSpecification.ts:22")),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"stringliterals"},"stringLiterals"),(0,r.kt)("p",null,"\u2022 ",(0,r.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,r.kt)("strong",{parentName:"p"},"stringLiterals"),": { ",(0,r.kt)("inlineCode",{parentName:"p"},"multiline"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"boolean")," ; ",(0,r.kt)("inlineCode",{parentName:"p"},"pattern"),": ",(0,r.kt)("inlineCode",{parentName:"p"},"RegExp"),"  }[]"),(0,r.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/Bluehawk/blob/393f8c7/src/bluehawk/parser/LanguageSpecification.ts#L13"},"src/bluehawk/parser/LanguageSpecification.ts:13")))}f.isMDXComponent=!0}}]);