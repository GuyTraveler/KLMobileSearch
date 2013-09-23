/*global QUnit*/
define(['domain/searchType',
		'unitTests/unitTestSettings'],
    function (searchType, TestSettings) {
        QUnit.module("Testing searchType");
		
		QUnit.test("test searchType + properties OK", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(searchType);
			
			QUnit.equal(searchType.local, 0);
			QUnit.ok(searchType.server, 1);
        });
	});