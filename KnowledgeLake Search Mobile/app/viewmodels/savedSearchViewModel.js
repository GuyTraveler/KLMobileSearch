define(["knockout", "system", 'services/keywordValidationService', "services/imaging/serverSavedSearchesService"], 
    function (ko, system, ValidationService, serverSavedSearchesService) {
        var savedSearchViewModel = function () {
            var self = this,
                searchBuilderUrl = "#searchBuilder",
                resultsUrl = "#results";            
            
            self.searchDataSource = ko.observableArray(null);
            
            self.selectedSearch = null;
            self.site = ko.observable("");          
            self.keyword = ko.observable("");
            
            self.isKeywordValid = ko.computed(function () {
                return ValidationService.validateKeyword(self.keyword());
            });
            
            self.SetDataSource = function (searches) {
                self.searchDataSource([]);
                
                if(searches)
                {
                    self.searchDataSource(searches);
                }
            }
            
            self.LoadSearchData = function () {
                var service = new serverSavedSearchesService();
                
                var loadServerSavedSearchesPromise = service.loadServerSavedSearchesAsync(self.site());
              
                loadServerSavedSearchesPromise.done(function (result) {   
                    self.SetDataSource(result);
                });
              
                loadServerSavedSearchesPromise.fail(function (error) {
                    // failed to load and parse server saved searches
                });            
            }
			
			self.clearKeyword = function () {
				system.logVerbose("clearing keyword");
				self.keyword("");
				
				$("#keywordInput").focus();
				system.showSoftKeyboard();
			}
            
            self.init = function (e) {
                system.logVerbose("savedSearchViewModel init");
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("savedSearchViewModel beforeShow");
                
                self.searchDataSource([]);
                
                if(homeViewModel.selectedSite)
                {                    
                    if(homeViewModel.selectedSite.url !== self.site().url)
                    {                        
                        self.site(homeViewModel.selectedSite);
                        
                        self.keyword("");
                        self.selectedSearch = null;
                    }
                    
                    self.LoadSearchData();
                }
            }
            
            self.show = function (e) {
                system.logVerbose("savedSearchViewModel show");
            }
            
            self.afterShow = function (e) {
                var tabstrip = e.view.footer.find(".km-tabstrip").data("kendoMobileTabStrip");
				
				system.logVerbose("savedSearchViewModel afterShow");
				
				//tabstrip.clear();
            }
            
            self.hide = function (e) {
                system.logVerbose("savedSearchViewModel hide");
            }
            
            self.setSelectedSearch = function (selection, event) {
				if (event)
					event.stopImmediatePropagation();
				
                if(self.selectedSearch === selection)
                    self.selectedSearch = null;
                else
                    self.selectedSearch = selection;
                
                //self.navBarVisible(self.selectedSite);
            }
            
            self.isSelectedSearch = function (item) {
                if(item && self.selectedSearch)
                {
                    return item.title == self.selectedSearch.title;
                }
                
				return false;
            }
            
            self.searchClick = function (selection) {
				self.setSelectedSearch(selection, null);
				
                if(self.selectedSearch !== selection)
                    self.selectedSearch = selection;
                
                window.App.navigate(searchBuilderUrl);              
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
