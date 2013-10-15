define(["knockout", 
        "application", 
		"logger",
        "jquery", 
		"viewmodels/viewModelBase",
        "ISiteDataCachingService"], 
    function (ko, application, logger, $, viewModelBase, SiteDataCachingService) {
        var homeViewModel = function () {
            var self = this, 
                configureSiteUrl = "#configureSite",                
                searchUrl = "#savedSearch",
				baseShow;
                       
			self.prototype = Object.create(viewModelBase.prototype);
        	viewModelBase.call(self);
			
			baseShow = self.show;
			
            self.siteDataSource = ko.observableArray([]);
            
            self.selectedSite = null;
            self.navBarVisible = ko.observable(false);
			self.hasHighlightedSite = ko.observable(false);
            
            self.navBarVisible.subscribe(function (newValue) {
				$(".nav-button").kendoMobileButton();
            });
            
            self.SetDataSource = function (sites) {
                self.selectedSite = null;                
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
                            
                            else
                                window.App.navigate(configureSiteUrl);
                        });
                      
                        loadSitesPromise.fail(function (error) {
							self.isBusy(false);
							
                            if (error.response === application.strings.FileNotFound) {
                                window.App.navigate(configureSiteUrl);
                            }
                            else {
                                self.SetDataSource();
								application.showToast(application.strings.siteLoadError);
                            }
                        });
                    }
                }
            }
            
            self.init = function (e) {
				logger.logVerbose("homeViewModel.init");
				
                window.AppLoaded.subscribe(function (updatedValue) {
                    if(updatedValue)
                        self.LoadSiteData();
                });
            }
            
            self.beforeShow = function (e) {
				logger.logVerbose("homeViewModel beforeShow");                                 
            }
           
			self.afterShow = function (e) {
				logger.logVerbose("homeViewModel.afterShow");
				
				if(window.App)
                    self.LoadSiteData();          	
            }
            
            self.hide = function (e) {
                logger.logVerbose("homeViewModel hide");
                
                self.navBarVisible(false);
				self.hasHighlightedSite(false);
            }
            
            self.setSelectedSite = function (selection, event, suppressNavbar) {
				if (event)
					event.stopImmediatePropagation();
				
                if(self.selectedSite === selection)
                    self.selectedSite = null;
                else
                    self.selectedSite = selection;
                                
				self.hasHighlightedSite(self.selectedSite != null);				
				self.navBarVisible(self.selectedSite != null && !suppressNavbar);
            }
            
            self.isSelectedSite = function (item) {
				return self.hasHighlightedSite() && self.selectedSite === item;
            }
            
            self.siteClick = function (selection) {
				self.setSelectedSite(selection, null, true);
				
                if(self.selectedSite !== selection)
                    self.selectedSite = selection;
                
                window.App.navigate(searchUrl);              
            }
            
            self.addSite = function () {
                window.App.navigate(configureSiteUrl);
            }
            
            self.editSite = function () {
                if(self.selectedSite)
                {
                    window.App.navigate(configureSiteUrl);                    
                }
            }
            
            self.deleteSite = function () {
                if(self.selectedSite)
                {
                    // prompt before removal if yes proceed with deletion
                    var removeSitePromise = SiteDataCachingService.RemoveSiteAsync(self.selectedSite);
                    // add the removal of associated searches ... must perform a loadsearches 
                    
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
            
            return self;
        };
        
        return homeViewModel;
    });