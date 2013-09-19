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
            service = new searchParsingService();
            
            //assert
            QUnit.ok(service);
        });
        
        QUnit.test("Test getSearchFieldPropertiesFromKlaml", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.getSearchFieldPropertiesFromKlaml(TestSettings.testKlaml);
            
            //assert
            QUnit.equal(JSON.stringify(result), TestSettings.testKlamlSearchFieldPropertiesStringified);
        });
        
        QUnit.test("Test getSearchFieldPropertiesFromKlaml null", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.getSearchFieldPropertiesFromKlaml();
            
            //assert
            QUnit.deepEqual(result, []);
        });
        
        QUnit.test("Test GetSearchPropertyOperator contains", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.testKlamlContains);
            
            //assert
            QUnit.equal(result, TestSettings.testSearchContains);
        });
        
        QUnit.test("Test GetSearchPropertyOperator beginswith", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.testKlamlBeginsWith);
            
            //assert
            QUnit.equal(result, TestSettings.testSearchBeginsWith);
        });
        
        QUnit.test("Test GetSearchPropertyOperator isnotnull", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.testKlamlIsNotNull);
            
            //assert
            QUnit.equal(result, TestSettings.testSearchIsNotNull);
        });
        
        QUnit.test("Test GetSearchPropertyOperator eq", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.testKlamlEqual);
            
            //assert
            QUnit.equal(result, TestSettings.testSearchEqual);
        });
        
        QUnit.test("Test GetSearchPropertyOperator lt", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.testKlamlLessThan);
            
            //assert
            QUnit.equal(result, TestSettings.testSearchLessThan);
        });
        
        QUnit.test("Test GetSearchPropertyOperator leq", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.testKlamlLessThanOrEqual);
            
            //assert
            QUnit.equal(result, TestSettings.testSearchLessThanOrEqual);
        });
        
        QUnit.test("Test GetSearchPropertyOperator gt", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.testKlamlGreaterThan);
            
            //assert
            QUnit.equal(result, TestSettings.testSearchGreaterThan);
        });
        
        QUnit.test("Test GetSearchPropertyOperator geq", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.testKlamlGreaterThanOrEqual);
            
            //assert
            QUnit.equal(result, TestSettings.testSearchGreaterThanOrEqual);
        });
        
        QUnit.test("Test GetSearchPropertyOperator invalid", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator(TestSettings.invalid);
            
            //assert
            QUnit.equal(result, TestSettings.invalid);
        });
        
        QUnit.test("Test GetSearchPropertyOperator null", function () {
            //arrange
            var service;
            
            service = new searchParsingService();
            
            //act
            var result = service.GetSearchPropertyOperator();
            
            //assert
            QUnit.equal(result, null);
        });
    });
