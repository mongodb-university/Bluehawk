"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7113],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return h}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),p=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=p(n),h=o,m=d["".concat(l,".").concat(h)]||d[h]||c[h]||r;return n?a.createElement(m,i(i({ref:t},u),{},{components:n})):a.createElement(m,i({ref:t},u))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var p=2;p<r;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},562:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return c}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i=["components"],s={id:"tutorials",title:"Create Checkpointed Tutorials",slug:"/tutorials/",sidebar_label:"Checkpointed Tutorials",sidebar_position:2,custom_edit_url:null},l=void 0,p={unversionedId:"guides/tutorials",id:"guides/tutorials",title:"Create Checkpointed Tutorials",description:"Do you prefer learning through videos? Check out our video on",source:"@site/docs/guides/tutorials.md",sourceDirName:"guides",slug:"/tutorials/",permalink:"/Bluehawk/tutorials/",draft:!1,editUrl:null,tags:[],version:"current",sidebarPosition:2,frontMatter:{id:"tutorials",title:"Create Checkpointed Tutorials",slug:"/tutorials/",sidebar_label:"Checkpointed Tutorials",sidebar_position:2,custom_edit_url:null},sidebar:"mainSidebar",previous:{title:"Extract Code Snippets",permalink:"/Bluehawk/code-snippets/"},next:{title:"Continuous Integration",permalink:"/Bluehawk/continuous-integration/"}},u={},c=[{value:"State in Bluehawk",id:"state-in-bluehawk",level:2},{value:"Annotate the Tutorial",id:"annotate-the-tutorial",level:2},{value:"Use the CLI to Extract Snippets",id:"use-the-cli-to-extract-snippets",level:2},{value:"Include the Snippets In Your Documentation",id:"include-the-snippets-in-your-documentation",level:2},{value:"Automatically Update Tutorial Code",id:"automatically-update-tutorial-code",level:3}],d={toc:c};function h(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Do you prefer learning through videos? Check out our video on\n",(0,r.kt)("a",{parentName:"p",href:"/#generate-code-for-tutorial-apps"},"Generate Code for Tutorial Apps")))),(0,r.kt)("h2",{id:"state-in-bluehawk"},"State in Bluehawk"),(0,r.kt)("p",null,"Bluehawk has a concept we call ",(0,r.kt)("inlineCode",{parentName:"p"},"state"),'. This gives you the ability to\nrepresent different "states" for tutorials. For example, you might have\na ',(0,r.kt)("inlineCode",{parentName:"p"},"start")," state where a code example is a ",(0,r.kt)("inlineCode",{parentName:"p"},"TODO:")," block. Then, you might\nhave a ",(0,r.kt)("inlineCode",{parentName:"p"},"final")," state where the actual code exists in that code block."),(0,r.kt)("p",null,"The Realm Docs team uses ",(0,r.kt)("inlineCode",{parentName:"p"},"state")," to create checkpointed tutorials.\nThe output of a given state becomes a git repository branch; i.e. the ",(0,r.kt)("inlineCode",{parentName:"p"},"start"),"\nbranch. In this example, our\n",(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/realm-tutorial-react-native/blob/ee05c6d9eb8d2975e7f8d34679c8c2a94ce00298/providers/TasksProvider.js#L32"},"Realm React Native tutorial's start branch"),"\nfeatures several ",(0,r.kt)("inlineCode",{parentName:"p"},"TODO:")," blocks:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// TODO: Open the project realm with the given configuration and store\n// it in the realmRef. Once opened, fetch the Task objects in the realm,\n// sorted by name, and attach a listener to the Task collection. When the\n// listener fires, use the setTasks() function to apply the updated Tasks\n// list to the state.\n")),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"final")," branch has ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/realm-tutorial-react-native/blob/57cfbe9749972b50cbfa7df071d6cc60f1cc1f38/providers/TasksProvider.js#L32"},"completed code"),",\ninstead:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'Realm.open(config).then((projectRealm) => {\n  realmRef.current = projectRealm;\n\n  const syncTasks = projectRealm.objects("Task");\n  let sortedTasks = syncTasks.sorted("name");\n  setTasks([...sortedTasks]);\n  sortedTasks.addListener(() => {\n    setTasks([...sortedTasks]);\n  });\n});\n')),(0,r.kt)("p",null,"We manage this in a single file using Bluehawk ",(0,r.kt)("inlineCode",{parentName:"p"},"state"),". This simplifies\ntesting and maintaining the tutorials."),(0,r.kt)("p",null,"Under the covers, ",(0,r.kt)("inlineCode",{parentName:"p"},"state")," is an identifier that the Bluehawk CLI uses\nwhen it generates output."),(0,r.kt)("p",null,"You can use any string identifier you'd like as your ",(0,r.kt)("inlineCode",{parentName:"p"},"state")," keyword;\nwe use ",(0,r.kt)("inlineCode",{parentName:"p"},"start"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"final"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"local"),", and ",(0,r.kt)("inlineCode",{parentName:"p"},"sync")," based on what we are teaching\nin the tutorial. You use this identifier with a ",(0,r.kt)("a",{parentName:"p",href:"/reference/tags#state"},"state"),"\nor ",(0,r.kt)("a",{parentName:"p",href:"/reference/tags#state-uncomment"},"state-uncomment")," tag when you\nannotate a tutorial's code files."),(0,r.kt)("p",null,"Then, when you use the CLI to extract code snippets, you pass the ",(0,r.kt)("inlineCode",{parentName:"p"},"state"),"\nidentifier you used when annotating the file to extract just the code\nsnippets for that state. You pass this ",(0,r.kt)("a",{parentName:"p",href:"/reference/cli#state"},"state as a flag"),"\nto the Bluehawk CLI ",(0,r.kt)("a",{parentName:"p",href:"/reference/cli#snip"},"snip")," or ",(0,r.kt)("a",{parentName:"p",href:"/reference/cli#copy"},"copy"),"\ncommands."),(0,r.kt)("h2",{id:"annotate-the-tutorial"},"Annotate the Tutorial"),(0,r.kt)("p",null,"Start by annotating your tutorial with ",(0,r.kt)("a",{parentName:"p",href:"/reference/tags"},"Bluehawk tags"),".\nAs with ",(0,r.kt)("a",{parentName:"p",href:"code-snippets"},"code snippets"),", you open and close a code block\nwith ",(0,r.kt)("inlineCode",{parentName:"p"},"snippet-start")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"snippet-end"),". You can\n",(0,r.kt)("a",{parentName:"p",href:"code-snippets#hide-or-remove-code"},"hide or remove code")," if your tutorial\ncontains tests or boilerplate you don't want to expose in your documentation.\nYou can also ",(0,r.kt)("a",{parentName:"p",href:"code-snippets#replace"},"replace")," awkward terms with more\nreadable ones if you have any namespace issues, or want to rename things\nfor consistency across docs."),(0,r.kt)("p",null,"The key to tutorials, though, is adding ",(0,r.kt)("inlineCode",{parentName:"p"},"state")," annotations where you want\nthe content to change based on which state you want to show. This example\nis from the Realm React Native Tutorial\n",(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb/docs-realm/blob/master/tutorial/rn/providers/TasksProvider.js"},"TasksProvider.js file"),"."),(0,r.kt)("p",null,"We start a snippet called ",(0,r.kt)("inlineCode",{parentName:"p"},"clean-up"),". Then you see ",(0,r.kt)("inlineCode",{parentName:"p"},"// :state-start: final"),".\nIn this code snippet, ",(0,r.kt)("inlineCode",{parentName:"p"},"final")," is the identifier we use for\n",(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb-university/realm-tutorial-react-native/blob/final/providers/TasksProvider.js"},'the "final" branch'),"\nin our clonable tutorial git repository. The code after the ",(0,r.kt)("inlineCode",{parentName:"p"},"final")," state\nstart is the code that developers see in that branch."),(0,r.kt)("p",null,"Below that, you see ",(0,r.kt)("inlineCode",{parentName:"p"},"// :state-end: :state-uncomment-start: start")," all\non the same line. This line ends the ",(0,r.kt)("inlineCode",{parentName:"p"},":state-start: final")," from a few lines\nabove. Then, it starts a new state, called ",(0,r.kt)("inlineCode",{parentName:"p"},"start"),", and uncomments the\ncode in the ",(0,r.kt)("inlineCode",{parentName:"p"},"state-uncomment"),' section. The comment is "double commented" -\nafter uncommenting, it shows as a regular comment.'),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// :snippet-start: clean-up\nreturn () => {\n  // cleanup function\n  const projectRealm = realmRef.current;\n  if (projectRealm) {\n    // :state-start: final\n    projectRealm.close();\n    realmRef.current = null;\n    // :state-end: :state-uncomment-start: start\n    //// TODO: close the project realm and reset the realmRef's\n    //// current value to null.\n    // :state-uncomment-end:\n    setTasks([]);\n  }\n};\n// :snippet-end:\n")),(0,r.kt)("p",null,"After we extract the snippets, this code block looks like this in the ",(0,r.kt)("inlineCode",{parentName:"p"},"final"),"\nstate:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"return () => {\n  // cleanup function\n  const projectRealm = realmRef.current;\n  if (projectRealm) {\n    projectRealm.close();\n    realmRef.current = null;\n    setTasks([]);\n  }\n};\n")),(0,r.kt)("p",null,"And this in the ",(0,r.kt)("inlineCode",{parentName:"p"},"start")," state:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"return () => {\n  // cleanup function\n  const projectRealm = realmRef.current;\n  if (projectRealm) {\n    // TODO: close the project realm and reset the realmRef's\n    // current value to null.\n    setTasks([]);\n  }\n};\n")),(0,r.kt)("p",null,"You can see Bluehawk has removed one of the levels of comment nesting.\nIt shows only the ",(0,r.kt)("inlineCode",{parentName:"p"},"TODO:")," block in the ",(0,r.kt)("inlineCode",{parentName:"p"},"start")," state, while the\n",(0,r.kt)("inlineCode",{parentName:"p"},"final")," state shows only the final code - not the ",(0,r.kt)("inlineCode",{parentName:"p"},"TODO")," block at all."),(0,r.kt)("h2",{id:"use-the-cli-to-extract-snippets"},"Use the CLI to Extract Snippets"),(0,r.kt)("p",null,"After you have annotated your tutorial code, use the Bluehawk CLI to extract\ncode snippets. The process is the same as when\n",(0,r.kt)("a",{parentName:"p",href:"code-snippets#use-the-cli-to-extract-snippets"},"extracting code examples"),",\nbecause you're doing the same thing - you just pass an additional ",(0,r.kt)("inlineCode",{parentName:"p"},"--state"),"\nflag to indicate which state you want in the code example."),(0,r.kt)("p",null,"As with extracting code examples, you use the ",(0,r.kt)("inlineCode",{parentName:"p"},"bluehawk snip")," command,\nand you can\n",(0,r.kt)("a",{parentName:"p",href:"code-snippets#extract-code-from-a-single-file"},"extract code from a single file"),"\nor ",(0,r.kt)("a",{parentName:"p",href:"code-snippets#extract-code-in-a-directory"},"from a directory"),". But you\nmust run the command more than once, and each time you pass it the ",(0,r.kt)("inlineCode",{parentName:"p"},"state"),"\nidentifier whose code example you want to generate."),(0,r.kt)("p",null,"For example, for our annotated code above, we might use this command to\ngenerate code for the ",(0,r.kt)("inlineCode",{parentName:"p"},"start")," state:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"bluehawk snip -o source/tutorial/generated/code/start/ tutorial/rn/providers/TasksProvider.js --state=start\n")),(0,r.kt)("p",null,"And then use this command to generate code for the ",(0,r.kt)("inlineCode",{parentName:"p"},"final")," state:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-shell"},"bluehawk snip -o source/tutorial/generated/code/final/ tutorial/rn/providers/TasksProvider.js --state=final\n")),(0,r.kt)("p",null,"The input file is the same in both cases. The output directory is different.\nEvery output file follows the same\n",(0,r.kt)("a",{parentName:"p",href:"code-snippets#output-file-names"},"naming convention"),", and there is\nnothing in the file name to indicate the state that was used to generate\nthat file. In the example above, the generated file name would be\n",(0,r.kt)("inlineCode",{parentName:"p"},"TasksProvider.snippet.clean-up.js")," in both cases."),(0,r.kt)("h2",{id:"include-the-snippets-in-your-documentation"},"Include the Snippets In Your Documentation"),(0,r.kt)("p",null,"After annotating your tutorial code and extracting code examples with the\nBluehawk CLI, you've got code files in output directories."),(0,r.kt)("p",null,"Now it's time to include those code files in your documentation.\nHow you do that depends on your documentation tooling. For info\nabout how the Realm docs team includes code examples in our documentation, see:\n",(0,r.kt)("a",{parentName:"p",href:"code-snippets#include-the-snippets-in-your-documentation"},"Include Code Snippets In Your documentation"),"."),(0,r.kt)("h3",{id:"automatically-update-tutorial-code"},"Automatically Update Tutorial Code"),(0,r.kt)("p",null,"For our tutorial code, we do something extra. Our tutorial applications each\nlive in clonable GitHub artifact repositories so developers can clone and\nrun our tutorials. We have a\n",(0,r.kt)("a",{parentName:"p",href:"https://github.com/mongodb/docs-realm/blob/master/.github/workflows/push-to-artifact-repos.yml"},"GitHub Workflow"),"\nthat manages updating these tutorial repositories; we don't push to these\nrepositories directly."),(0,r.kt)("p",null,"Instead, when we push to the ",(0,r.kt)("inlineCode",{parentName:"p"},"tutorial")," directory in our documentation\nrepository, this GitHub workflow does a few things:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"It runs ",(0,r.kt)("inlineCode",{parentName:"li"},"bluehawk check")," to ",(0,r.kt)("a",{parentName:"li",href:"/reference/cli#check"},"verify there are no Bluehawk errors"),"\nin our files."),(0,r.kt)("li",{parentName:"ul"},"It uses a ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/mongodb/docs-realm/tree/master/.github/actions/push-to-artifact-repo"},"GitHub Action"),"\nwith a ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/cbush/bluehawk-plugin-git"},"Bluehawk plugin"),"\nto copy, commit, and push transformed code to artifact repos.")),(0,r.kt)("p",null,"The GitHub Action copies code examples for each Bluehawk state to a git\nbranch whose name is the same as the state name. This means that our\ntutorial repositories are automatically updated when we make updates to\nthe source code in our documentation repository."))}h.isMDXComponent=!0}}]);