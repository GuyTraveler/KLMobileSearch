/*global QUnit*/
define(['framework/extensions'],
    function () {
        QUnit.module("Testing framework/extensions");

        QUnit.test("test String.endsWith works with valid values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.endsWith);
            QUnit.equal(str.endsWith("g"), true);
        });  
		
        QUnit.test("test String.endsWith works with invalid values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.endsWith);
            QUnit.ok(str.endsWith("g"));
        });  
		
        QUnit.test("test String.startsWith works with valid values", function () {
            //arrange
			var str = "testing";
            
            //act 
                        
            //assert
            QUnit.ok(str.startsWith);
            QUnit.equal(str.startsWith("t"), true);
        });  
	});