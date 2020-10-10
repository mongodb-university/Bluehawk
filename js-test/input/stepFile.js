/*:step-start: {
   "id": "my-step-id", 
   "title": "Connect to Your MongoDB Realm App"
}
To get the app working with your backend, you first need to add your Realm App 
ID to the config.js file. The config.js module exports a single property, 
realmAppId, which is currently set to “TODO”:

:include-code-block: {
   "id": "realmAppId",
   "state": "start"
}

Change this value to your Realm App ID. 

.. note::

   To learn how to find your MongoDB Realm ``appId``, read the :doc:`Find
   Your App Id </get-started/find-your-app-id>` doc.

Once you have made that change, you now need to complete the code needed to 
open a {+realm+}. In ``index.js``, find the ``openRealm`` function. It will look 
like this:

:include-code-block: {"emphasize_lines": "1,5", "line_numbers": "false","id": "foo","state": "start"}
Replace the ``TODO`` line with a line of code that opens a {+realm+} and assigns 
it to the ``realm`` property:

:include-code-block: {
   "id": "foo",
   "state": "final",
   "note": "this code block is in another file!",
   "emphasize_lines": "1-3",
   "line_numbers": "true"
}

At this point, your app is pointing to your backend and opens a connection 
to it when you start the app. However, users cannot yet log in, so let's update 
that code next.
:step-end:

:step-start: Now it's Time to Dance
I'm step 2. That's cool, right?
I'm using the default property of the step-start
rather than passing in an object. That makes me
cooler than the previous step.

:step-end:*/

//:code-block-start:realmAppId
//:hide-start:
exports.realmAppId = "mytutorialapp-qwe";
//:replace-with:
exports.realmAppId = "TODO";
/* I'm putting in a code-block comment here.
This should be included in the START ONLY */
/* 
Here's another comment for start only!
*/
//:hide-end:
let shouldBeInStartAndFinalCode;
// This comment should be in all outputs
//:code-block-end:

/*:code-block-start: foo
let foo = "this line should be in both starter and final"
:hide-start:
let bar = "this line should be in the final code but not starter"
:replace-with:
let bazzle = "this line should be in the starter, but not final"
:hide-end:
:code-block-end:
*/
