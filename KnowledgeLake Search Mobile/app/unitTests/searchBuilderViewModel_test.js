/*global QUnit*/
define(['require',
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
		"unitTests/unitTestSettings",
		"domain/keywordConjunction"],
    function (require, $, ko, searchBuilderViewModel, savedSearchViewModel, search, searchType, searchProperty, catalogPropertyControlType, 
			  site, credential, credentialType, TestSettings, keywordConjunction) {
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
        
        QUnit.test("test searchBuilderViewModel init", function () {
            //arrange
            var vm;
            
            //act 
            vm = new searchBuilderViewModel();
            vm.init();
                        
            //assert
            QUnit.ok(vm);
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
                savedSearchVM;            
            
            vm = new searchBuilderViewModel();
            savedSearchVM = new savedSearchViewModel();
            vm.search(new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml));
            savedSearchVM.site = ko.observable(new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)));
            
            window.savedSearchViewModel = savedSearchVM;
            
            //act
            vm.BuildSearchProperties();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test searchBuilderViewModel beforeShow", function () {
            //arrange
            var vm;
            
            //act 
            vm = new searchBuilderViewModel();
            vm.beforeShow();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test searchBuilderViewModel show", function () {
            //arrange
            var vm,
                savedSearchVM;            
            
            vm = new searchBuilderViewModel();
            savedSearchVM = new savedSearchViewModel();
            savedSearchVM.selectedSearch = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml);
            savedSearchVM.site = ko.observable(new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)));
            
            window.savedSearchViewModel = savedSearchVM;
            
            //act
            vm.show();
                        
            //assert
            QUnit.equal(vm.search(), savedSearchVM.selectedSearch);
        });  
        
        QUnit.test("test searchBuilderViewModel afterShow", function () {
            //arrange
            var vm, 
                object = {"view": {"footer": {"find": function (control) { return {"data": function(control) { return {"clear": function () {}}}}}}}};
            
            vm = new searchBuilderViewModel();
            
            //act
            vm.afterShow(object);
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test searchBuilderViewModel hide", function () {
            //arrange
            var vm;
            
            //act 
            vm = new searchBuilderViewModel();
            vm.hide();
                        
            //assert
            QUnit.ok(vm);
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
    });