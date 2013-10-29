/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'framework/klNavigator',
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",],
    function (require, $, ko, klNavigator, navigationDirection, navigationPage, navigationContext) {
        QUnit.module("Testing klNavigator");
        
        QUnit.test("test swipe right null globalNavigationContext", function () {
            //arrange
            var testNavigator = new klNavigator(),
                swipeObject = {"preventDefault": function () {}, "direction": "right"};
            
			//act
            testNavigator.swipe(swipeObject);
			
			//assert
            QUnit.ok(testNavigator);
        });
        
        QUnit.test("test swipe left null globalNavigationContext", function () {
            //arrange
            var testNavigator = new klNavigator(),
                swipeObject = {"preventDefault": function () {}, "direction": "left"};
            
			//act
            testNavigator.swipe(swipeObject);
			
			//assert
            QUnit.ok(testNavigator);
        });
        
        QUnit.test("test navigate", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"});
            
			//act
            testNavigator.navigate(testContext);
			
			//assert
            QUnit.deepEqual(testNavigator.currentNavigationContext, testContext);
            QUnit.deepEqual(testNavigator.globalNavigationContext[0], testContext);
        });
        
        QUnit.test("test navigate complex", function () {
            //arrange
            var testNavigator = new klNavigator(),
                forwardContext = new navigationContext(navigationDirection.forward),
                backContext = new navigationContext(navigationDirection.back),
                firstNavigationContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"}),
                secondNavigationContext = new navigationContext(navigationDirection.standard, navigationPage.searchBuilderPage, navigationPage.savedSearchPage, {"data": "more stuff"});
            
			//act
            testNavigator.navigate(firstNavigationContext);
            testNavigator.navigate(secondNavigationContext);
            testNavigator.navigate(backContext);
            testNavigator.navigate(forwardContext);
            testNavigator.navigate(backContext);
            testNavigator.navigate(firstNavigationContext);
			
			//assert
            QUnit.deepEqual(testNavigator.currentNavigationContext, firstNavigationContext);
        });
        
        QUnit.test("test navigate forward", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"}),
                forwardContext = new navigationContext(navigationDirection.forward);     
            
			//act
            testNavigator.navigate(testContext);
            testNavigator.navigate(forwardContext);
			
			//assert
            QUnit.equal(testNavigator.currentNavigationContext.navigationDirection, navigationDirection.forward);
        });
        
        QUnit.test("test navigate back", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"}),
                backContext = new navigationContext(navigationDirection.back);            
                        
			//act
            testNavigator.navigate(testContext);
            testNavigator.navigate(backContext);
			
			//assert
            QUnit.equal(testNavigator.currentNavigationContext.navigationDirection, navigationDirection.back);
        });
        
        QUnit.test("test navigate null", function () {
            //arrange
            var testNavigator = new klNavigator();
            
			//act
            testNavigator.navigate();
			
			//assert
            QUnit.deepEqual(testNavigator.currentNavigationContext, null);
        });
        
        QUnit.test("test updateCurrentIndex", function () {
            //arrange
            var testNavigator = new klNavigator();
            
			//act
            testNavigator.updateCurrentIndex(12);
			
			//assert
            QUnit.equal(testNavigator.currentIndex(), 12);
        });
        
        QUnit.test("test updateCurrentIndex null", function () {
            //arrange
            var testNavigator = new klNavigator();
            
			//act
            testNavigator.updateCurrentIndex();
			
			//assert
            QUnit.equal(testNavigator.currentIndex(), -1);
        });
        
        QUnit.test("test navigateCurrentPage", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"});
            
            testNavigator.navigate(testContext);
            
			//act
            testNavigator.navigateCurrentPage();
			
			//assert
            QUnit.deepEqual(testNavigator.currentNavigationContext, testContext);
        });
        
        QUnit.test("test navigateDesiredPage", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"});
            
            testNavigator.navigate(testContext);
            
			//act
            testNavigator.navigateDesiredPage();
			
			//assert
            QUnit.deepEqual(testNavigator.currentNavigationContext, testContext);
        });
        
        QUnit.test("test navigateDesiredPage true", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"});
            
            testNavigator.navigate(testContext);
            window.location.hash = navigationPage.savedSearchPage;
            
			//act
            var result = testNavigator.shouldNavigate(navigationPage.homePage);
			
			//assert
            QUnit.equal(result, true);
        });
        
        QUnit.test("test navigateDesiredPage true", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"});
            
            testNavigator.navigate(testContext);
            window.location.hash = navigationPage.savedSearchPage;
            
			//act
            var result = testNavigator.shouldNavigate(navigationPage.savedSearchPage);
			
			//assert
            QUnit.equal(result, false);
        });
        
        QUnit.test("test isStandardNavigation true", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"});
            
            testNavigator.navigate(testContext);
            
			//act
            var result = testNavigator.isStandardNavigation();
			
			//assert
            QUnit.equal(result, true);
        });
        
        QUnit.test("test isStandardNavigation false", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"}),
                backContext = new navigationContext(navigationDirection.back);
            
            testNavigator.navigate(testContext);
            testNavigator.navigate(backContext);
            
			//act
            var result = testNavigator.isStandardNavigation();
			
			//assert
            QUnit.equal(result, false);
        });
        
        QUnit.test("test currentNavigationContextHasProperties true", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"data": "stuff"});
            
            testNavigator.navigate(testContext);
            
			//act
            var result = testNavigator.currentNavigationContextHasProperties();
			
			//assert
            QUnit.equal(result, true);
        });
        
        QUnit.test("test currentNavigationContextHasProperties false", function () {
            //arrange
            var testNavigator = new klNavigator(),
                testContext = new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage);
            
            testNavigator.navigate(testContext);
            
			//act
            var result = testNavigator.currentNavigationContextHasProperties();
			
			//assert
            QUnit.equal(result, false);
        });
    });
