/*global QUnit*/
define(['services/klamlBuilderService',
		'unitTests/unitTestSettings',
        'framework/system',
        'domain/searchProperty',
        'domain/catalogPropertyControlType',
		'domain/keywordConjunction'],
    function (klamlBuilderService, TestSettings, system, searchProperty, catalogPropertyControlType, keywordConjunction) {
        QUnit.module("Testing klamlBuilderService");
        
        
        QUnit.test("Test buildKlamlQueryFromServerSavedQuery with keyword + AND", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
                        
            //act
            result = service.buildKlamlQueryFromServerSavedQuery(TestSettings.testSearchKeyword, searchProperties, keywordConjunction.and);
            console.log(result);
            //assert
            QUnit.equal(result, TestSettings.testBuildQuery);
        });
		
		QUnit.test("Test buildKlamlQueryFromServerSavedQuery with keyword + OR", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
                        
            //act
            result = service.buildKlamlQueryFromServerSavedQuery(TestSettings.testSearchKeyword, searchProperties, keywordConjunction.or);
            console.log(result);
            //assert
            QUnit.equal(result, TestSettings.testBuildQueryOr);
        });
        
        QUnit.test("Test buildKlamlQueryFromServerSavedQuery null", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
                        
            //act
            result = service.buildKlamlQueryFromServerSavedQuery();
            
            //assert
            QUnit.equal(result, TestSettings.testBuildQueryNull);
        });
        
        QUnit.test("Test buildFieldFromSearchProperty", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchPropertyData = new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyNameIsDocument, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators);
                        
            //act
            result = service.buildFieldFromSearchProperty(searchPropertyData);
            
            //assert
            QUnit.equal(result, TestSettings.testBuiltField);
        });
        
        QUnit.test("Test buildFieldFromSearchProperty null", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
                        
            //act
            result = service.buildFieldFromSearchProperty();
            
            //assert
            QUnit.equal(result, "");
        });
        
		QUnit.test("Test appendIsDocument contains IsDocument", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyNameIsDocument, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
                        
            //act
            result = service.appendIsDocument(searchProperties);
            
            //assert
            QUnit.equal(result, false);
        });
        
        QUnit.test("Test appendIsDocument does not contain IsDocument", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];

            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            //act
            result = service.appendIsDocument(searchProperties);
            
            //assert
            QUnit.equal(result, true);
        });
        
		QUnit.test("Test appendIsDocument null", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.appendIsDocument();
            
            //assert
            QUnit.equal(result, true);
        });
        
        QUnit.test("Test GetKlamlOperator Contains", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(system.strings.Contains);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlContains);
        });
        
        QUnit.test("Test GetKlamlOperator BeginsWith", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(system.strings.StartsWith);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlBeginsWith);
        });
        
        QUnit.test("Test GetKlamlOperator Like", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(system.strings.Like);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlLike);
        });
        
        QUnit.test("Test GetKlamlOperator IsNotNull", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(system.strings.IsNotNull);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlIsNotNull);
        });      
             
        QUnit.test("Test GetKlamlOperator =", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(TestSettings.testSearchEqual);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlEqual);
        });
        
        QUnit.test("Test GetKlamlOperator <", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(TestSettings.testSearchLessThan);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlLessThan);
        });  
        
        QUnit.test("Test GetKlamlOperator <=", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(TestSettings.testSearchLessThanOrEqual);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlLessThanOrEqual);
        });    
        
        QUnit.test("Test GetKlamlOperator >", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(TestSettings.testSearchGreaterThan);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlGreaterThan);
        });    
        
        QUnit.test("Test GetKlamlOperator >=", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(TestSettings.testSearchGreaterThanOrEqual);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlGreaterThanOrEqual);
        });    
        
        QUnit.test("Test GetKlamlOperator null", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator();
            
            //assert
            QUnit.equal(result, "");
        });
	});