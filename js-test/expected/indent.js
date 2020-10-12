module.exports.output = {
   start: [
    'class OneOff : Object {',
    '    // ...members...',
    '}',
    '        // later ...',
    '        let oneOff = OneOff()',
    '        // use oneOff ...',
    '    }',
    '}',
    ''
 ], final: [
   'class OneOff : Object {',
   '   // ...members...',
   '}',
   '// hide this cruft',
   'class SomeTest : XCTestCase {',
   '    func testOneOff() {',
   '        // later ...',
   '        let oneOff = OneOff()',
   '        // use oneOff ...',
   '    }',
   '}',
   ''
 ]
};