/*global QUnit*/
define(["application", 
        "domain/kendoKeywordBoxHandler",
        "domain/site",
        "domain/credential",
        "domain/credentialType",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
        "unitTests/unitTestSettings"],
    function (application, kendoKeywordBoxHandler, site, credential, credentialType, navigationDirection, navigationPage, navigationContext, TestSettings) {
        QUnit.module("Testing keywordBoxHandler");
        
        
        QUnit.test("Test kendoKeywordBoxHandler", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();
                        
            //act
            
            //assert
            QUnit.ok(autoCompleteBox);
        });        
        
        QUnit.test("Test kendoKeywordBoxHandler onChange", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();
                        
            //act
            autoCompleteBox.onChange();            
            
            //assert
            QUnit.equal(autoCompleteBox.select, false);
        });        
        
        QUnit.test("Test kendoKeywordBoxHandler onChange savedSearch", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();
            
            autoCompleteBox.select = true;
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage));
            
            window.savedSearchViewModel = {search: function () {}};
                                    
            //act
            autoCompleteBox.onChange();            
            
            //assert
            QUnit.equal(autoCompleteBox.select, false);
        });             
        
        QUnit.test("Test kendoKeywordBoxHandler onSelect", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();
                        
            //act
            autoCompleteBox.onSelect();            
            
            //assert
            QUnit.equal(autoCompleteBox.select, true);
        });        
        
        QUnit.test("Test kendoKeywordBoxHandler isElementValid true", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();
            autoCompleteBox.element = TestSettings.autoCompleteBoxElement;
                        
            //act
            var result = autoCompleteBox.isElementValid();            
            
            //assert
            QUnit.equal(result, true);
        });        
        
        QUnit.test("Test kendoKeywordBoxHandler isElementValid", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();
                        
            //act
            var result = autoCompleteBox.isElementValid();            
            
            //assert
            QUnit.equal(result, false);
        });          
        
        QUnit.test("Test kendoKeywordBoxHandler overrideSearchMethod", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler(),
                unexpected;
                
            autoCompleteBox.element = TestSettings.autoCompleteBoxElement;
            unexpected = autoCompleteBox.element.search; 
                        
            //act
            autoCompleteBox.overrideSearchMethod();            
            
            //assert
            QUnit.notEqual(autoCompleteBox.element.search, unexpected);
        });          
        
        QUnit.test("Test kendoKeywordBoxHandler popDropDown", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler(),
                e = "stuff", 
                event = {stopImmediatePropagation: function () {}},
                selectedSite = new site(TestSettings.ntlmTestUrl, "ProdSP2010", 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain));           ;
                
            autoCompleteBox.element = TestSettings.autoCompleteBoxElement;
            selectedSite.keywordSearches = ["test"];
            
            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, { site: selectedSite}));
                        
            //act
            autoCompleteBox.popDropDown(e, event);            
            
            //assert
            QUnit.ok(autoCompleteBox);
        });

        QUnit.test("Test kendoKeywordBoxHandler determineQueryText with text", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();

            //act
            var result = autoCompleteBox.determineQueryText(TestSettings.testSearchKeyword);

            //assert
            QUnit.equal(result, TestSettings.testSearchKeyword);
        });

        QUnit.test("Test kendoKeywordBoxHandler determineQueryText without text", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();

            autoCompleteBox.element = TestSettings.autoCompleteBoxElement;

            //act
            var result = autoCompleteBox.determineQueryText();

            //assert
            QUnit.equal(result, TestSettings.testSearchKeyword);
        });

        QUnit.test("Test kendoKeywordBoxHandler useAutoCompleteText with text", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();

            //act
            var result = autoCompleteBox.useAutoCompleteText(TestSettings.testSearchKeyword);

            //assert
            QUnit.equal(result, false);
        });

        QUnit.test("Test kendoKeywordBoxHandler useAutoCompleteText without text", function () {
            //arrange
            var autoCompleteBox = new kendoKeywordBoxHandler();

            autoCompleteBox.element = TestSettings.autoCompleteBoxElement;

            //act
            var result = autoCompleteBox.useAutoCompleteText();

            //assert
            QUnit.equal(result, true);
        });
	});