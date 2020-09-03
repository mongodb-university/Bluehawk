Realm.Sync.setLogLevel("error");

let realm;
async function openRealm() {
  const config = {
    schema: [schemas.TaskSchema, schemas.UserSchema, schemas.ProjectSchema],
    sync: {
      
      // :hide-start:
      // :code-block-start:hide_is_outside_codeblock
      // I should trigger an error
      notInStartCode: true,
      inFinalCode: true,
      // :code-block-end:
      // :hide-end:
      // :code-block-start:codeblock id has spaces
      // :hide-start:
      // I should trigger a warning
      notInStartCode: true,
      inFinalCode: true,
      // :hide-end:
      // :code-block-end:
  
 
      /* :code-block-start:no-code-block-end
      // I should trigger an error
      :hide-start:
      notInStartCode: true,
      inFinalCode: true,
      :hide-end:*/
    }
   }
}