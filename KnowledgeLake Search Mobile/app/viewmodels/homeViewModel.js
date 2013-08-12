define(["knockout", "system", "services/siteDataCachingService", "jquery"], 
    function (ko, system, SiteDataCachingService, $) {
        var homeViewModel = function () {
            var self = this;

            self.siteDataSource = new kendo.data.DataSource({data: 
                            [{"credential":{"domain":"dev","credentialType":0,"password":"password","userName":"ryan.braun"},"title":"title","url":"http://prodsp2013.dev.local"}]});
            
            self.LoadSiteData = function () {
                if(window.AppLoaded)
                {
                    if (SiteDataCachingService.sites)
                    {
                        //self.siteDataSource.data(SiteDataCachingService.sites);
                    }
                    
                    else 
                    {
                        var loadSitesPromise = SiteDataCachingService.LoadSites();
                      
                        loadSitesPromise.done(function (result) {
                            if (SiteDataCachingService.sites) 
                            {
                                //self.siteDataSource.data(SiteDataCachingService.sites);
                                //self.siteDataSource.read();
                                
                                console.log("sites: " + JSON.stringify(SiteDataCachingService.sites));
                                //console.log("siteDataSource: " + self.siteDataSource.data()[0].url);
                                console.log("Stringified: " + JSON.stringify(self.siteDataSource.data()));
                            }
                            else
                                window.App.navigate("#configureSite");
                        });
                      
                        loadSitesPromise.fail(function (result) {
                            if (result) {
                                window.App.navigate("#configureSite");
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
                    {
                       self.LoadSiteData();
                    }
                });
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("homeViewModel beforeShow");
                
                //self.LoadSiteData();
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
            
            self.navigate = function(e) {
                system.logVerbose("site list view item tapped");                
            }
            
            self.swipe = function(e) {
                var div = $(e.touch.currentTarget);
                
                if(e.direction == "left")
                {
                    kendo.fx(div.find(".keywordSearch").css("display", "block")).tile("left", div.find(".site")).play();       
                }
                else if(e.direction == "right")
                {
                    $.when( kendo.fx(div.find(".keywordSearch")).tile("left", div.find(".site")).reverse()).then( function () {
                        div.find(".keywordSearch").hide();
                    });
                }
            }
            
            return self;
        };
        
        return homeViewModel;
    });