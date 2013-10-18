/*global QUnit*/
define(["application",
        'require',
        'jquery',
        'knockout',
        'viewmodels/searchBuilderViewModel',
        'viewmodels/savedSearchViewModel',
        "domain/search",
        "domain/searchType",
        "domain/searchProperty",
        "domain/catalogPropertyControlType",
        "domain/site",
        "domain/credential",
        "domain/credentialType",
		"domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
		"unitTests/unitTestSettings",
		"domain/keywordConjunction"],
    function (application, require, $, ko, searchBuilderViewModel, savedSearchViewModel, search, searchType, searchProperty, catalogPropertyControlType, 
			  site, credential, credentialType, navigationDirection, navigationPage, navigationContext, TestSettings, keywordConjunction) {
        QUnit.module("Testing searchBuilderViewModel");
        
        
        QUnit.test("test searchBuilderViewModel ctor", function () {
            //arrange
            var vm;
            
            //act 
            vm = new searchBuilderViewModel();
                        
            //assert
            QUnit.ok(vm);
            QUnit.ok(window.App);
			QUnit.ok(window.App.isMock);
			QUnit.equal(vm.wordConjunction(), keywordConjunction.and);
        });
        
        QUnit.test("test searchBuilderViewModel SetDataSource", function () {
            //arrange
            var vm,
                searchProperties = [];

            searchProperties.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            
            //act 
            vm = new searchBuilderViewModel();
            vm.SetDataSource(searchProperties);
                        
            //assert
            QUnit.deepEqual(vm.searchBuilderDataSource(), searchProperties);
        });
        
        QUnit.test("test searchBuilderViewModel SetDataSource empty array", function () {
            //arrange
            var vm;
            
            //act 
            vm = new searchBuilderViewModel();
            vm.SetDataSource([]);
                        
            //assert
            QUnit.deepEqual(vm.searchBuilderDataSource(), []);
        });
        
        QUnit.test("test searchBuilderViewModel SetDataSource null", function () {
            //arrange
            var vm;
            
            //act 
            vm = new searchBuilderViewModel();
            vm.SetDataSource();
                        
            //assert
            QUnit.deepEqual(vm.searchBuilderDataSource(), []);
        });
        
        QUnit.test("test searchBuilderViewModel SetProperties", function () {
            //arrange
            var vm,
                propertiesList = [],
                propertiesName = [];

            propertiesList.push(new searchProperty(TestSettings.testChoices, catalogPropertyControlType.DropDown, TestSettings.testSearchPropertyHiddenFalse, 
                                    TestSettings.testSearchPropertyDescription, TestSettings.testSearchPropertyDataType, TestSettings.testSearchPropertyName, 
                                    TestSettings.testSearchPropertyId, TestSettings.testOperators));
            propertiesName.push("Choice column");
            
            //act 
            vm = new searchBuilderViewModel();
            vm.SetProperties(propertiesList, propertiesName);
                        
            //assert
            QUnit.deepEqual(vm.propertiesList, propertiesList);
            QUnit.deepEqual(vm.propertiesName(), propertiesName);
        });
        
        QUnit.test("test searchBuilderViewModel SetProperties null null", function () {
            //arrange
            var vm;
            
            //act 
            vm = new searchBuilderViewModel();
            vm.SetProperties();
                        
            //assert
            QUnit.equal(vm.propertiesList, null);
            QUnit.deepEqual(vm.propertiesName(), []);
        });
        
        QUnit.test("test searchBuilderViewModel BuildSearchProperties", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));            
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.searchBuilderPage, navigationPage.savedSearchPage, {"site": selectedSite}));
            
            vm = new searchBuilderViewModel();
            vm.search(new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml));            
            
            //act
            vm.BuildSearchProperties();
                        
            //assert
            QUnit.ok(vm);
        });  
       
        QUnit.test("test searchBuilderViewModel onBeforeShow", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),            
                selectedSearch = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml);
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.searchBuilderPage, navigationPage.savedSearchPage, 
                {"site": selectedSite, "search": selectedSearch}));
            
            vm = new searchBuilderViewModel();
            
            //act
            vm.onBeforeShow();
                        
            //assert
            QUnit.equal(vm.keyword(), "");
            QUnit.deepEqual(vm.searchBuilderDataSource(), []);
        });   
       
        QUnit.test("test searchBuilderViewModel onAfterShow", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),            
                selectedSearch = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml);
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.searchBuilderPage, navigationPage.savedSearchPage, 
                {"site": selectedSite, "search": selectedSearch}));
            
            vm = new searchBuilderViewModel();
            
            //act
            vm.onAfterShow();
                        
            //assert
            QUnit.equal(vm.search(), selectedSearch);
        });  
       
        QUnit.test("test searchBuilderViewModel onSearchKeyUp", function () {
            //arrange
            var vm,
                selection = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml)
                event = {keyCode: 13};
            
            //act 
            vm = new searchBuilderViewModel();
            vm.onSearchKeyUp(selection, event);
                        
            //assert
            QUnit.ok(vm);
        });  
       
        QUnit.test("test searchBuilderViewModel clearKeyword", function () {
            //arrange
            var vm;
            
            //act 
            vm = new searchBuilderViewModel();
            vm.clearKeyword();
                        
            //assert
            QUnit.equal(vm.keyword(), "");
        });
    });