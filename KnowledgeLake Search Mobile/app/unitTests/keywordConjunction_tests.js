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
			QUnit.equal(keywordConjunction.defaultConjunction, "And");
			QUnit.equal(keywordConjunction.or, "Or");
        });
		
		QUnit.test("test keywordConjunction.boolToConjunction null returns or", function () {
			//arrange
			var result;
			
			//act
			result = keywordConjunction.boolToConjunction(null);

			//assert
			QUnit.equal(result, keywordConjunction.or);
        });
		
		QUnit.test("test keywordConjunction.boolToConjunction '' returns or", function () {
			//arrange
			var result;
			
			//act
			result = keywordConjunction.boolToConjunction("");

			//assert
			QUnit.equal(result, keywordConjunction.or);
        });
		
		QUnit.test("test keywordConjunction.boolToConjunction FALSE returns or", function () {
			//arrange
			var result;
			
			//act
			result = keywordConjunction.boolToConjunction(false);

			//assert
			QUnit.equal(result, keywordConjunction.or);
        });
		
		QUnit.test("test keywordConjunction.boolToConjunction TRUE returns and", function () {
			//arrange
			var result;
			
			//act
			result = keywordConjunction.boolToConjunction(true);

			//assert
			QUnit.equal(result, keywordConjunction.and);
        });
	});