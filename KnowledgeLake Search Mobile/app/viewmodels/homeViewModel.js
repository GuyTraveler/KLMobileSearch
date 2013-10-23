define(["knockout", 
        "application", 
		"logger",
        "jquery", 
		"domain/Constants",
        "domain/navigationDirection",
        "domain/navigationPage",
        "domain/navigationContext",
		"viewmodels/viewModelBase",
        "FileManagement",
        "ISiteDataCachingService"], 
    function (ko, application, logger, $, Constants, navigationDirection, navigationPage, navigationContext, viewModelBase, File, SiteDataCachingService) {
        var homeViewModel = function () {
            var self = this,
				selectionTimeout = 1000;
                       
			self.prototype = Object.create(viewModelBase.prototype);
        	viewModelBase.call(self);
			
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
                if(window.AppLoaded && window.AppLoaded() === true)
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
				
                window.AppLoaded.subscribe(function (updatedValue) {
                    if(updatedValue)
                        self.LoadSiteData();
                });
            }
            
            self.onBeforeShow = function (e) {
				logger.logVerbose("homeViewModel onBeforeShow");   
            
                self.navBarVisible(false);
				self.hasHighlightedSite(false);                    
            }
           
			self.onAfterShow = function (e) {
				logger.logVerbose("homeViewModel.afterShow");
				
				if(window.App && application.navigator.isStandardNavigation())
                    self.LoadSiteData();          	
            }
            
            self.longPress = function (e) {
                if(e)
                    e.preventDefault();
                
                self.isHold = true;
                
                if(e && e.event && e.event.currentTarget)
                {
                    var selection = ko.dataFor(e.event.currentTarget);
                         
                    if(selection)
                        self.setSelectedSite(selection);
                }
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
				if(!self.isHold && e && e.event && e.event.currentTarget)
                {
                    var selection = ko.dataFor(e.event.currentTarget);
                    
                    if(selection)
                    {
                        self.setSelectedSite(selection, null, true);
        				
                        if(self.selectedSite() !== selection)
                            self.selectedSite(selection);
                        
                        application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.savedSearchPage, navigationPage.homePage, {"site": self.selectedSite()}));
                    }
                }
                
                self.isHold = false;
            }
            
            self.addSite = function () {
                application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.configureSitePage, navigationPage.homePage));
            }
            
            self.editSite = function () {
                if(self.selectedSite())
                {
                    application.navigator.navigate(new navigationContext(navigationDirection.standard, navigationPage.configureSitePage, navigationPage.homePage, {"site": self.selectedSite()}));         
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
				$("#homeViewMenu").data("kendoMobilePopOver").close();
            }
            
            self.emailSupport = function () {
				logger.logVerbose("emailSupport clicked");
				
				self.isEmailSelected(true);

				setTimeout(function () {
					self.isEmailSelected(false);
                }, selectionTimeout);
				
				window.open("mailto:" + Constants.supportEmailAddress, "_blank");
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
