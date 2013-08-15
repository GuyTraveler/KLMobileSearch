define(["knockout", "system", "services/siteDataCachingService", "jquery"], 
    function (ko, system, SiteDataCachingService, $) {
        var homeViewModel = function () {
            var self = this, 
                configureSiteUrl = "#configureSite";
                       
            self.siteDataSource = ko.observableArray();
            
            self.selectedSite = null;            
            self.navBarVisible = ko.observable(false);
            
            self.SetDataSource = function (sites) {
                if(sites)
                {
                    self.siteDataSource(sites);
                    
                    //TODO: these kendo methods need to be factored out to knockout bindings so 
                    //we don't pollute the viewModels with kendo code lest it will be worthless with regular web apps
                    $(".itemContainer").kendoTouch({
                        enableSwipe: true,
                        swipe: self.swipe 
                    });
                    $(".searchButton").kendoMobileButton();
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
                        var loadSitesPromise = SiteDataCachingService.LoadSites();
                      
                        loadSitesPromise.done(function (result) {
                            if (SiteDataCachingService.sites)
                                self.SetDataSource(SiteDataCachingService.sites);
                            
                            else
                                window.App.navigate(configureSiteUrl);
                        });
                      
                        loadSitesPromise.fail(function (result) {
                            if (result) {
                                window.App.navigate(configureSiteUrl);
                            }
                            else {
                                // critical error reading site data
                                // recovery options? modal dialog?
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
                
                if(window.App)
                    self.LoadSiteData();
            }
            
            self.show = function (e) {
                system.logVerbose("homeViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("homeViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("homeViewModel hide");
            }
            
            self.navigate = function (e) {
                system.logVerbose("site list view item tapped");                
            }
            
            self.swipe = function (e) {
                var div = $(e.touch.currentTarget);
                
                if(e.direction == "left")
                {
                    kendo.fx(div.find(".keywordSearch").css("display", "block")).tile("left", div.find(".site")).play();       
                }
                else if(e.direction == "right")
                {
                    $.when( kendo.fx(div.find(".keywordSearch"))
					             .tile("left", div.find(".site"))
					             .reverse())
					 .then( function () {
                        div.find(".keywordSearch").hide();
                    });
                }
            }
            
            self.setSelectedSite = function (selection) {
                if(self.selectedSite === selection)
                {
                    self.selectedSite = null;
                    self.navBarVisible(false);
                }
                
                else
                {
                    self.selectedSite = selection;
                    self.navBarVisible(true);
                }
            }
            
            self.onAddClick = function () {
                self.selectedSite = null;
                self.navBarVisible(false);
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
                    var removeSitePromise = SiteDataCachingService.RemoveSite(self.selectedSite);
                      
                    removeSitePromise.done(function (result) {
                        self.LoadSiteData(); 
                    });
                  
                    removeSitePromise.fail(function (result) {
                        if (result) {
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