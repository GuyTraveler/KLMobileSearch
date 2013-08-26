define(["knockout", 
        "system", 
        "jquery", 
        "ISiteDataCachingService", 
        "domain/promiseResponse/fileSystemResponse", 
        "domain/promiseResponse/cachingServiceResponse"], 
    function (ko, system, $, SiteDataCachingService, FileSystemResponse, CachingServiceResponse) {
        var homeViewModel = function () {
            var self = this, 
                configureSiteUrl = "#configureSite",
                resultsUrl = "#results";
                       
            self.siteDataSource = ko.observableArray();
            
            self.selectedSite = null;
            self.navBarVisible = ko.observable(false);
            
            self.navBarVisible.subscribe(function (newValue) {
				$(".nav-button").kendoMobileButton();
            });
            
            self.SetDataSource = function (sites) {
                if(sites)
                {
                    self.siteDataSource([]);
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
                            if (result.response)
                                self.SetDataSource(result.response);
                            
                            else
                                window.App.navigate(configureSiteUrl);
                        });
                      
                        loadSitesPromise.fail(function (error) {
                            if (error.response === FileSystemResponse.FileNotFound) {
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
			
			self.mainGripClick = function (data, event) {
				self.showKeywordSearch(event.currentTarget.parentElement.parentElement);
            }
			
			self.keywordGripClick = function (data, event) {
				self.hideKeywordSearch(event.currentTarget.parentElement.parentElement);
            }
            
            self.swipe = function (e) {
                if(e.direction == "left") {
                    self.showKeywordSearch(e.touch.currentTarget);
                }
                else if(e.direction == "right")
                {
                    self.hideKeywordSearch(e.touch.currentTarget);
                }
            }
			
			self.showKeywordSearch = function (element) {				
				//clear navbar/selection before showing search
				if (self.selectedSite)
					self.setSelectedSite(self.selectedSite);
                
                kendo.fx($(element).find(".keywordSearch").css("display", "block")).tile("left", $(element).find(".site")).play();       	
            }
			
			self.hideKeywordSearch = function (element) {
				$.when( kendo.fx($(element).find(".keywordSearch"))
				             .tile("left", $(element).find(".site"))
				             .reverse())
				 .then( function () {
                    $(element).find(".keywordSearch").hide();
                });
            }
            
            self.setSelectedSite = function (selection) {
                if(self.selectedSite === selection)
                    self.selectedSite = null;
                
                else
                    self.selectedSite = selection;
                
                self.navBarVisible(self.selectedSite);
            }
            
            self.isSelectedSite = function (item) {
				if (self.navBarVisible())
					return (self.selectedSite === item);
                
                return false;
            }
            
            self.onAddClick = function () {
                self.selectedSite = null;
                self.navBarVisible(false);
                window.App.navigate(configureSiteUrl); 
            }
            
            self.search = function (selection) {
                if(self.selectedSite !== selection)
                    self.selectedSite = selection;
                
                window.App.navigate(resultsUrl);              
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
                        
                        self.setSelectedSite(null);
                    });
                  
                    removeSitePromise.fail(function (error) {
                        if (error.response === CachingServiceResponse.InvalidSite) {
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
