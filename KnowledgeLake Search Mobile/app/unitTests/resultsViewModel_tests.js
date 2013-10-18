/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
		'domain/Constants',
        'viewmodels/resultsViewModel',
        'viewmodels/savedSearchViewModel',
        'viewmodels/searchBuilderViewModel',
        "domain/result",
        "domain/site",
        "domain/credential",
        "domain/credentialType",
		"application",
        "unitTests/unitTestSettings",
		"domain/keywordConjunction",
		//uncaught
		"extensions"],
    function (require, $, ko, Constants, resultsViewModel, savedSearchViewModel, searchBuilderViewModel, result, site, credential, credentialType, application, TestSettings, keywordConjunction) {
        QUnit.module("Testing resultsViewModel");
        
        QUnit.test("test SetDataSource if resultDataSource is already defined", function () {
            //arrange
            var vm;
			var resultData = [];
            resultData.push(new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"}));
            
            vm = new resultsViewModel();
            vm.resultDataSource(["test", "data"]);
            
			//act
            vm.SetDataSource(resultData);
			
			//assert
            QUnit.equal(vm.resultDataSource(), resultData);
        });
        
        QUnit.test("test SetDataSource if resultDataSource is empty", function () {
            //arrange
            var vm;
			var resultData = [];
            resultData.push(new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"}));
            
            vm = new resultsViewModel();            
            vm.resultDataSource([]);
            
			//act
            vm.SetDataSource(resultData);
			
			//assert
            QUnit.equal(vm.resultDataSource(), resultData);
        });
       
        QUnit.test("test resultViewModel ctor", function () {
            //arrange
            var vm;
            
            //act 
            vm = new resultsViewModel();
                        
            //assert
            QUnit.ok(vm);
            QUnit.ok(window.App);
			QUnit.ok(window.App.isMock);
        });    
        
		QUnit.test("test resultCountString reads properly for NO results", function () {
			//arrange
            var vm,
				resultData = [];
            
            //act 
            vm = new resultsViewModel();
			vm.SetDataSource(resultData);
                        
            //assert
			QUnit.equal(vm.resultDataSource().length, resultData.length);
            QUnit.equal(vm.resultCountString(), application.strings.noResultsFound);
        });
		  
		QUnit.test("test resultCountString reads properly for ONE result", function () {
			//arrange
            var vm,
				resultData = [
					new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"})
				],
				expectedMessage;
            
            //act 
            vm = new resultsViewModel();
			vm.SetDataSource(resultData);
			
			expectedMessage = application.strings.resultCountFormat.format(resultData.length.toString());
			expectedMessage = expectedMessage.substring(0, expectedMessage.length - 1);
                        
            //assert
            QUnit.equal(vm.resultDataSource().length, resultData.length);
			QUnit.equal(vm.resultCountString(), expectedMessage);
        });
			  
		QUnit.test("test resultCountString reads properly for MULTIPLE results", function () {
			//arrange
            var vm,
				resultData = [
					new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"}),
					new result("http://prodsp2010.dev.local/sites/team2/RyanLib/6Page.pdf", {"title":"pdf"}),
					new result("http://prodsp2010.dev.local/sites/team2/RyanLib/7Page.pdf", {"title":"pdf"})
				],
				expectedMessage;
            
            //act 
            vm = new resultsViewModel();
			vm.SetDataSource(resultData);
			
			expectedMessage = application.strings.resultCountFormat.format(resultData.length.toString());
                        
            //assert
            QUnit.equal(vm.resultDataSource().length, resultData.length);
			QUnit.equal(vm.resultCountString(), expectedMessage);
        });
				  
		QUnit.test("test resultCountString reads properly for MAX results", function () {
			//arrange
            var vm,
				resultData = [],
				expectedMessage;
            
            //act 
            vm = new resultsViewModel();
			
			for (var i = 0; i < Constants.maxResults + 1; i++) {
				resultData.push(new result("http://prodsp2010.dev.local/sites/team2/RyanLib/" + i + "Page.pdf", {"title":"pdf"}));
            }
			
			vm.SetDataSource(resultData);
			
			expectedMessage = application.strings.maxResultsFormat.format(resultData.length.toString());
                        
            //assert
            QUnit.equal(vm.resultDataSource().length, resultData.length);
			QUnit.equal(vm.resultCountString(), expectedMessage);
        });
		
        QUnit.test("test resultsViewModel swipe", function () {
            //arrange
            var vm,
                swipeObject = {"direction":"right"};
            
            vm = new resultsViewModel();
            
            
            //act
            vm.swipe(swipeObject);
                        
            //assert
            QUnit.ok(vm);
        });
        
        QUnit.test("test resultsViewModel onBeforeShow", function () {
            //arrange
            var vm;
            
            vm = new resultsViewModel();
            
            //act
            vm.onBeforeShow();
                        
            //assert
            QUnit.ok(vm);
        });
       
        QUnit.asyncTest("test resultsViewModel onAfterShow keywordSearchAsync (AND)", function () {
            //arrange
            var vm,
                savedSearchVM,
				keywordSearchPromise;
            
            savedSearchVM = new savedSearchViewModel();
			vm = new resultsViewModel();
            savedSearchVM.site = ko.observable(new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            savedSearchVM.keyword = ko.observable("ryan");
			savedSearchVM.wordConjunction = ko.observable(keywordConjunction.and);
            
            window.savedSearchViewModel = savedSearchVM;
            
            //act
            keywordSearchPromise = vm.onAfterShow();
                        
            //assert
            QUnit.ok(vm);
			QUnit.ok(keywordSearchPromise);
			
			keywordSearchPromise.done(function () {
				QUnit.ok(true);
				QUnit.start();
            });
			
			keywordSearchPromise.fail(function () {
				QUnit.ok(false);
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("test resultsViewModel onAfterShow keywordSearchAsync (OR)", function () {
            //arrange
            var vm,
                savedSearchVM,
				keywordSearchPromise;
            
            savedSearchVM = new savedSearchViewModel();
			vm = new resultsViewModel();
            savedSearchVM.site = ko.observable(new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            savedSearchVM.keyword = ko.observable("ryan");
			savedSearchVM.wordConjunction = ko.observable(keywordConjunction.or);
            
            window.savedSearchViewModel = savedSearchVM;
            
            //act
            keywordSearchPromise = vm.onAfterShow();
                        
            //assert
            QUnit.ok(vm);
			QUnit.ok(keywordSearchPromise);
			
			keywordSearchPromise.done(function () {
				QUnit.ok(true);
				QUnit.start();
            });
			
			keywordSearchPromise.fail(function () {
				QUnit.ok(false);
				QUnit.start();
            });
        });
       
        QUnit.asyncTest("test resultsViewModel onAfterShow propertySearchAsync", function () {
            //arrange
            var vm,
                savedSearchVM,
                searchBuilderVM,
				propertySearchPromise;
            
            savedSearchVM = new savedSearchViewModel();
            searchBuilderVM = new searchBuilderViewModel();
			vm = new resultsViewModel();
            savedSearchVM.site = ko.observable(new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            searchBuilderVM.klaml = TestSettings.testKlaml;
            
            window.savedSearchViewModel = savedSearchVM;
            window.searchBuilderViewModel = searchBuilderVM;
            
            //act
            propertySearchPromise = vm.onAfterShow();
                        
            //assert
            QUnit.ok(vm);
			QUnit.ok(propertySearchPromise);
			
			propertySearchPromise.done(function () {
				QUnit.ok(true);
				QUnit.start();
            });
			
			propertySearchPromise.fail(function () {
				QUnit.ok(false);
				QUnit.start();
            });
        });
        
        QUnit.test("test resultsViewModel setSelectedResult if selectedResult is null", function () {
            //arrange
            var vm;
            var resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"});
            
            vm = new resultsViewModel();
            vm.selectedResult = null;
            
            //act
            vm.setSelectedResult(resultData);
                        
            //assert
            QUnit.equal(vm.selectedResult, resultData);
        });
        
        QUnit.test("test resultsViewModel setSelectedResult if selectedResult is equal", function () {
            //arrange
            var vm;
            var resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"});
            
            vm = new resultsViewModel();
            vm.selectedResult = resultData;
            
            //act
            vm.setSelectedResult(resultData);
                        
            //assert
            QUnit.equal(vm.selectedResult, null);
        });
        
        QUnit.test("test resultsViewModel setSelectedResult if selectedResult is not equal", function () {
            //arrange
            var vm;
            var resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"});
            var testData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/10Page.pdf", {"title":"pdf"});
            
            vm = new resultsViewModel();
            vm.selectedResult= resultData;
            
            //act
            vm.setSelectedResult(testData);
                        
            //assert
            QUnit.equal(vm.selectedResult, testData);
        });
        
        QUnit.test("test resultsViewModel isSelectedResult if navBarVisible false", function () {
            //arrange
            var vm,
                resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/10Page.pdf", {"title":"pdf"});
            
            vm = new resultsViewModel();
            vm.navBarVisible(false);
            
            //act
            var product = vm.isSelectedResult(resultData);
                        
            //assert
            QUnit.equal(product, false);
        });
        
        QUnit.test("test resultsViewModel isSelectedResult if navBarVisible true", function () {
            //arrange
            var vm,
                resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"});    
            
            vm = new resultsViewModel();
            vm.navBarVisible(true);
            vm.selectedResult = resultData;
            
            //act
            var product = vm.isSelectedResult(resultData);
                        
            //assert
            QUnit.equal(product, true);
        });
        /*
        QUnit.test("test resultsViewModel editProperties", function () {
            //arrange
            var vm,
                resultData = new result("http://prodsp2010.dev.local/sites/team2/RyanLib/5Page.pdf", {"title":"pdf"});    
            
            vm = new resultsViewModel();
            vm.selectedResult = resultData;
            
            //act
            vm.editProperties();
                        
            //assert
            QUnit.ok(vm);
        });
        */
        QUnit.asyncTest("test resultsViewModel navigateToResult", function () {
            //arrange
            var vm,
                savedSearchVM,
                resultData = new result("http://prodsp2010.dev.local/sites/team5/Simulation Library/2013022000028SIMSR101.TIF", {"title":"Invoice"}); 
            
            savedSearchVM = new savedSearchViewModel();
			vm = new resultsViewModel();
            savedSearchVM.site = ko.observable(new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev")));
            
            window.savedSearchViewModel = savedSearchVM;      
            
            //act
            var navigatePromise = vm.navigateToResult(resultData);    
                        
            //assert
            navigatePromise.done(function (result) {
                QUnit.ok(true);
                
                if (vm.windowRef) {
					vm.windowRef.close();
                }
                
                QUnit.start();
            });
            
            navigatePromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
      
        QUnit.asyncTest("test resultsViewModel keywordSearch bad credentials", function () {
            //arrange
            var vm,            
                siteData = new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan", "pw", "dev"));  
            
            vm = new resultsViewModel();
            
            //act
            var keywordSearchPromise = vm.keywordSearchAsync(siteData);
            
            //assert
            keywordSearchPromise.done(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
            
            keywordSearchPromise.fail(function (error) {
                QUnit.equal(error.response, application.strings.logonFailed);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("test resultsViewModel keywordSearch good credentials", function () {
            //arrange
            var vm,            
                siteData = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));  
            
            vm = new resultsViewModel();
            
            //act
            var keywordSearchPromise = vm.keywordSearchAsync(siteData, "ryan");
            
            //assert
            keywordSearchPromise.done(function (result) {
                QUnit.ok(true);
                QUnit.start();
            });
            
            keywordSearchPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
      
        QUnit.asyncTest("test resultsViewModel propertySearch bad credentials", function () {
            //arrange
            var vm,            
                siteData = new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan", "pw", "dev"));  
            
            vm = new resultsViewModel();
            
            //act
            var propertySearchPromise = vm.propertySearchAsync(siteData, TestSettings.testKlaml);
            
            //assert
            propertySearchPromise.done(function (result) {
                QUnit.ok(false);
                QUnit.start();
            });
            
            propertySearchPromise.fail(function (error) {
                QUnit.ok(true);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("test resultsViewModel propertySearch good credentials", function () {
            //arrange
            var vm,            
                siteData = new site("http://prodsp2010.dev.local/sites/team4", "ProdSP2010", 15, new credential(credentialType.ntlm, "ryan.braun", "password", "dev"));  
            
            vm = new resultsViewModel();
            
            //act
            var propertySearchPromise = vm.propertySearchAsync(siteData, TestSettings.testKlaml);
            
            //assert
            propertySearchPromise.done(function (result) {
                QUnit.ok(true);
                QUnit.start();
            });
            
            propertySearchPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        QUnit.test("test resultViewModel onAfterShow", function () {
            //arrange
            var vm, 
                object = {"view": {"footer": {"find": function (control) { return {"data": function(control) { return {"clear": function () {}}}}}}}};
            
            vm = new resultsViewModel();
            
            //act 
            vm.onAfterShow(object);
            
            //assert
            QUnit.ok(vm);
        });
    });
