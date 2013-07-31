/*global QUnit*/
define(["domain/soapParameter"],
    function (soapParameter) {
        QUnit.module("Testing soapParameter");
        
        
        QUnit.test("Test can instantiate soapParameter and properties are set", function () {
            //arrange
            var parameter,
                testKey = "key1",
                testValue = "value1";
            
            //act
            parameter = new soapParameter(testKey, testValue);
            
            //assert
            QUnit.ok(parameter);
            QUnit.equal(testKey, parameter.key);
            QUnit.equal(testValue, parameter.value);
        });
    });
