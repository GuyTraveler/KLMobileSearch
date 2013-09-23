/*global QUnit*/
define(['domain/authenticationMode'],
    function (authenticationMode) {
        QUnit.module("Testing authenticationMode");
		
		QUnit.test("test authenticationMode + properties ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(authenticationMode);
			QUnit.ok(authenticationMode.Windows);
			QUnit.ok(authenticationMode.ClaimsOrForms);
			QUnit.equal(authenticationMode.Windows, "Windows");
			QUnit.equal(authenticationMode.ClaimsOrForms, "Forms");
        });
	});