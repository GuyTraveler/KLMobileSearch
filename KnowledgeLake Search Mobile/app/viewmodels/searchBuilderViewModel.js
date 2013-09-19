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
            
            self.SetDataSource = function (searchProperties) {
                self.searchBuilderDataSource([]);
                
                if(searchProperties)
                {
                    self.searchBuilderDataSource(searchProperties);
                    
                    /*var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                       searchProperties[i].selectedProperty.subscribeChanged(self.propertyChanged);
                    }*/
                }
            }
            
            self.SetProperties = function (propertiesList, propertiesName) {
                self.propertiesName([]);
                
                if(propertiesList && propertiesName)
                {
                    self.propertiesList = propertiesList;
                    self.propertiesName(propertiesName);
                }                
            }        
            
            self.BuildSearchProperties = function () {
                var builderService = new searchBuilderService();
                
                var buildSearchPromise = builderService.buildSearchDataSourceAsync(savedSearchViewModel.site(), self.search());
                
                buildSearchPromise.done(function (result) {
                    self.SetProperties(result.propertiesList, result.propertiesName);
                    self.SetDataSource(result.searchProperties);
                });
                
                buildSearchPromise.fail(function (error) {                                 
                    dfd.reject(error);
                });
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("searchBuilderViewModel beforeShow");                
                                    
                self.keyword("");
                self.searchBuilderDataSource([]);
                
                if(savedSearchViewModel.selectedSearch)
                {                     
                    self.search(savedSearchViewModel.selectedSearch);
                                        
                    self.BuildSearchProperties();
                }
            }
            
            self.show = function (e) {
                system.logVerbose("searchBuilderViewModel show");
            }
            
            self.hide = function (e) {
                system.logVerbose("searchBuilderViewModel hide");
            }    
            
            self.executeSearch = function (e) {

            }
            
            self.onSearchKeyUp = function (selection, event) {
				if (event.keyCode === 13)
					self.search(selection);
            }
		
    		self.afterShow = function (e) {
    			var tabstrip = e.view.footer.find(".km-tabstrip").data("kendoMobileTabStrip");
    				
    			system.logVerbose("resultsViewModel afterShow");
    			
    			tabstrip.clear();
            }
            
            /*Sself.addProperty = function () {
                
            }
            
            self.propertyChanged = function (newSelection, oldSelection) {     
                self.updateSearchProperty(self.searchBuilderDataSource()[self.getIndexOfSelectionByName(self.searchBuilderDataSource(), oldSelection)],
                                            self.propertiesList[self.getIndexOfSelectionByName(self.propertiesList, newSelection)]);
            }
            
            self.updateSearchProperty = function (oldSearchProperty, newSearchProperty) {
                oldSearchProperty.choices(newSearchProperty.choices());
                oldSearchProperty.controlType = newSearchProperty.controlType;
                oldSearchProperty.hidden = newSearchProperty.hidden;
                oldSearchProperty.description = newSearchProperty.description;
                oldSearchProperty.dataType = newSearchProperty.dataType;
                oldSearchProperty.name = newSearchProperty.name; 
                oldSearchProperty.id = newSearchProperty.id;
                
                oldSearchProperty.conjunction(newSearchProperty.conjunction());
                oldSearchProperty.operators(newSearchProperty.operators());
                oldSearchProperty.selectedOperator(newSearchProperty.selectedOperator());
                oldSearchProperty.selectedProperty(newSearchProperty.selectedProperty());
                oldSearchProperty.value(newSearchProperty.value());
            }
            
            self.getIndexOfSelectionByName = function(array, selection) {
                var arrayLength = array.length;
            
                for(var i = 0; i < array.length; i++)
                {
                    if(array[i].name === selection)
                        return i;
                }
            }
            
            ko.subscribable.fn.subscribeChanged = function(callback) {
                var previousValue;
                
                this.subscribe(function(_previousValue) {
                    previousValue = _previousValue;
                }, undefined, 'beforeChange');
                
                this.subscribe(function(latestValue) {
                    callback(latestValue, previousValue );
                });
            };*/
            
            return self;
        };
        
        return searchBuilderViewModel;
    });