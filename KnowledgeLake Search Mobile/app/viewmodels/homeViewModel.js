define(["knockout", 
        "application",
        "config",
		"logger",
        "jquery", 
		"domain/Constants",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
		"viewmodels/viewModelBase",
        "FileManagement",
        "ISiteDataCachingService",
		"emailComposer"], 
    function (ko, application, config, logger, $, Constants, navigationDirection, navigationPage, navigationContext, viewModelBase, File, SiteDataCachingService, emailComposer) {
        var homeViewModel = function () {
            var self = this,
				selectionTimeout = 1000;
                       
			self.prototype = Object.create(viewModelBase.prototype);
			viewModelBase.call(self);

			if (window.WinJS) {
			    self.winrtSiteDataSource = new WinJS.Binding.List();

			    WinJS.Namespace.define("Converters", {
			        majorVersionToSiteIcon: WinJS.Binding.converter(function (majorVersion) {
			            return ko.bindingHandlers.majorVersionToSiteIcon.convert(majorVersion);
			        })
			    });
			}
			
            self.siteDataSource = ko.observableArray([]);
			
			self.hasData = ko.computed(function () {
				return self.siteDataSource() != null && self.siteDataSource().length > 0;
            });
            
            self.selectedSite = ko.observable(null);
            self.navBarVisible = ko.observable(false);
			self.hasHighlightedSite = ko.observable(false);
			self.isEmailSelected = ko.observable(false);
			self.isViewLogsSelected = ko.observable(false);
            
            self.isHold = false;
            
            self.navBarVisible.subscribe(function (newValue) {
				$(".nav-button").kendoMobileButton();
            });
            
            self.SetDataSource = function (sites) {
                self.selectedSite(null);
                self.siteDataSource([]);
                
                if(sites)
                {
                    self.siteDataSource(sites);
                }
            }
            
            self.LoadSiteData = function () {
                if(window.WinJS || (window.AppLoaded && window.AppLoaded() === true))
                {
                    if (SiteDataCachingService.sites) {
                        self.SetDataSource(SiteDataCachingService.sites);
                    }
                    else 
                    {
                        var loadSitesPromise;
						
						self.isBusy(true);
						
						loadSitesPromise = SiteDataCachingService.LoadSitesAsync()
                      
                        loadSitesPromise.done(function (result) {
							self.isBusy(false);
							
                            if (result.response && Object.prototype.toString.call(result.response) === '[object Array]' && result.response.length > 0)
                                self.SetDataSource(result.response);
                        });
                      
                        loadSitesPromise.fail(function (error) {
							self.isBusy(false);
							
                            if (error.response !== application.strings.FileNotFound) {                                
                                self.SetDataSource();
								application.showToast(application.strings.siteLoadError);
                            }
                        });
                    }
                }
            }
            
            self.onInit = function (e) {
                logger.logVerbose("homeViewModel.onInit");

                if (window.WinJS) {
                    self.LoadSiteData();
                }
				
                else {
                    window.AppLoaded.subscribe(function (updatedValue) {
                        if (updatedValue)
                            self.LoadSiteData();
                    });
                }
            }
            
            self.onBeforeShow = function (e) {
				logger.logVerbose("homeViewModel onBeforeShow");   
            
                self.navBarVisible(false);
				self.hasHighlightedSite(false);                    
            }
           
			self.onAfterShow = function (e) {
				logger.logVerbose("homeViewModel.afterShow");
				
				if((window.WinJS || window.App) && application.navigator.isStandardNavigation())
                    self.LoadSiteData();          	
			}

			self.appBarManipulation = function () {
			    var AppBarContainer = document.getElementById("AppBarContainer"),
                    appBarElement = document.getElementById("AppBar"),
			        listViewElement = document.getElementById("sitesListView");

                if(appBarElement)
                    var appBar = appBarElement.winControl;

                if(listViewElement)
                    var listView = listViewElement.winControl;

                if (appBar && listView && listView.selection)
                {
                    if (listView.selection.count() > 0)
                    {
                        if (appBar.showCommands && appBar.show)
                        {
                            appBar.showCommands(AppBarContainer.querySelectorAll('.siteSelection'));
                            appBar.sticky = true;
                            appBar.show();
                        }
                    }

                    else
                    {
                        if (appBar.hideCommands && appBar.hide)
                        {
                            appBar.hide();
                            appBar.hideCommands(AppBarContainer.querySelectorAll('.siteSelection'));
                            appBar.sticky = false;
                        }
                    }
                }
			}
            
            self.longPress = function (e) {
                var selection = window.WinJS && !config.isQunit ? self.siteDataSource()[e.srcElement.winControl.selection.getIndices()] : self.getSelectionFrom(e);
				
                if (e)
                {
                    if (e.preventDefault && !window.WinJS && !config.isQunit)
                        e.preventDefault();

                    else if (window.WinJS && !config.isQunit)
                        self.appBarManipulation();
                }
				
                self.isHold = true;
                
                if (selection !== self.selectedSite())
                    self.setSelectedSite(selection);
            }
            
            self.setSelectedSite = function (selection, event, suppressNavbar) {
				if (event)
					event.stopImmediatePropagation();
				
                if(self.selectedSite() === selection)
                    self.selectedSite(null);
                else
                    self.selectedSite(selection);
                                
				self.hasHighlightedSite(self.selectedSite() != null);				
				self.navBarVisible(self.selectedSite() != null && !suppressNavbar);
            }
            
            self.isSelectedSite = function (item) {
				return self.hasHighlightedSite() && self.selectedSite() === item;
            }
            
            self.siteClick = function (e) {             
                var selection = window.WinJS && !config.isQunit ? self.siteDataSource()[e.detail.itemIndex] : self.getSelectionFrom(e);
				
				if(selection)
                {
                    self.setSelectedSite(selection, null, true);
    				
                    if(self.selectedSite() !== selection)
                        self.selectedSite(selection);
                    
                    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"site": self.selectedSite()}));
                }
                
                self.isHold = false;
            }
			
			self.getSelectionFrom = function (e) {
				return (!self.isHold && e && e.event && e.event.currentTarget) ? 
						ko.dataFor(e.event.currentTarget) : 
						null;
			}
            
			self.addSite = function () {
			    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.configureSitePage, window.WinJS ? null : navigationPage.homePage));

			    if (window.WinJS && !config.isQunit && self.selectedSite() === null)
			        (ko.dataFor(document.body)).hideBars();

			    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.configureSitePage, window.WinJS ? null : navigationPage.homePage));
            }
            
            self.editSite = function () {
                if(self.selectedSite())
                {
                    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.configureSitePage, window.WinJS ? null : navigationPage.homePage, {"site": self.selectedSite()}));         
                }
            }
            
            self.deleteSite = function () {
                if(self.selectedSite())
                {                   
                    var removeSitePromise = SiteDataCachingService.RemoveSiteAsync(self.selectedSite());
                    
					removeSitePromise.done(function () {
						application.showToast(application.strings.DeleteSiteSuccess);
                    });
					
                    removeSitePromise.fail(function (error) {
                        if (error.response === application.strings.InvalidSite) {
                            application.showToast(application.strings.InvalidSite);
                        }
                        else {
                            application.showToast(application.strings.DeleteSiteFailed);
                        }
                    });
					  
                    removeSitePromise.always(function (result) {
                        self.LoadSiteData();
                        
                        self.setSelectedSite(null);
                    });            
                }
            }
            
            self.closeModalViewDelete = function (e, event) {
                if(event && event.currentTarget && event.currentTarget.innerText === application.strings.Yes)
                    self.deleteSite();    
                
                $("#modalview-delete").kendoMobileModalView("close");
            }
			
			self.closePopover = function () {
				var popover = $("#homeViewMenu").data("kendoMobilePopOver");
				
				if (popover)
					popover.close();
            }
            
            self.emailSupport = function () {
				logger.logVerbose("emailSupport clicked");
				
				self.isEmailSelected(true);

				setTimeout(function () {
					self.isEmailSelected(false);
                }, selectionTimeout);
				
				
				if (!emailComposer) {
					logger.logError("Email composer not found in plugin collection");
					self.setMessage(application.strings.EmailCouldNotBeLaunched);
				}
				else {
					emailComposer.showEmailComposer(null, null, Constants.emailFeedbackSubject, "", 
													[Constants.supportEmailAddress], [], [], Constants.emailIsHtml, []);
                }
				
				self.closePopover();
			}
			
			self.onViewLogsClicked = function () {
				
				logger.logVerbose("onViewLogsClicked");
				
				self.isViewLogsSelected(true);

				setTimeout(function () {					
					self.isViewLogsSelected(false);
                }, selectionTimeout);
				
				application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.logsPage, navigationPage.homePage));
				self.closePopover();
			}
            
            return self;
        };
        
        return homeViewModel;
    });
