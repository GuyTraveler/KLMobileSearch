define(["knockout", "system", "services/sharepoint/siteDataService", "services/siteDataCachingService"], 
    function (ko, system, siteDataService, SiteDataCachingService) {
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
                var dataService;
                
                system.logVerbose("validateSiteUrl called");
                window.App.showLoading();
                
                dataService = new siteDataService(self.url());
                dataService.GetSiteUrl(self.url(), self.onSiteUrlValidated, self.onSiteUrlFailed);
            }
            
            self.onSiteUrlValidated = function (result) {
                system.logVerbose("site url validation success");
                window.App.hideLoading();
            }
            
            self.onSiteUrlFailed = function (XMLHttpRequest, textStatus, errorThrown) {
                system.logVerbose("site url validation failed");
                window.App.hideLoading();
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