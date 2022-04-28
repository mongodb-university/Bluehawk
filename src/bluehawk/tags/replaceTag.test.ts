import { Bluehawk } from "../bluehawk";
import { Document } from "../Document";
import { ReplaceTag } from "./ReplaceTag";
import { RemoveTag } from "./RemoveTag";
import { SnippetTag } from "./SnippetTag";

describe("replace tag", () => {
  const bluehawk = new Bluehawk();
  bluehawk.registerTag(ReplaceTag);
  bluehawk.registerTag(RemoveTag);
  bluehawk.registerTag(SnippetTag);
  bluehawk.registerTag(SnippetTag, "code-block");
  bluehawk.addLanguage("js", {
    languageId: "javascript",
    blockComments: [[/\/\*/, /\*\//]],
    lineComments: [/\/\/ ?/],
  });

  it("errors when no attribute list is given", () => {
    const input = new Document({
      text: `// :replace-start:
// :replace-end:
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors[0].message).toBe(
      "attribute list for 'replace' tag should be object"
    );
  });

  it("errors when invalid attribute list is given", () => {
    const input = new Document({
      text: `// :replace-start: {"terms":{"numbersNotAllowed": 1}}
// :replace-end:
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors[0].message).toBe(
      "attribute list for 'replace' tag/terms/numbersNotAllowed should be string"
    );
  });

  it("replaces keys with values", async (done) => {
    const input = new Document({
      text: `// :replace-start: {
// "terms": {
//   "Replace Me": "It works!",
//   "test2": "--replaced--"
// }}
leave this alone
go ahead and Replace Me
and see test2
// :replace-end:
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors).toStrictEqual([]);
    const files = await bluehawk.process(parseResult);
    expect(files["replace.test.js"].document.text.toString())
      .toBe(`leave this alone
go ahead and It works!
and see --replaced--
`);
    done();
  });

  it("is case sensitive", async (done) => {
    const input = new Document({
      text: `// :replace-start: {"terms": {
//   "Notice the Case": "It works!",
//   "UNCHANGED": "changed"
// }}
leave this alone
go ahead and notice the case
and see unchanged
// :replace-end:
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors.length).toBe(0);
    const files = await bluehawk.process(parseResult);
    expect(files["replace.test.js"].document.text.toString())
      .toBe(`leave this alone
go ahead and notice the case
and see unchanged
`);
    done();
  });

  it("replaces all instances within the block", async (done) => {
    const input = new Document({
      text: `replaceme
replaceme
---
// :replace-start: {
//   "terms": {"replaceme": "replaced"}
// }
replaceme
left alone
replaceme
replaceme
left alone
and replaceme
// :replace-end:
---
replaceme
replaceme
replaceme
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors.length).toBe(0);
    const files = await bluehawk.process(parseResult);
    expect(files["replace.test.js"].document.text.toString()).toBe(`replaceme
replaceme
---
replaced
left alone
replaced
replaced
left alone
and replaced
---
replaceme
replaceme
replaceme
`);
    done();
  });

  it("can't match outside of its block", async (done) => {
    const input = new Document({
      text: `// :replace-start: {"terms": {
//   ":replace-": "hacked"
// }}
:replace- :replace- :rep
:replace-end:
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors).toStrictEqual([]);
    const files = await bluehawk.process(parseResult);
    expect(files["replace.test.js"].document.text.toString()).toBe(
      `hacked hacked :rep\n`
    );
    done();
  });

  it("interoperates with remove", async (done) => {
    const input = new Document({
      text: `// :replace-start: {"terms": {
//   "removethis": ""
// }}
leave this alone
removethis1
// :remove-start:
removethis2
removethis3
// :remove-end:
removethis4
andremovethisaswell
// :replace-end:
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors).toStrictEqual([]);
    const files = await bluehawk.process(parseResult);
    expect(files["replace.test.js"].document.text.toString())
      .toBe(`leave this alone
1
4
andaswell
`);
    done();
  });

  it("doesn't unexpectedly use id as a replacement", () => {
    const input = new Document({
      text: `// :replace-start: foo
it's my id
:replace-end:
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors[0].message).toBe(
      "attribute list for 'replace' tag should have required property 'terms'"
    );
  });

  it("handles a real-world example", async (done) => {
    const input = new Document({
      text: `// :replace-start: {
//   "terms": {
//     "ReadWriteDataExamples_": ""
//   }
// }
import XCTest
import RealmSwift

// :code-block-start: models
class ReadWriteDataExamples_Dog: Object {
    @objc dynamic var name = ""
    @objc dynamic var age = 0
}

class ReadWriteDataExamples_DogOwner: Object {
    @objc dynamic var id = 0

    // To-many relationship - a dog owner can have many dogs
    let dogs = List<ReadWriteDataExamples_Dog>()
    
    // Inverse relationship - an owner can be a member of many clubs
    let clubs = LinkingObjects(fromType: ReadWriteDataExamples_DogClub.self, property: "members")

    override static func primaryKey() -> String? {
        return "id"
    }
}

class ReadWriteDataExamples_DogClub: Object {
    @objc dynamic var name = ""
    let members = List<ReadWriteDataExamples_DogOwner>()
}
// :code-block-end:

class ReadWriteData: XCTestCase {
    func testCreateNewObject() {
        // :code-block-start: create-a-new-object
        // (1) Create a ReadWriteDataExamples_Dog object and then set its properties
        let myReadWriteDataExamples_Dog = ReadWriteDataExamples_Dog()
        myReadWriteDataExamples_Dog.name = "Rex"
        myReadWriteDataExamples_Dog.age = 10
        
        // (2) Create a ReadWriteDataExamples_Dog object from a dictionary
        let myOtherReadWriteDataExamples_Dog = ReadWriteDataExamples_Dog(value: ["name" : "Pluto", "age": 3])

        // (3) Create a ReadWriteDataExamples_Dog object from an array
        let myThirdReadWriteDataExamples_Dog = ReadWriteDataExamples_Dog(value: ["Fido", 5])
        
        // Get the default realm. You only need to do this once per thread.
        let realm = try! Realm()

        // Add to the realm inside a transaction
        try! realm.write {
            realm.add(myReadWriteDataExamples_Dog)
        }
        // :code-block-end:
    }
}

// :replace-end:
`,
      path: "replace.test.js",
    });

    const parseResult = bluehawk.parse(input);
    expect(parseResult.errors.length).toBe(0);
    const files = await bluehawk.process(parseResult);
    expect(files["replace.test.js"].document.text.toString())
      .toBe(`import XCTest
import RealmSwift

class Dog: Object {
    @objc dynamic var name = ""
    @objc dynamic var age = 0
}

class DogOwner: Object {
    @objc dynamic var id = 0

    // To-many relationship - a dog owner can have many dogs
    let dogs = List<Dog>()
    
    // Inverse relationship - an owner can be a member of many clubs
    let clubs = LinkingObjects(fromType: DogClub.self, property: "members")

    override static func primaryKey() -> String? {
        return "id"
    }
}

class DogClub: Object {
    @objc dynamic var name = ""
    let members = List<DogOwner>()
}

class ReadWriteData: XCTestCase {
    func testCreateNewObject() {
        // (1) Create a Dog object and then set its properties
        let myDog = Dog()
        myDog.name = "Rex"
        myDog.age = 10
        
        // (2) Create a Dog object from a dictionary
        let myOtherDog = Dog(value: ["name" : "Pluto", "age": 3])

        // (3) Create a Dog object from an array
        let myThirdDog = Dog(value: ["Fido", 5])
        
        // Get the default realm. You only need to do this once per thread.
        let realm = try! Realm()

        // Add to the realm inside a transaction
        try! realm.write {
            realm.add(myDog)
        }
    }
}

`);
    expect(files["replace.test.codeblock.models.js"].document.text.toString())
      .toBe(`class Dog: Object {
    @objc dynamic var name = ""
    @objc dynamic var age = 0
}

class DogOwner: Object {
    @objc dynamic var id = 0

    // To-many relationship - a dog owner can have many dogs
    let dogs = List<Dog>()
    
    // Inverse relationship - an owner can be a member of many clubs
    let clubs = LinkingObjects(fromType: DogClub.self, property: "members")

    override static func primaryKey() -> String? {
        return "id"
    }
}

class DogClub: Object {
    @objc dynamic var name = ""
    let members = List<DogOwner>()
}
`);
    expect(
      files[
        "replace.test.codeblock.create-a-new-object.js"
      ].document.text.toString()
    ).toBe(`// (1) Create a Dog object and then set its properties
let myDog = Dog()
myDog.name = "Rex"
myDog.age = 10

// (2) Create a Dog object from a dictionary
let myOtherDog = Dog(value: ["name" : "Pluto", "age": 3])

// (3) Create a Dog object from an array
let myThirdDog = Dog(value: ["Fido", 5])

// Get the default realm. You only need to do this once per thread.
let realm = try! Realm()

// Add to the realm inside a transaction
try! realm.write {
    realm.add(myDog)
}
`);
    done();
  });
});
