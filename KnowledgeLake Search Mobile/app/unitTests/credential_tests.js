/*global QUnit*/
define(['domain/credential',
		'unitTests/unitTestSettings'],
    function (credential, TestSettings) {
        QUnit.module("Testing credential");
		
		QUnit.test("test credential is available", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(credential);			
        });
		
		QUnit.test("test credential is properly instantiated with 0 parameters", function () {
			//arrange
			var cred;
			
			//act
			cred = new credential();

			//assert
			QUnit.ok(cred);			
			QUnit.equal(cred.credentialType, null);
			QUnit.equal(cred.userName, null);
			QUnit.equal(cred.password, null);
			QUnit.equal(cred.domain, null);
        });
		
		QUnit.test("test credential is properly instantiated with 1 parameter", function () {
			//arrange
			var cred,
				type = 1;
			
			//act
			cred = new credential(type);

			//assert
			QUnit.ok(cred);			
			QUnit.equal(cred.credentialType, type);
			QUnit.equal(cred.userName, null);
			QUnit.equal(cred.password, null);
			QUnit.equal(cred.domain, null);
        });
		
		QUnit.test("test credential is properly instantiated with 2 parameters", function () {
			//arrange
			var cred,
				type = 1;
			
			//act
			cred = new credential(type, TestSettings.ntlmTestUser);

			//assert
			QUnit.ok(cred);			
			QUnit.equal(cred.credentialType, type);
			QUnit.equal(cred.userName, TestSettings.ntlmTestUser);
			QUnit.equal(cred.password, null);
			QUnit.equal(cred.domain, null);
        });
		
		QUnit.test("test credential is properly instantiated with 3 parameters", function () {
			//arrange
			var cred,
				type = 1;
			
			//act
			cred = new credential(type, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);

			//assert
			QUnit.ok(cred);			
			QUnit.equal(cred.credentialType, type);
			QUnit.equal(cred.userName, TestSettings.ntlmTestUser);
			QUnit.equal(cred.password, TestSettings.ntlmTestPassword);
			QUnit.equal(cred.domain, null);
        });
		
		QUnit.test("test credential is properly instantiated with 4 parameters", function () {
			//arrange
			var cred,
				type = 1;
			
			//act
			cred = new credential(type, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain);

			//assert
			QUnit.ok(cred);			
			QUnit.equal(cred.credentialType, type);
			QUnit.equal(cred.userName, TestSettings.ntlmTestUser);
			QUnit.equal(cred.password, TestSettings.ntlmTestPassword);
			QUnit.equal(cred.domain, TestSettings.ntlmTestDomain);
        });
	});