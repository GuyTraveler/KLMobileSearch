/*global QUnit*/
define(['domain/credentialType'],
    function (credentialType) {
        QUnit.module("Testing credentialType");
		
		QUnit.test("test credentialType + properties ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(credentialType);			
			QUnit.equal(credentialType.ntlm, 0);
			QUnit.equal(credentialType.claimsOrForms, 1);
        });
	});