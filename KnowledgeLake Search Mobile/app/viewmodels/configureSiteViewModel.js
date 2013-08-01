define(["knockout", "system", "services/siteDataCachingService"], 
    function (ko, system, SiteDataCachingService) {
        var configureSiteViewModel = function () {
            var self = this,
                defaultUrlText = "http://",
                homeUrl = "#home";
                 
            
            self.url = ko.observable(defaultUrlText);
            
            self.saveSiteSettings = function () {
                system.logVerbose("save site settings");        
                
                var addSitePromise = SiteDataCachingService.AddSite(new site(self.url(), new credential("type", "userName", "password", "domain")));
                
                addSitePromise.done(function (result) {          
                    window.App.navigate(homeUrl);
                    // after navigate possibly on show update the listview datasource to the latest SiteDataCachingService.sites
                });
                
                addSitePromise.fail(function (result) {
                    if(result)
                    {
                        // throw site connection already exists
                    }
                    else
                    {
                        // critical error writing new site data                                   
                        // recovery options? modal dialog?
                    }
                });
            }
            
            self.closeSiteSettings = function () {
                system.logVerbose("closing site settings");                
                window.App.navigate(homeUrl);
            }
            
            self.validateSiteUrl = function () {
                system.logVerbose("validateSiteUrl called");
            }            
            
            self.init = function (e) {
                system.logVerbose("configureSiteViewModel init");
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("configureSiteViewModel beforeShow");
            }
            
            self.show = function (e) {
                system.logVerbose("configureSiteViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("configureSiteViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("configureSiteViewModel hide");
            } 
   
            return self;
        };
        
        return configureSiteViewModel;
    });