define(["knockout", "system", "services/searchDataCachingService", 'services/keywordValidationService'], 
    function (ko, system, SearchDataCachingService, ValidationService) {
        var savedSearchViewModel = function () {
            var self = this,
                resultsUrl = "#results";            
            
            self.searchDataSource = ko.observableArray(null);
            
            self.site = ko.observable("");          
            self.keyword = ko.observable("");
            
            self.isKeywordValid = ko.computed(function () {
                return ValidationService.validateKeyword(self.keyword());
            });
            
            self.SetDataSource = function (searches) {
                self.SetDataSource([]);
                
                if(searches)
                {
                    self.searchDataSource(searches);
                }
            }
            
            self.LoadSearchData = function () {
                var loadSitesPromise = SearchDataCachingService.LoadSearches(homeViewModel.selectedSite);
              
                loadSitesPromise.done(function (result) {
                    if (result.response && Object.prototype.toString.call(result.response) === '[object Array]' && result.response.length > 0)
                        self.SetDataSource(result.response);
                });
              
                loadSitesPromise.fail(function (error) {
                    // don't know exactly how this should be handled 
                    // (no saved searches, local search file not found, filesystem instance not initialized)
                });            
            }
            
            self.init = function (e) {
                system.logVerbose("searchViewModel init");
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("searchViewModel beforeShow");
                
                if(homeViewModel.selectedSite)
                {                    
                    if(homeViewModel.selectedSite.url !== self.site().url)
                    {                        
                        self.site(homeViewModel.selectedSite);
                        self.keyword("");
                    }
                    
                    self.LoadSearchData();
                }
            }
            
            self.show = function (e) {
                system.logVerbose("searchViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("searchViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("searchViewModel hide");
            }
            
            self.search = function (e) {
                window.App.navigate(resultsUrl);
            }
            
            self.onSearchKeyUp = function (selection, event) {
				if (event.keyCode === 13)
					self.search(selection);
            }
            
            return self;
        };
        
        return savedSearchViewModel;
    });