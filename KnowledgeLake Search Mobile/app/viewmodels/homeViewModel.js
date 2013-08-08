define(["knockout", "system", "services/siteDataCachingService", "jquery"], 
    function (ko, system, SiteDataCachingService, $) {
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
                                {                            
                                    self.siteDataSource = new kendo.data.DataSource.create({data: SiteDataCachingService.sites});                            
    
                                    $("#listView").kendoMobileListView({
                                        dataSource: self.siteDataSource,
                                        template: $("#sitesListViewTemplate").html()
                                    })
                                    .kendoTouch({
                                        filter: ">li",
                                        enableSwipe: true,
                                        tap: self.navigate,
                                        swipe: self.swipe
                                    });
                                }
                                else
                                    window.App.navigate("#configureSite");
                            });
                            
                            loadSitesPromise.fail(function (result) {
                                if(result)
                                {
                                    console.log("sites.dat does not exist"); 
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
                
                if(SiteDataCachingService.sites)
                {
                    self.siteDataSource = new kendo.data.DataSource.create({data: SiteDataCachingService.sites});
                }
                
                else
                {
                    var loadSitesPromise = SiteDataCachingService.LoadSites();
                    
                    loadSitesPromise.done(function (result) {
                        if(SiteDataCachingService.sites)
                        {
                            self.siteDataSource = new kendo.data.DataSource.create({data: SiteDataCachingService.sites});
                        }
                        else
                        {
                            console.log("no site data populated");
                            window.App.navigate("#configureSite");
                        }
                    });
                    
/*                    loadSitesPromise.fail(function (result) {
                        if(result)
                        {
                            console.log("sites.dat does not exist");
                            window.App.navigate("#configureSite");
                        }
                        else
                        {
                            // critical error reading site data                                    
                            // recovery options? modal dialog?
                        }
                    }); */                   
                }                
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