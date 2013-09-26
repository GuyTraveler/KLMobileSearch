define(["knockout", "system", "services/keywordValidationService", "services/searchBuilderService", "services/klamlBuilderService"], 
    function (ko, system, ValidationService, searchBuilderService, klamlBuilderService) {
        var searchBuilderViewModel = function () {
            var self = this,
                resultsUrl = "#results";
            
            self.search = ko.observable("");
            self.klaml = null;
            
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
                self.propertiesList = null;
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
                    // failed to load search properties
                });
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("searchBuilderViewModel beforeShow");      
                
                if(!self.klaml || savedSearchViewModel.selectedSearch.title !== self.search().title)
                {                                    
                    self.keyword("");
                    self.searchBuilderDataSource([]);
                    self.klaml = null;
                            
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
                var service = klamlBuilderService();
                
                var klaml = service.buildKlamlQueryFromServerSavedQuery(self.keyword(), self.searchBuilderDataSource(), self.search().query);
                
                if(klaml)  
                {
                    self.klaml = klaml;
                    
                    window.App.navigate(resultsUrl);
                }
              
                else {
                    // failed to build klaml
                }   
            }
            
            self.onSearchKeyUp = function (selection, event) {
				if (event.keyCode === 13)
					self.executeSearch();
            }
		
    		self.afterShow = function (e) {
    			var tabstrip = e.view.footer.find(".km-tabstrip").data("kendoMobileTabStrip");
    				
    			system.logVerbose("resultsViewModel afterShow");
    			
    			//tabstrip.clear();
            }
            
			self.clearKeyword = function () {
				system.logVerbose("clearing keyword");
				self.keyword("");
				
				$("#keywordInput").focus();
				system.showSoftKeyboard();
			}
            
            /*self.addProperty = function () {
                
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
