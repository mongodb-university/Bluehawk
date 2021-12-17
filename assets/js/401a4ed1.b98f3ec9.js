"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[234],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=o.createContext({}),p=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=p(e.components);return o.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=p(n),m=r,h=d["".concat(l,".").concat(m)]||d[m]||c[m]||a;return n?o.createElement(h,s(s({ref:t},u),{},{components:n})):o.createElement(h,s({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,s=new Array(a);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var p=2;p<a;p++)s[p]=n[p];return o.createElement.apply(null,s)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3135:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var o=n(7462),r=n(3366),a=(n(7294),n(3905)),s=["components"],i={id:"use-cases",title:"Use Cases",sidebar_label:"Use Cases",sidebar_position:3,custom_edit_url:null},l=void 0,p={unversionedId:"use-cases",id:"use-cases",isDocsHomePage:!1,title:"Use Cases",description:"Tested Code Examples",source:"@site/docs/use-cases.md",sourceDirName:".",slug:"/use-cases",permalink:"/Bluehawk/use-cases",editUrl:null,tags:[],version:"current",sidebarPosition:3,frontMatter:{id:"use-cases",title:"Use Cases",sidebar_label:"Use Cases",sidebar_position:3,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"CLI",permalink:"/Bluehawk/cli"},next:{title:"Plugins",permalink:"/Bluehawk/plugins"}},u=[{value:"Tested Code Examples",id:"tested-code-examples",children:[],level:3},{value:"Checkpointed Tutorials",id:"checkpointed-tutorials",children:[],level:3}],c={toc:u};function d(e){var t=e.components,n=(0,r.Z)(e,s);return(0,a.kt)("wrapper",(0,o.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h3",{id:"tested-code-examples"},"Tested Code Examples"),(0,a.kt)("p",null,"Imagine you want to paste some code from a unit test into your docs. You can\nmark up the unit test source file like this with Bluehawk commands like\n",(0,a.kt)("inlineCode",{parentName:"p"},":snippet-start:"),", ",(0,a.kt)("inlineCode",{parentName:"p"},":snippet-end:"),", ",(0,a.kt)("inlineCode",{parentName:"p"},":remove-start:"),", and ",(0,a.kt)("inlineCode",{parentName:"p"},":remove-end:"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-swift"},'// SomeTest.swift\n\n// ... more tests ...\nfunc someTest() {\n    // :snippet-start: some-example\n    let person = getPerson()\n    // :remove-start: // hide test boilerplate from the code block\n    XCTAssert(person.name != "Keith")\n    // :remove-end:\n    person.doSomething {\n        person.doSomethingElse()\n    }\n    // :snippet-end:\n}\n// ... more tests ...\n')),(0,a.kt)("p",null,"Running Bluehawk with the ",(0,a.kt)("inlineCode",{parentName:"p"},"snip")," command on this file will produce a snippet\nfile called ",(0,a.kt)("inlineCode",{parentName:"p"},"SomeTest.codeblock.some-example.swift")," that looks something like this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-swift"},"let person = getPerson()\nperson.doSomething {\n    person.doSomethingElse()\n}\n")),(0,a.kt)("p",null,"You can now import this snippet into your documentation. Now you have the\nbenefit of tested examples that are still easy to read in the docs."),(0,a.kt)("p",null,"Bluehawk markup can go into any source file, so you don't need to rig every unit\ntest framework you use up to also extract code examples. Just use Bluehawk with\nthe unit test framework that suits your language and your project. Heck, you don't\neven need a unit test framework. Use Bluehawk in your app or bash script that you\nrun to make sure everything's still more or less working."),(0,a.kt)("h3",{id:"checkpointed-tutorials"},"Checkpointed Tutorials"),(0,a.kt)("p",null,'Suppose you have a tutorial repo that learners can clone to follow along with\nyour tutorial from a certain starting point, say a "start" branch. You also want\nlearners to be able to check out a "final" branch so they can see the finished\nproject. As the tutorial developer, you would have to maintain these two state\nbranches, which can be tedious and error prone.'),(0,a.kt)("p",null,"To manage this process, you can use Bluehawk to mark up your tutorial source and\nindicate different states or checkpoints with the ",(0,a.kt)("inlineCode",{parentName:"p"},":state-start:")," and\n",(0,a.kt)("inlineCode",{parentName:"p"},":state-end:")," commands:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-swift"},"// WelcomeViewController.swift\n\n// ... more code ...\n// :snippet-start: sign-up\n@objc func signUp() {\n    // :state-start: final\n    setLoading(true);\n    app.emailPasswordAuth.registerUser(email: email!, password: password!, completion: { [weak self](error) in\n        DispatchQueue.main.async {\n            self!.setLoading(false);\n            ...\n        }\n    })\n    // :state-end:\n    // :state-start: start\n    // TODO: Use the app's emailPasswordAuth to registerUser with the email and password.\n    // When registered, call signIn().\n    // :state-uncomment-end:\n}\n// :snippet-end:\n// ... more code ...\n")),(0,a.kt)("p",null,"Running ",(0,a.kt)("inlineCode",{parentName:"p"},"bluehawk copy")," on this file with ",(0,a.kt)("inlineCode",{parentName:"p"},"--state start")," results in a copy of\n",(0,a.kt)("inlineCode",{parentName:"p"},"WelcomeViewController.swift")," that looks something like this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-swift"},"// WelcomeViewController.swift\n\n// ... more code ...\n@objc func signUp() {\n    // TODO: Use the app's emailPasswordAuth to registerUser with the email and password.\n    // When registered, call signIn().\n}\n// ... more code ...\n")),(0,a.kt)("p",null,'Notice that you still have all of the boilerplate, but no final implementation\ncode. Only the "TODO" is left.'),(0,a.kt)("p",null,"Using the ",(0,a.kt)("inlineCode",{parentName:"p"},"--state final")," flag produces another version of\n",(0,a.kt)("inlineCode",{parentName:"p"},"WelcomeViewController.swift"),' that has the boilerplate and the final\nimplementation code, but no "TODO":'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-swift"},"// WelcomeViewController.swift\n\n// ... more code ...\n@objc func signUp() {\n    setLoading(true);\n    app.emailPasswordAuth.registerUser(email: email!, password: password!, completion: { [weak self](error) in\n        DispatchQueue.main.async {\n            self!.setLoading(false);\n            ...\n        }\n    })\n}\n// ... more code ...\n")),(0,a.kt)("p",null,"You can run Bluehawk on an entire directory, and each file in the repo will be\ncopied or transformed to the destination. This makes it easy to copy one state\nof the entire tutorial source into another repo that learners can clone."))}d.isMDXComponent=!0}}]);