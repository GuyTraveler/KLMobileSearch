/*global QUnit*/
define(["domain/keyValuePair"],
    function (keyValuePair) {
        QUnit.module("Testing keyValuePair");
        
        
        QUnit.test("Test can instantiate keyValuePair and properties are set", function () {
            //arrange
            var parameter,
                testKey = "key1",
                testValue = "value1";
            
            //act
            parameter = new keyValuePair(testKey, testValue);
            
            //assert
            QUnit.ok(parameter);
            QUnit.equal(testKey, parameter.key);
            QUnit.equal(testValue, parameter.value);
        });
    });
