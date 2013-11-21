/*global QUnit*/
define(['require',
        'jquery',
        'knockout',
        'application',
        'viewmodels/rootViewModel',
        'viewmodels/homeViewModel',
        'viewmodels/savedSearchViewModel',
        'viewmodels/resultsViewModel',
        "domain/navigationContext",
        "domain/navigationPage",
        "domain/navigationDirection",
        "unitTests/unitTestSettings"],
    function (require, $, ko, application, rootViewModel, homeViewModel, savedSearchViewModel, resultsViewModel, navigationContext, navigationPage, navigationDirection, TestSettings) {
        QUnit.module("Testing rootViewModel");
        
        QUnit.test("test rootViewModel ok", function () {
            //arrange
            var vm;
           
			//act
            vm = new rootViewModel();
			
			//assert
            QUnit.ok(vm);
        });

        QUnit.test("test rootViewModel appendViewModelToRoot null", function () {
            //arrange
            var vm = new rootViewModel();

            //act
            vm.appendViewModelToRoot();

            //assert
            QUnit.ok(vm);
        });

        QUnit.test("test rootViewModel appendViewModelToRoot", function () {
            //arrange
            var vm = new rootViewModel();

            //act
            vm.appendViewModelToRoot(TestSettings.testModelName, new homeViewModel(), TestSettings.testHomeVisibilityProperty);

            //assert
            QUnit.ok(vm.viewModels[navigationPage.homePage]);
        });

        QUnit.test("test rootViewModel lastViewModelLoaded empty viewModels", function () {
            //arrange
            var vm = new rootViewModel();

            //act
            vm.lastViewModelLoaded();

            //assert
            QUnit.ok(vm);
        });

        QUnit.test("test rootViewModel lastViewModelLoaded with homePage in viewModels", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };

            //act
            vm.lastViewModelLoaded();

            //assert
            QUnit.ok(vm.viewModels[navigationPage.homePage].visibilityProperty());
        });

        QUnit.test("test rootViewModel onNavigate null", function () {
            //arrange
            var vm = new rootViewModel();

            //act
            vm.onNavigate();

            //assert
            QUnit.ok(vm);
        });

        QUnit.test("test rootViewModel onNavigate to defined", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };

            //act
            vm.onNavigate(navigationPage.homePage);

            //assert
            QUnit.ok(vm.viewModels[navigationPage.homePage].visibilityProperty());
        });

        QUnit.test("test rootViewModel onNavigate to from defined", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };
            vm.viewModels[navigationPage.savedSearchPage] = { 'model': new savedSearchViewModel(), 'visibilityProperty': vm[TestSettings.testSavedSearchVisibilityProperty] };

            //window.application = application; 
            //act
            vm.onNavigate(navigationPage.savedSearchPage, navigationPage.homePage, null, navigationDirection.standard);

            //assert
            QUnit.equal(vm.viewModels[navigationPage.homePage].visibilityProperty(), false);
            QUnit.equal(vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(), true);
        });

        QUnit.test("test rootViewModel onNavigate to from state direction defined composite", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };
            vm.viewModels[navigationPage.savedSearchPage] = { 'model': new savedSearchViewModel(), 'visibilityProperty': vm[TestSettings.testSavedSearchVisibilityProperty] };

            //act
            vm.onNavigate(navigationPage.savedSearchPage, navigationPage.homePage, navigationDirection.composite, navigationDirection.standard);

            //assert
            QUnit.equal(vm.viewModels[navigationPage.homePage].visibilityProperty(), true);
            QUnit.equal(vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(), true);
        });

        QUnit.test("test rootViewModel onNavigate to from state direction defined back", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };
            vm.viewModels[navigationPage.savedSearchPage] = { 'model': new savedSearchViewModel(), 'visibilityProperty': vm[TestSettings.testSavedSearchVisibilityProperty] };
            vm.viewModels[navigationPage.resultsPage] = { 'model': new resultsViewModel(), 'visibilityProperty': vm[TestSettings.testResultsVisibilityProperty] };

            application.navigator.globalNavigationContext = [new navigationContext(navigationDirection.standard, navigationPage.resultsPage, navigationPage.savedSearchPage)];
            application.navigator.updateCurrentIndex(0);

            //act
            vm.onNavigate(navigationPage.savedSearchPage, navigationPage.homePage, navigationDirection.composite, navigationDirection.back);

            //assert
            QUnit.equal(vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(), true);
            QUnit.equal(vm.viewModels[navigationPage.resultsPage].visibilityProperty(), true);
        });

        QUnit.test("test rootViewModel hideViews", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };
            vm.viewModels[navigationPage.savedSearchPage] = { 'model': new savedSearchViewModel(), 'visibilityProperty': vm[TestSettings.testSavedSearchVisibilityProperty] };
            vm.viewModels[navigationPage.resultsPage] = { 'model': new resultsViewModel(), 'visibilityProperty': vm[TestSettings.testResultsVisibilityProperty] };

            vm.viewModels[navigationPage.homePage].visibilityProperty(true);
            vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(true);
            vm.viewModels[navigationPage.resultsPage].visibilityProperty(true);

            //act
            vm.hideViews();

            //assert
            QUnit.equal(vm.viewModels[navigationPage.homePage].visibilityProperty(), false);
            QUnit.equal(vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(), false);
            QUnit.equal(vm.viewModels[navigationPage.resultsPage].visibilityProperty(), false);
        });

        QUnit.test("test rootViewModel determineView", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };
            vm.viewModels[navigationPage.savedSearchPage] = { 'model': new savedSearchViewModel(), 'visibilityProperty': vm[TestSettings.testSavedSearchVisibilityProperty] };
            vm.viewModels[navigationPage.resultsPage] = { 'model': new resultsViewModel(), 'visibilityProperty': vm[TestSettings.testResultsVisibilityProperty] };

            vm.viewModels[navigationPage.homePage].visibilityProperty(false);
            vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(false);
            vm.viewModels[navigationPage.resultsPage].visibilityProperty(true);

            //act
            var result = vm.determineView();

            //assert
            QUnit.equal(result, navigationPage.resultsPage);
        });

        QUnit.test("test rootViewModel navigateTo", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };
            vm.viewModels[navigationPage.savedSearchPage] = { 'model': new savedSearchViewModel(), 'visibilityProperty': vm[TestSettings.testSavedSearchVisibilityProperty] };
            vm.viewModels[navigationPage.resultsPage] = { 'model': new resultsViewModel(), 'visibilityProperty': vm[TestSettings.testResultsVisibilityProperty] };

            vm.viewModels[navigationPage.homePage].visibilityProperty(false);
            vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(false);
            vm.viewModels[navigationPage.resultsPage].visibilityProperty(false);

            //act
            vm.navigateTo(navigationPage.homePage);

            //assert
            QUnit.ok(vm.viewModels[navigationPage.homePage].visibilityProperty());
        });

        QUnit.test("test rootViewModel navigateFrom", function () {
            //arrange
            var vm = new rootViewModel();
            vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };
            vm.viewModels[navigationPage.savedSearchPage] = { 'model': new savedSearchViewModel(), 'visibilityProperty': vm[TestSettings.testSavedSearchVisibilityProperty] };
            vm.viewModels[navigationPage.resultsPage] = { 'model': new resultsViewModel(), 'visibilityProperty': vm[TestSettings.testResultsVisibilityProperty] };

            vm.viewModels[navigationPage.homePage].visibilityProperty(true);
            vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(false);
            vm.viewModels[navigationPage.resultsPage].visibilityProperty(false);

            //act
            vm.navigateFrom(navigationPage.homePage);

            //assert
            QUnit.equal(vm.viewModels[navigationPage.homePage].visibilityProperty(), false);
        });

        //QUnit.test("test rootViewModel navigateToHome", function () {
        //    //arrange
        //    var vm = new rootViewModel();
        //    vm.viewModels[navigationPage.homePage] = { 'model': new homeViewModel(), 'visibilityProperty': vm[TestSettings.testHomeVisibilityProperty] };
        //    vm.viewModels[navigationPage.savedSearchPage] = { 'model': new savedSearchViewModel(), 'visibilityProperty': vm[TestSettings.testSavedSearchVisibilityProperty] };
        //    vm.viewModels[navigationPage.resultsPage] = { 'model': new resultsViewModel(), 'visibilityProperty': vm[TestSettings.testResultsVisibilityProperty] };

        //    vm.viewModels[navigationPage.homePage].visibilityProperty(false);
        //    vm.viewModels[navigationPage.savedSearchPage].visibilityProperty(true);
        //    vm.viewModels[navigationPage.resultsPage].visibilityProperty(false);

        //    //act
        //    vm.navigateToHome();

        //    //assert
        //    QUnit.ok(vm.viewModels[navigationPage.homePage].visibilityProperty());
        //});


        //self.navigateToHome = function () {
        //    self.hideBars();

        //    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.homePage, self.determineView()));
        //}

        //self.navigateToLogs = function () {
        //    self.hideBars();

        //    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.logsPage, self.determineView()));
        //}

        //self.hideBars = function () {
        //    var bars = [document.getElementById("NavBar").winControl];

        //    if (self.viewModels[navigationPage.homePage].visibilityProperty())
        //        bars.push(document.getElementById("AppBar").winControl);

        //    for (var bar in bars) {
        //        bars[bar].hide();
        //        bars[bar].sticky = false;
        //    }
        //}
	});