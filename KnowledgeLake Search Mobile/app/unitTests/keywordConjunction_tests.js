/*global QUnit*/
define(['domain/keywordConjunction'],
    function (keywordConjunction) {
        QUnit.module("Testing keywordConjunction");
		
		QUnit.test("test keywordConjunction + properties ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(keywordConjunction);			
			QUnit.equal(keywordConjunction.and, "And");
			QUnit.equal(keywordConjunction.or, "Or");
        });
	});