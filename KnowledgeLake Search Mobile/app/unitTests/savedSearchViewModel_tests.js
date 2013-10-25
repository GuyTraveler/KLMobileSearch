/*global QUnit*/
define(["application",
        'require',
        'jquery',
        'knockout',
        'viewmodels/savedSearchViewModel',
        'viewmodels/homeViewModel',
        "domain/search",
        "domain/searchType",
        "domain/site",
        "domain/credential",
        "domain/credentialType",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
		"unitTests/unitTestSettings",
		"domain/keywordConjunction"],
    function (application, require, $, ko, savedSearchViewModel, homeViewModel, search, searchType, site, credential, 
              credentialType, navigationDirection, navigationPage, navigationContext, TestSettings, keywordConjunction) {
        QUnit.module("Testing savedSearchViewModel");
        
        
        QUnit.test("test searchBuilderViewModel ctor", function () {
            //arrange
            var vm;
            
            //act 
            vm = new savedSearchViewModel();
                        
            //assert
            QUnit.ok(vm);
            QUnit.ok(window.App);
			QUnit.ok(window.App.isMock);
			QUnit.equal(vm.wordConjunction(), keywordConjunction.and);
        });
       
        QUnit.test("test savedSearchViewModel SetDataSource", function () {
            //arrange
            var vm,
                searches = [];

            searches.push(new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml));
            
            //act 
            vm = new savedSearchViewModel();
            vm.SetDataSource(searches);
                        
            //assert
            QUnit.deepEqual(vm.searchDataSource(), searches);
        });
        
        QUnit.test("test savedSearchViewModel SetDataSource empty array", function () {
            //arrange
            var vm;
            
            //act 
            vm = new savedSearchViewModel();
            vm.SetDataSource([]);
                        
            //assert
            QUnit.deepEqual(vm.searchDataSource(), []);
        });
        
        QUnit.test("test savedSearchViewModel SetDataSource null", function () {
            //arrange
            var vm;
            
            //act 
            vm = new savedSearchViewModel();
            vm.SetDataSource();
                        
            //assert
            QUnit.deepEqual(vm.searchDataSource(), []);
        });
        
        QUnit.test("test savedSearchViewModel LoadSearchData", function () {
            //arrange
            var vm;            
            
            vm = new savedSearchViewModel();
            vm.site(new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)));
            
            
            //act
            vm.LoadSearchData();
                        
            //assert
            QUnit.ok(vm);
        });  
                  
        QUnit.test("test savedSearchViewModel clearKeyword", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));           
            
            selectedSite.keywordSearches = ["test"];
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"site": selectedSite}));;
            
            //act 
            vm = new savedSearchViewModel();
            vm.autoCompleteBox.element = TestSettings.autoCompleteBoxElement;
            vm.clearKeyword();
                        
            //assert
            QUnit.ok(vm);
        });
        
        QUnit.test("test savedSearchViewModel onBeforeShow", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));           
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"site": selectedSite}));
            
            vm = new savedSearchViewModel();            
            vm.autoCompleteBox.element = TestSettings.autoCompleteBoxElement;
            
            //act
            vm.onBeforeShow();
                        
            //assert
            QUnit.equal(vm.selectedSearch(), null);
            QUnit.deepEqual(vm.searchDataSource(), []);
        });       
        
        QUnit.test("test savedSearchViewModel onAfterShow", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));           
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"site": selectedSite}));
            
            vm = new savedSearchViewModel();            
            vm.autoCompleteBox.element = TestSettings.autoCompleteBoxElement;
            
            //act
            vm.onAfterShow();
                        
            //assert
            QUnit.equal(vm.site(), selectedSite);
        });         
       
        QUnit.test("test savedSearchViewModel setSelectedSearch", function () {
            //arrange
            var vm,
                searchData = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml);
            
            vm = new savedSearchViewModel();
            
            //act 
            vm.setSelectedSearch(searchData);
                        
            //assert
            QUnit.equal(vm.selectedSearch(), searchData);
        });    
        
        QUnit.test("test savedSearchViewModel setSelectedSearch already set", function () {
            //arrange
            var vm,
                searchData = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml);
            
            vm = new savedSearchViewModel();
            vm.selectedSearch(searchData);
            
            //act 
            vm.setSelectedSearch(searchData);
                        
            //assert
            QUnit.equal(vm.selectedSearch(), null);
        });    
        
        QUnit.test("test savedSearchViewModel setSelectedSearch with event object", function () {
            //arrange
            var vm,
                searchData = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml)
                event = {stopImmediatePropagation: function () {}};
            
            vm = new savedSearchViewModel();
            
            //act 
            vm.setSelectedSearch(searchData, event);
                        
            //assert
            QUnit.equal(vm.selectedSearch(), searchData);
        });       
        
        QUnit.test("test savedSearchViewModel isSelectedSearch equal", function () {
            //arrange
            var vm,
                searchData = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml);
            
            vm = new savedSearchViewModel();
            vm.selectedSearch(searchData);
            
            //act 
            var result = vm.isSelectedSearch(searchData);
                        
            //assert
            QUnit.equal(result, true);
        });        
        
        QUnit.test("test savedSearchViewModel isSelectedSearch not equal", function () {
            //arrange
            var vm,
                searchData = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml);
            
            vm = new savedSearchViewModel();
            
            //act 
            var result = vm.isSelectedSearch(searchData);
                        
            //assert
            QUnit.equal(result, false);
        });        
        
        QUnit.test("test savedSearchViewModel isSelectedSearch null", function () {
            //arrange
            var vm;
            
            vm = new savedSearchViewModel();
            
            //act 
            var result = vm.isSelectedSearch();
                        
            //assert
            QUnit.equal(result, false);
        });         
                       
        QUnit.test("test savedSearchViewModel searchClick equal", function () {
            //arrange
            var vm,
                searchData = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml);
            
            vm = new savedSearchViewModel();
            vm.selectedSearch(searchData);
            
            //act 
            vm.searchClick(searchData);
                        
            //assert
            QUnit.equal(vm.selectedSearch(), searchData);
        });         
                       
        QUnit.test("test savedSearchViewModel search", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));           
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"site": selectedSite}));
            
            vm = new savedSearchViewModel();            
            vm.autoCompleteBox.element = TestSettings.autoCompleteBoxElement;
            
            //act 
            vm.search();
                        
            //assert
            QUnit.ok(vm);
        });  
        
        QUnit.test("test savedSearchViewModel onSearchKeyUp", function () {
            //arrange
            var vm,
                selection = new search(TestSettings.ntlmTestUrl, TestSettings.searchTitle, searchType.server, TestSettings.testKlaml)
                event = {keyCode: 13};
            
            //act 
            vm = new savedSearchViewModel();
            vm.onSearchKeyUp(selection, event);
                        
            //assert
            QUnit.ok(vm);
        });
    });