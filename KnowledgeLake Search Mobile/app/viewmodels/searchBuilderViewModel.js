define(["knockout", "system", "services/keywordValidationService", "services/searchBuilderService"], 
    function (ko, system, ValidationService, searchBuilderService) {
        var searchBuilderViewModel = function () {
            var self = this;
            
            self.search = ko.observable("");
            
            self.propertiesList = null;
            self.propertiesName = ko.observableArray();
            self.searchBuilderDataSource = ko.observableArray();
            
            self.keyword = ko.observable("");
            
            self.isKeywordValid = ko.computed(function () {
                return ValidationService.validateKeyword(self.keyword());
            });
            
            self.init = function (e) {
                system.logVerbose("searchViewModel init");
            }
            
            self.SetDataSource = function (searchBuilderData) {
                self.propertiesName([]);
                self.searchBuilderDataSource([]);
                
                if(searchBuilderData)
                {
                    self.propertiesList = searchBuilderData.propertiesList;
                    self.propertiesName(searchBuilderData.propertiesName);
                    self.searchBuilderDataSource(searchBuilderData.searchProperties);
                    
                    for(var i = 0; i < searchBuilderData.searchProperties.length; i++)
                    {
                        searchBuilderData.searchProperties[0].selectedProperty.subscribe(self.propertyChanged);
                    }
                }
            }
            
            self.BuildSearchProperties = function () {
                var builderService = new searchBuilderService();
                
                var buildSearchPromise = builderService.buildSearchDataSourceAsync(savedSearchViewModel.site(), self.search());
                
                buildSearchPromise.done(function (result) {
                    self.SetDataSource(result);
                });
                
                buildSearchPromise.fail(function (error) {                                 
                    dfd.reject(error);
                });
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("searchBuilderViewModel beforeShow");
                
                if(savedSearchViewModel.selectedSearch)
                {                     
                    self.search(savedSearchViewModel.selectedSearch);
                    self.keyword("");                    
                                        
                    self.BuildSearchProperties();
                }
            }
            
            self.show = function (e) {
                system.logVerbose("searchBuilderViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("searchBuilderViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("searchBuilderViewModel hide");
            }
            
            self.propertyChanged = function (newSelection) {
                // map newSelection to both arrays
                // replace searchProperties array index with propertiesList array index
            }
            
            self.keywordSearch = function (e) {
                
            }
            
            self.execute = function (e) {
                
            }
            
            self.onSearchKeyUp = function (selection, event) {
				if (event.keyCode === 13)
					self.search(selection);
            }
            
            return self;
        };
        
        return searchBuilderViewModel;
    });