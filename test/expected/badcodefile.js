module.exports.output = 
{
   start: `Realm.Sync.setLogLevel("error");

let realm;
async function openRealm() {
  const config = {
    schema: [schemas.TaskSchema, schemas.UserSchema, schemas.ProjectSchema],
    sync: {
      
  
 
      // I should trigger an error
    }
   }
}`,
   final: `Realm.Sync.setLogLevel("error");

let realm;
async function openRealm() {
  const config = {
    schema: [schemas.TaskSchema, schemas.UserSchema, schemas.ProjectSchema],
    sync: {
      
      // I should trigger an error
      notInStartCode: true,
      inFinalCode: true,
      // I should trigger a warning
      notInStartCode: true,
      inFinalCode: true,
  
 
      // I should trigger an error
      notInStartCode: true,
      inFinalCode: true,
    }
   }
}`
 }
