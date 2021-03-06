/*global QUnit*/
define(['services/klamlBuilderService',
		'unitTests/unitTestSettings',
        'application',
        'domain/searchProperty',
        'domain/catalogPropertyControlType',
		'domain/keywordConjunction'],
    function (klamlBuilderService, TestSettings, application, searchProperty, catalogPropertyControlType, keywordConjunction) {
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
        
        QUnit.test("Test refineKlamlProperties", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
                        
            //act
            result = service.refineKlamlProperties(searchProperties);
            
            //assert
            QUnit.equal(result, searchProperties);
        });
        
        QUnit.test("Test refineKlamlProperties DateTime Range", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.Calendar, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            
            searchProperties[0].selectedOperator(TestSettings.testSearchRange);
            searchProperties[0].value(TestSettings.testDateValue1);
            searchProperties[0].secondaryValue(TestSettings.testDateValue2);
                        
            //act
            result = service.refineKlamlProperties(searchProperties);
            
            //assert
            QUnit.equal(JSON.stringify(result), TestSettings.testBuildDateTimeRangeProperty);
        });
        
        QUnit.test("Test refineKlamlProperties DateTime Equal", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.Calendar, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            
            searchProperties[0].selectedOperator(TestSettings.testSearchEqual);
            searchProperties[0].value(TestSettings.testDateValue1);
                        
            //act
            result = service.refineKlamlProperties(searchProperties);
            
            //assert
            QUnit.equal(JSON.stringify(result), TestSettings.testBuildDateTimeEqualProperty);
        });
        
        QUnit.test("Test refineKlamlProperties DateTime >", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.Calendar, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            
            searchProperties[0].selectedOperator(TestSettings.testSearchGreaterThan);
            searchProperties[0].value(TestSettings.testDateValue1);
                        
            //act
            result = service.refineKlamlProperties(searchProperties);
            
            //assert
            QUnit.equal(JSON.stringify(result), TestSettings.testBuildDateTimeGreaterThanProperty);
        });
        
        QUnit.test("Test refineKlamlProperties DateTime >=", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.Calendar, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            
            searchProperties[0].selectedOperator(TestSettings.testSearchGreaterThanOrEqual);
            searchProperties[0].value(TestSettings.testDateValue1);
                        
            //act
            result = service.refineKlamlProperties(searchProperties);
            
            //assert
            QUnit.equal(JSON.stringify(result), TestSettings.testBuildDateTimeGreaterThanOrEqualProperty);
        });
        
        QUnit.test("Test refineKlamlProperties DateTime <", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.Calendar, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            
            searchProperties[0].selectedOperator(TestSettings.testSearchLessThanEqual);
            searchProperties[0].value(TestSettings.testDateValue1);
                        
            //act
            result = service.refineKlamlProperties(searchProperties);
            
            //assert
            QUnit.equal(JSON.stringify(result), TestSettings.testBuildDateTimeLessThanProperty);
        });
        
        QUnit.test("Test refineKlamlProperties Number Range", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.Number, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            
            searchProperties[0].selectedOperator(TestSettings.testSearchRange);
            searchProperties[0].value(TestSettings.testNumberValue);
                        
            //act
            result = service.refineKlamlProperties(searchProperties);
            
            //assert
            QUnit.equal(JSON.stringify(result), TestSettings.testBuildNumberRangeProperty);
        });
        
        QUnit.test("Test duplicateKlamlProperty", function () {
            //arrange
            var result,
                service = new klamlBuilderService(),
                searchProperties = [];
            
            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
                        
            //act
            result = service.duplicateKlamlProperty(searchProperties, 0);
            
            //assert
            QUnit.equal(JSON.stringify(result), TestSettings.testBuildDuplicatedProperties);
        });        
        
        QUnit.test("Test duplicateKlamlProperty null", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
                        
            //act
            result = service.duplicateKlamlProperty();
            
            //assert
            QUnit.equal(result, null);
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
            result = service.GetKlamlOperator(application.strings.Contains);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlContains);
        });
        
        QUnit.test("Test GetKlamlOperator BeginsWith", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(application.strings.StartsWith);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlBeginsWith);
        });
        
        QUnit.test("Test GetKlamlOperator Like", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(application.strings.Like);
            
            //assert
            QUnit.equal(result, TestSettings.testKlamlLike);
        });
        
        QUnit.test("Test GetKlamlOperator IsNotNull", function () {
            //arrange
            var result,
                service = new klamlBuilderService();
            
            //act
            result = service.GetKlamlOperator(application.strings.IsNotNull);
            
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