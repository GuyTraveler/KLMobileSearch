define(["knockout", 
        "system", 
        "jquery", 
        "ISiteDataCachingService"], 
    function (ko, system, $, SiteDataCachingService) {
        var homeViewModel = function () {
            var self = this, 
                configureSiteUrl = "#configureSite",                
                searchUrl = "#savedSearch";
                       
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
                        var loadSitesPromise = SiteDataCachingService.LoadSitesAsync();
                      
                        loadSitesPromise.done(function (result) {
                            if (result.response && Object.prototype.toString.call(result.response) === '[object Array]' && result.response.length > 0)
                                self.SetDataSource(result.response);
                            
                            else
                                window.App.navigate(configureSiteUrl);
                        });
                      
                        loadSitesPromise.fail(function (error) {
                            if (error.response === system.strings.FileNotFound) {
                                window.App.navigate(configureSiteUrl);
                            }
                            else {
                                self.SetDataSource();
								system.showToast(system.strings.siteLoadError);
                            }
                        });
                    }
                }
            }
            
            self.init = function (e) {
                system.logVerbose("homeViewModel init");
                
                window.AppLoaded.subscribe(function (updatedValue) {
                    if(updatedValue)
                        self.LoadSiteData();
                });
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("homeViewModel beforeShow");                                 
            }
            
            self.show = function (e) {
                system.logVerbose("homeViewModel show");
				
				if(window.App)
                    self.LoadSiteData();             
            }
            
            self.afterShow = function (e) {
                system.logVerbose("homeViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("homeViewModel hide");
                
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
                      
                    removeSitePromise.done(function (result) {
                        self.LoadSiteData();
                        
                        self.setSelectedSite(null);
                    });
                  
                    removeSitePromise.fail(function (error) {
                        if (error.response === system.strings.InvalidSite) {
                            // site does not exist
                        }
                        else {
                            // critical error removing site data
                            // recovery options? modal dialog?
                        }
                    });
                }
            }
            
            return self;
        };
        
        return homeViewModel;
    });