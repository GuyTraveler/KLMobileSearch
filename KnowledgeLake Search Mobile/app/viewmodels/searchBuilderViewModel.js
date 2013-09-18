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
                    
                    for(var i = 0; i < searchProperties.length; i++)
                    {
                       searchProperties[i].selectedProperty.subscribeChanged(self.propertyChanged);
                    }
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
            
            self.propertyChanged = function (newSelection, oldSelection) {     
                self.updateSearchProperty(self.searchBuilderDataSource()[self.getIndexOfSelectionByName(self.searchBuilderDataSource(), oldSelection)],
                                            self.propertiesList[self.getIndexOfSelectionByName(self.propertiesList, newSelection)]);
                
                //self.SetDataSource(self.searchBuilderDataSource());
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
            
            self.executeSearch = function (e) {

            }
            
            self.onSearchKeyUp = function (selection, event) {
				if (event.keyCode === 13)
					self.search(selection);
            }
            
            self.addProperty = function () {
                
            }
            
            self.getIndexOfSelectionByName = function(array, selection) {
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
            };
            
            return self;
        };
        
        return searchBuilderViewModel;
    });