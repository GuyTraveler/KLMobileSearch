/*global QUnit*/
define(["application",
        'require',
        'jquery',
        'knockout',
        'viewmodels/documentViewModel',
        'viewmodels/resultsViewModel',
        'viewmodels/savedSearchViewModel',
        'viewmodels/searchBuilderViewModel',
        'domain/documentProperty',
        "domain/result",
        "domain/site",
        "domain/credential",
        "domain/credentialType",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
        "unitTests/unitTestSettings",
		"domain/keywordConjunction",
		//uncaught
		"extensions"],
    function (application, require, $, ko, documentViewModel, resultsViewModel, savedSearchViewModel, searchBuilderViewModel, documentProperty, result, 
              site, credential, credentialType, navigationDirection, navigationPage, navigationContext, TestSettings, keywordConjunction) {
        QUnit.module("Testing documentViewModel");
        
        QUnit.test("test SetDataSource if documentDataSource is already defined", function () {
            //arrange
            var vm,
                documentData = [];
            
            documentData.push(new documentProperty(TestSettings.testDocumentPropertyName, TestSettings.testDocumentPropertyDisplayName, false, TestSettings.testDocumentPropertyValue));
            
            vm = new documentViewModel();
            vm.documentDataSource(["test", "data"]);
            
			//act
            vm.SetDataSource(documentData);
			
			//assert
            QUnit.equal(vm.documentDataSource(), documentData);
        });
        
        QUnit.test("test SetDataSource if documentDataSource is empty", function () {
            //arrange
            var vm,
                documentData = [];
            
            documentData.push(new documentProperty(TestSettings.testDocumentPropertyName, TestSettings.testDocumentPropertyDisplayName, false, TestSettings.testDocumentPropertyValue));
            
            vm = new documentViewModel();            
            vm.documentDataSource([]);
            
			//act
            vm.SetDataSource(documentData);
			
			//assert
            QUnit.equal(vm.documentDataSource(), documentData);
        });
       
        QUnit.test("test documentViewModel ctor", function () {
            //arrange
            var vm;
            
            //act 
            vm = new documentViewModel();
                        
            //assert
            QUnit.ok(vm);
            QUnit.ok(window.App);
			QUnit.ok(window.App.isMock);
        });
		
        QUnit.test("test documentViewModel onBeforeShow", function () {
            //arrange
            var vm;
            
            vm = new documentViewModel();
            
            //act
            vm.onBeforeShow();
                        
            //assert
            QUnit.ok(vm);
        });
       
        QUnit.test("test documentViewModel onAfterShow", function () {            
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain))
                selectedResult = new result(TestSettings.docUrl, {"title": TestSettings.docTitle});
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.documentPropertiesPage, navigationPage.resultsPage, 
                {"site": selectedSite, "result": selectedResult}));
                        
			vm = new documentViewModel();
            
            //act
            vm.onAfterShow();
            
            //assert
            QUnit.ok(vm);
        });
     
        QUnit.asyncTest("test documentViewModel getDocumentProperties", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain))
                selectedResult = new result(TestSettings.docUrl, {"title": TestSettings.docTitle});
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.documentPropertiesPage, navigationPage.resultsPage, 
                {"site": selectedSite, "result": selectedResult}));
                        
			vm = new documentViewModel();
            
            //act
            var getDocumentPropertiesPromise = vm.getDocumentProperties();    
                        
            //assert
            getDocumentPropertiesPromise.done(function (result) {
                QUnit.ok(true);                
                QUnit.start();
            });
            
            getDocumentPropertiesPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("test documentViewModel getDocumentProperties bad credentials", function () {
            //arrange
            var vm,
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, "", TestSettings.ntlmTestDomain))
                selectedResult = new result(TestSettings.docUrl, {"title": TestSettings.docTitle});
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.documentPropertiesPage, navigationPage.resultsPage, 
                {"site": selectedSite, "result": selectedResult}));
                        
			vm = new documentViewModel();
            
            //act
            var getDocumentPropertiesPromise = vm.getDocumentProperties();    
                        
            //assert
            getDocumentPropertiesPromise.done(function (result) {
                QUnit.ok(false);                
                QUnit.start();
            });
            
            getDocumentPropertiesPromise.fail(function (error) {
                QUnit.ok(true);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("test documentViewModel getDocumentProperties bad document url", function () {
            //arrange
            var vm,
                resultsVM,
                savedSearchVM; 
            
            savedSearchVM = new savedSearchViewModel();
			resultsVM = new resultsViewModel();
			vm = new documentViewModel();
            savedSearchVM.site = ko.observable(new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)));
            resultsVM.selectedResult = new result("", {"title": TestSettings.docTitle});     
            
            window.savedSearchViewModel = savedSearchVM;
            window.resultsViewModel = resultsVM;  
            
            //act
            var getDocumentPropertiesPromise = vm.getDocumentProperties();    
                        
            //assert
            getDocumentPropertiesPromise.done(function (result) {
                QUnit.ok(false);                
                QUnit.start();
            });
            
            getDocumentPropertiesPromise.fail(function (error) {
                QUnit.ok(true);
                QUnit.start();
            });
        });
    });
