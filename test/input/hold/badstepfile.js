/*:step-start: {
   "title": "Connect to Your MongoDB Realm App"
}
this step has no id!
:step-end:*/

/*:step-start: {
   "id": "notitle"
}
this step has no title!
:step-end:*/

/*:step-start: {
   "id": test2,
   "title":  the ID and title are not in quotes
}
lalalala
:step-end:*/

/*:step-start: {
   "ID": "test3",
   "Title":  "The ID and title have weird caps"
}
lalalala
:step-end:*/

/*:step-start: {
   "id": "test4",
   "title":  "code block has no id"
}
I contain a code block that has no id!
:include-code-block: {
   "state": "start"
}

:step-end:*/

/*:step-start: {
   "id": "test5",
   "title":  "code block has no state"
}
I contain a code block that has no state. Does it default?
:include-code-block: {
   "id": "foo"
}
:step-end:*/

/*:code-block-start: foo
let foo = "this line should be in both starter and final"
:hide-start:
let bar = "this line should be in the final code but not starter"
:replace-with:
let bazzle = "this line should be in the starter, but not final"
:hide-end:
:code-block-end:
*/



