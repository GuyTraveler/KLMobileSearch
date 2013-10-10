/*global QUnit*/
define(['framework/guid'],
    function (guid) {
        QUnit.module("Testing framework/guid");

		QUnit.test("Test guid is available", function () {
			//arrange
			
			//act
			
			//assert
			QUnit.ok(guid);
			QUnit.equal(typeof guid, 'object');
        });
		
		QUnit.test("Test guid.s4 returns expected string", function () {
			//arrange
			var str;
			
			//act
			str = guid.s4();
			
			//assert
			QUnit.ok(str);
			QUnit.equal(typeof str, 'string');
			QUnit.equal(str.length, 4);
        });
		
		QUnit.test("Test guid.s4 returns 3 unique strings", function () {
			//arrange
			var str1,
				str2,
				str3;
			
			//act
			str1 = guid.s4();
			str2 = guid.s4();
			str3 = guid.s4();
			
			//assert
			QUnit.notEqual(str1, str2);
			QUnit.notEqual(str1, str3);
			QUnit.notEqual(str2, str3);
        });
		
		QUnit.test("Test guid.newGuid returns expected value", function () {
			//arrange
			var newGuid;
			
			//act
			newGuid = guid.newGuid();
			
			//assert
			QUnit.ok(newGuid);
			QUnit.equal(typeof newGuid, 'string');
			QUnit.equal(newGuid.length, 36);
        });
		
		QUnit.test("Test guid.newGuid returns 3 unique strings", function () {
			//arrange
			var str1,
				str2,
				str3;
			
			//act
			str1 = guid.newGuid();
			str2 = guid.newGuid();
			str3 = guid.newGuid();
			
			//assert
			QUnit.notEqual(str1, str2);
			QUnit.notEqual(str1, str3);
			QUnit.notEqual(str2, str3);
        });
	});