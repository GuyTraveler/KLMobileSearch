define(["services/searchBuilderService",
        "domain/site",
        "domain/search",
        "domain/searchType",
        "domain/credential",
        "domain/credentialType",
        "domain/catalogPropertyControlType",
        "domain/Constants",
		"unitTests/unitTestSettings",
        "knockoutMapping"],
    function (searchBuilderService, site, search, searchType, credential, credentialType, catalogPropertyControlType, Constants, TestSettings, mapping) {
		QUnit.module("Testing searchBuilderService");
        
        
        QUnit.test("Test can instantiate searchBuilderService", function () {
            //arrange
            var service;
            
            //act
            service = new searchBuilderService();
            
            //assert
            QUnit.ok(service);
        });
        
        QUnit.asyncTest("Test buildSearchDataSourceAsync", function () {
			//arrange
            var buildSearchDataSourcePromise,
                service = new searchBuilderService(),
                searchData = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml),
                siteData = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
                       
            //act
			buildSearchDataSourcePromise = service.buildSearchDataSourceAsync(siteData, searchData);
            
            //assert
            buildSearchDataSourcePromise.done(function (result) {				
				QUnit.ok(true);
				QUnit.start();		
            });
			
			buildSearchDataSourcePromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false);
				QUnit.start();	
            });
        });
        
		QUnit.asyncTest("Test buildSearchPropertiesAsync", function () {
			//arrange
            var buildSearchPropertiesPromise,
                service = new searchBuilderService(),
                siteData = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));
                       
            //act
			buildSearchPropertiesPromise = service.buildSearchPropertiesAsync(siteData, siteData.url, TestSettings.testKlamlSearchFieldProperties);
            
            //assert
            buildSearchPropertiesPromise.done(function (result) {				
				QUnit.ok(true);
				QUnit.start();		
            });
			
			buildSearchPropertiesPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false);
				QUnit.start();	
            });
        });
        
        QUnit.test("Test mapKlamlSearchFieldPropertiesToSearchProperties", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.mapKlamlSearchFieldPropertiesToSearchProperties(TestSettings.testKlamlSearchFieldProperties, TestSettings.testFacetSearchProperties);
            
            //assert
            QUnit.equal(JSON.stringify(result.propertiesList), TestSettings.testSearchBuilderResultPropertiesList);
            QUnit.deepEqual(result.propertiesName, TestSettings.testSearchBuilderResultPropertiesName);
            QUnit.equal(JSON.stringify(result.searchProperties), TestSettings.testSearchBuilderResultSearchProperties);
        });
        
        QUnit.test("Test mapKlamlSearchFieldPropertiesToSearchProperties null null", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.mapKlamlSearchFieldPropertiesToSearchProperties();
            
            //assert
            QUnit.deepEqual(mapping.toJS(result.propertiesList), []);
            QUnit.deepEqual(result.propertiesName, []);
            QUnit.deepEqual(mapping.toJS(result.searchProperties), []);
        });
        
        QUnit.test("Test convertToControlType Number", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.convertToControlType(TestSettings.numberControlType);
            
            //assert
            QUnit.equal(result, catalogPropertyControlType.Number);
        });
        
        QUnit.test("Test convertToControlType TextBox", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.convertToControlType(TestSettings.textBoxControlType);
            
            //assert
            QUnit.equal(result, catalogPropertyControlType.TextBox);
        });
        
        QUnit.test("Test convertToControlType DropDown", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.convertToControlType(TestSettings.dropDownControlType);
            
            //assert
            QUnit.equal(result, catalogPropertyControlType.DropDown);
        });
        
        QUnit.test("Test convertToControlType Calendar", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.convertToControlType(TestSettings.calendarControlType);
            
            //assert
            QUnit.equal(result, catalogPropertyControlType.Calendar);
        });
        
        QUnit.test("Test convertToControlType RadioButton", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.convertToControlType(TestSettings.radioButtonControlType);
            
            //assert
            QUnit.equal(result, catalogPropertyControlType.RadioButton);
        });
        
        QUnit.test("Test convertToControlType ComboBox", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.convertToControlType(TestSettings.comboBoxControlType);
            
            //assert
            QUnit.equal(result, catalogPropertyControlType.ComboBox);
        });
        
        QUnit.test("Test convertToControlType invalid", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.convertToControlType(TestSettings.invalidControlType);
            
            //assert
            QUnit.equal(result, catalogPropertyControlType.TextBox);
        });
        
        QUnit.test("Test convertToControlType null", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.convertToControlType();
            
            //assert
            QUnit.equal(result, catalogPropertyControlType.TextBox);
        });
        
        QUnit.test("Test getSearchOperatorsForControlType Number", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.getSearchOperatorsForControlType(TestSettings.numberControlType);
            
            //assert
            QUnit.equal(result, Constants.numberOperators);
        });
        
        QUnit.test("Test getSearchOperatorsForControlType TextBox", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.getSearchOperatorsForControlType(TestSettings.textBoxControlType);
            
            //assert
            QUnit.equal(result, Constants.textboxOperators);
        });
        
        QUnit.test("Test getSearchOperatorsForControlType DropDown", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.getSearchOperatorsForControlType(TestSettings.dropDownControlType);
            
            //assert
            QUnit.equal(result, Constants.dropdownOperators);
        });
        
        QUnit.test("Test getSearchOperatorsForControlType Calendar", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.getSearchOperatorsForControlType(TestSettings.calendarControlType);
            
            //assert
            QUnit.equal(result, Constants.calendarOperators);
        });
        
        QUnit.test("Test getSearchOperatorsForControlType RadioButton", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.getSearchOperatorsForControlType(TestSettings.radioButtonControlType);
            
            //assert
            QUnit.equal(result, Constants.radiobuttonOperators);
        });
        
        QUnit.test("Test getSearchOperatorsForControlType ComboBox", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.getSearchOperatorsForControlType(TestSettings.comboBoxControlType);
            
            //assert
            QUnit.equal(result, Constants.comboboxOperators);
        });
        
        QUnit.test("Test getSearchOperatorsForControlType invalid", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.getSearchOperatorsForControlType(TestSettings.invalidControlType);
            
            //assert
            QUnit.deepEqual(result, Constants.textboxOperators);
        });
        
        QUnit.test("Test getSearchOperatorsForControlType null", function () {
            //arrange
            var result,
                service = new searchBuilderService();
            
            //act
            result = service.getSearchOperatorsForControlType();
            
            //assert
            QUnit.equal(result, Constants.textboxOperators);
        });
    });