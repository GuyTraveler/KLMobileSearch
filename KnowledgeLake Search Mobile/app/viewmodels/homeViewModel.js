define(["knockout", "system", "services/siteDataCachingService"], 
    function (ko, system, SiteDataCachingService) {
        var homeViewModel = function () {
            var self = this;
            
            self.TestMessage = ko.observable("Homegg");            
            self.siteDataSource = null; 
            
            self.init = function (e) {
                system.logVerbose("homeViewModel init");
                
                window.AppLoaded.subscribe(function (updatedValue) {
                    if(updatedValue)
                    {
                        if(!SiteDataCachingService.sites)
                        {
                            var loadSitesPromise = SiteDataCachingService.LoadSites();
                    
                            loadSitesPromise.done(function (result) {
                                if(SiteDataCachingService.sites)
                                    self.siteDataSource = SiteDataCachingService.sites;
                                else
                                    window.App.navigate("#configureSite");
                                // somewhere wire up kendolistview data source
                            });
                            
                            loadSitesPromise.fail(function (result) {
                                if(result)
                                {
                                    window.App.navigate("#configureSite");
                                }
                                else
                                {
                                    // critical error reading site data                                    
                                    // recovery options? modal dialog?
                                }
                            });
                        }
                    
                        // possibly add logic to remove subscription
                   }
                });
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("homeViewModel beforeShow");
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
            
            return self;
        };
        
        return homeViewModel;
    });