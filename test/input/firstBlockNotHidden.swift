//
//  ManageEmailPasswordUsers.swift
//  RealmExamples
//
//  Created by Chris Bush on 2020-09-15.
//  Copyright © 2020 MongoDB, Inc. All rights reserved.
//

import XCTest
import RealmSwift

class ManageEmailPasswordUsers: XCTestCase {

    func testRegisterNewAccount() {
        let expectation = XCTestExpectation(description: "Registration continues")

        // :code-block-start: i-should-not-be-hidden
        let app = App(id: YOUR_REALM_APP_ID)
        let client = app.emailPasswordAuth()
        let email = "skroob@example.com"
        let password = "password12345"
        client.registerEmail(email, password: password) { (error) in
            guard error == nil else {
                print("Failed to register: \(error!.localizedDescription)")
                // :hide-start:
                XCTAssertEqual(error!.localizedDescription, "name already in use")
                expectation.fulfill()
                // :hide-end:
                return
            }
            // Registering just registers. You can now log in.
            print("Successfully registered user.")
            // :hide-start:
            expectation.fulfill()
            // :hide-end:          
        }
        // :code-block-end:
        wait(for: [expectation], timeout: 10)
    }
}