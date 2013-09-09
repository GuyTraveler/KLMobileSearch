define(["knockout", "system", "services/searchDataCachingService", 'services/keywordValidationService', "services/imaging/serverSavedSearchesService"], 
    function (ko, system, SearchDataCachingService, ValidationService, serverSavedSearchesService) {
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
                var service = new serverSavedSearchesService();
                
                var loadServerSavedSearchesPromise = service.loadServerSavedSearches(self.site());
              
                loadServerSavedSearchesPromise.done(function (result) {   
                    self.SetDataSource(result);
                });
              
                loadServerSavedSearchesPromise.fail(function (error) {
                    // failed to load and parse server saved searches
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