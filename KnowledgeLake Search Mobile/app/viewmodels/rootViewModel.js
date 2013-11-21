define(["knockout", "jquery", "application", "viewmodels/viewModelBase", "domain/navigationContext", "domain/navigationPage", "domain/navigationDirection", "domain/Constants"],
function (ko, $, application, viewModelBase, navigationContext, navigationPage, navigationDirection, Constants) {
    var rootViewModel = function () {
        var self = this;

        self.prototype = Object.create(viewModelBase.prototype);
        viewModelBase.call(self);

        self.viewModels = {};

        self.homeVisibility = ko.observable(true);
        self.logsVisibility = ko.observable(false);
        self.configureSiteVisibility = ko.observable(false);
        self.savedSearchVisibility = ko.observable(false);
        self.searchBuilderVisibility = ko.observable(false);
        self.resultsVisibility = ko.observable(false);
        self.documentVisibility = ko.observable(false);

        self.appendViewModelToRoot = function (modelName, model, visibilityProperty) {
            self.viewModels["#" + modelName] = { 'model': model, 'visibilityProperty': self[visibilityProperty] };
        }

        self.lastViewModelLoaded = function () {
            for (var viewModel in self.viewModels)
            {
                if (self.viewModels[viewModel].model.init) {
                    self.viewModels[viewModel].model.init();

                    if (viewModel === navigationPage.homePage) {
                        self.navigateTo(viewModel);
                    }
                }
            }
        }

        self.onNavigate = function (to, from, state, direction) {
            if (to && self.viewModels[to]) {
                if (from && self.viewModels[from]) {
                    if (state !== navigationDirection.composite)
                        self.hideViews();

                    if (direction !== navigationDirection.standard)
                        application.navigator.updateNavigationIndex(direction);

                    if (direction === navigationDirection.standard && state === navigationDirection.composite)
                        self.navigateTo(to);

                    else if (application.navigator.currentNavigationContext &&
                             application.navigator.currentNavigationContext.desiredPage === navigationPage.resultsPage &&
                             direction === navigationDirection.back)
                    {
                        self.navigateFrom(from);
                        self.navigateTo(application.navigator.currentNavigationContext.currentPage);
                        self.navigateTo(navigationPage.resultsPage);
                    }
                    else
                    {
                        self.navigateFrom(from);
                        self.navigateTo(to);
                    }
                }
                else
                    self.navigateTo(to);
            }
        }

        self.hideViews = function () {
            for(var viewModel in self.viewModels)
            {
                if (self.viewModels[viewModel].visibilityProperty)
                    self.viewModels[viewModel].visibilityProperty(false);
            }
        }

        self.determineView = function () {
            var visible;

            for (var viewModel in self.viewModels) {
                if (self.viewModels[viewModel].visibilityProperty())
                    visible = viewModel;
            }

            return visible; 
        }

        self.navigateTo = function (to) {
            if (to && self.viewModels[to]) {
                self.viewModels[to].visibilityProperty(true);

                self.viewModels[to].model.beforeShow();
                self.viewModels[to].model.show();
                self.viewModels[to].model.afterShow();
            }
        }

        self.navigateFrom = function (from) {
            if (from && self.viewModels[from]) {
                self.viewModels[from].model.hide();
                self.viewModels[from].visibilityProperty(false);
            }
        }

        self.navigateToHome = function () {
            self.hideBars();

            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.homePage, self.determineView()));
        }

        self.navigateToLogs = function () {
            self.hideBars();

            application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.logsPage, self.determineView()));
        }

        self.hideBars = function () {
            var bars = [document.getElementById("NavBar").winControl];

            if (self.viewModels[navigationPage.homePage].visibilityProperty())
                bars.push(document.getElementById("AppBar").winControl);

            for (var bar in bars)
            {
                bars[bar].hide();
                bars[bar].sticky = false;
            }
        }

        //settings charm items
        if (window.WinJS) {
            Windows.UI.ApplicationSettings.SettingsPane.getForCurrentView().addEventListener("commandsrequested", function (args) {
                var addSiteCommand = new Windows.UI.ApplicationSettings.SettingsCommand("addSiteSettingsCommand", self.strings().addSiteLinkText, self.addSite),
                    privacyCommand = new Windows.UI.ApplicationSettings.SettingsCommand("privacyPolicySettingsCommand", self.strings().PrivacyPolicyLinkTitle, self.launchPrivacyPolicy),
                    aboutCommand = new Windows.UI.ApplicationSettings.SettingsCommand("aboutSettingsCommand", self.strings().AboutLinkTitle, self.launchAbout),
                    feedbackCommand = new Windows.UI.ApplicationSettings.SettingsCommand("feedbackSettingsCommand", self.strings().FeedbackLinkTitle, self.launchFeedback),
                    supportCommand = new Windows.UI.ApplicationSettings.SettingsCommand("supportSettingsCommand", self.strings().SupportLinkTitle, self.launchSupport);

                args.request.applicationCommands.append(addSiteCommand);
                args.request.applicationCommands.append(aboutCommand);
                args.request.applicationCommands.append(privacyCommand);
                args.request.applicationCommands.append(feedbackCommand);
                args.request.applicationCommands.append(supportCommand);
            });

            self.launchPrivacyPolicy = function () {
                var uri = new Windows.Foundation.Uri(Constants.PrivacyPolicyUrl);
                Windows.System.Launcher.launchUriAsync(uri);
            }

            self.addSite = function () {
                self.viewModels[navigationPage.homePage].model.addSite();
            }

            self.launchAbout = function () {
                var uri = new Windows.Foundation.Uri(Constants.AboutLinkUrl);
                Windows.System.Launcher.launchUriAsync(uri);
            }

            self.launchFeedback = function () {
                var uri = new Windows.Foundation.Uri(Constants.getFeedbackLinkUrl());
                Windows.System.Launcher.launchUriAsync(uri);
            }

            self.launchSupport = function () {
                var uri = new Windows.Foundation.Uri(Constants.SupportLinkUrl);
                Windows.System.Launcher.launchUriAsync(uri);
            }


            dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView().addEventListener("datarequested", function (e) {
                var request = e.request,
                    fileHandle,
                    createFilePromise,
                    logsVM = self.viewModels[navigationPage.logsPage].model;

                request.data.properties.title = self.strings().EmailLogs;
                request.data.properties.description = self.strings().EmailLogs;
                request.data.properties.fileTypes.replaceAll([".txt"]);

                createFilePromise = logsVM.createLogFile();

                createFilePromise.done(function (handle) {
                    fileHandle = handle;
                });

                createFilePromise.fail(function (error) {
                    fileHandle = null;
                    self.setMessage(error);
                });

                request.data.setDataProvider(Windows.ApplicationModel.DataTransfer.StandardDataFormats.storageItems, function (req) {
                    if (fileHandle) {
                        req.setData([fileHandle]);
                    }
                });
            });
        }

        return self;
    };

    return rootViewModel;
});