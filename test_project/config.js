/*:step-start: {
   id: app-id,
   title: Connect to Your MongoDB Realm App,
   next-step: 
}
To get the app working with your backend, you first need to add your Realm App 
ID to the config.js file. The config.js module exports a single property, 
realmAppId, which is currently set to “TODO”:
:include-code-block: {
   id: realmAppId
}

Change this value to your Realm App ID. 

.. note::

   To learn how to find your MongoDB Realm ``appId``, read the :doc:`Find
   Your App Id </get-started/find-your-app-id>` doc.

Once you have made that change, you now need to complete the code needed to 
open a {+realm+}. In ``index.js``, find the ``openRealm`` function. It will look 
like this:

:include-code-block: {
   id: index.js.openRealm,
   state: start,
   note: this code block is in another file!
}

Replace the ``TODO`` line with a line of code that opens a {+realm+} and assigns 
it to the ``realm`` property:

:include-code-block: {
   id: index.js.openRealm,
   state: end,
   note: this code block is in another file!
}

At this point, your app is pointing to your backend and opens a connection 
to it when you start the app. However, users cannot yet log in, so let's update 
that code next.

:step-end:
*/

//:code-block-start:realmAppId
//:hide-start:
exports.realmAppId = "TODO";
//:replace-with:
exports.realmAppId = "mytutorialapp-qwe";
//:hide-end:
//:code-block-end:
