/*global QUnit*/
define(["services/searchParsingService", 
		"ntlm",
		"unitTests/unitTestSettings"],
    function (searchParsingService, ntlm, TestSettings) {
        QUnit.module("Testing searchParsingService");
        
        
        QUnit.test("Test can instantiate searchParsingService", function () {
            //arrange
            var service;
            
            //act
            service = new searchParsingService("");
            
            //assert
            QUnit.ok(service);
        });
        
        QUnit.test("Test getDisplayNamesFromKlaml", function () {
            //arrange
            var service;
            
            service = new searchParsingService("");
            
            //act
            var result = service.getDisplayNamesFromKlaml(TestSettings.testKlaml);
            
            //assert
            QUnit.deepEqual(result, ["ChoiceColumn"]);
        });
    });
