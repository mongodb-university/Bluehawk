// :code-block-start:SomeTest_Example
class OneOff : Object {
    // ...members...
}
// :hide-start:
// hide this cruft
class SomeTest : XCTestCase {
    func testOneOff() {
        // :hide-end:
        // later ...
        let oneOff = OneOff()
        // use oneOff ...
        // :code-block-end:
    }
}
