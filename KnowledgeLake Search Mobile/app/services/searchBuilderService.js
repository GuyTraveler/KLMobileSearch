define(["jquery", "system", "knockout", "framework/Constants", "services/searchParsingService", "services/imaging/facetQuerySearchService", "domain/searchProperty", "domain/catalogPropertyControlType", "ntlm", "extensions"],
        function ($, system, ko, Constants, searchParsingService, facetQuerySearchService, searchProperty, catalogPropertyControlType, ntlm) {
        
		var searchBuilderService = function () {
			var self = this;
        
            self.buildSearchDataSourceAsync = function (site, search) {
                var dfd = $.Deferred(),
                    parsingService = new searchParsingService();               
               
                var klamlSearchProperties = parsingService.getSearchFieldPropertiesFromKlaml(search.query);
                
                if(klamlSearchProperties)
                {
                    var buildSearchPropertiesPromise = self.buildSearchPropertiesAsync(site, search.siteUrl, klamlSearchProperties);
                    
                    buildSearchPropertiesPromise.done(function (result) {
                        dfd.resolve(result);
                    });
                    
                    buildSearchPropertiesPromise.fail(function (error) {                                 
                        dfd.reject(error);
                    });
                }
                
                return dfd.promise();
            }
            
            self.buildSearchPropertiesAsync = function (site, siteUrl, klamlSearchProperties) {  
                var dfd = $.Deferred(),
                    facetService = new facetQuerySearchService(siteUrl);
                
                ntlm.setCredentials(site.credential.domain, site.credential.userName, site.credential.password);
                ntlm.authenticate(service.serviceUrl);
                
                var getPropertiesService = facetService.GetProperties();
                
                getPropertiesService.done(function (result) {
                    dfd.resolve(self.mapKlamlSearchPropertiesToSearchProperties(klamlSearchProperties, result));
                });
                
                getPropertiesService.fail(function (error) {                                 
                    dfd.reject(error);
                });
                
                return dfd.promise();
            }
            
            self.mapKlamlSearchPropertiesToSearchProperties = function (klamlSearchProperties, properties) {
                var choicesText = "Choices", 
                    controlTypeText = "ControlType",
                    dataTypeText = "DataType",
                    descriptionText = "Description",
                    hiddenText = "Hidden",
                    idText = "ID",
                    nameText = "Name";
                
                var propertiesList = [], 
                    propertiesName = [],
                    searchProperties = [],
                    searchBuilderResult = {};
                
                
                for (ArrayOfCatalogPropertyBase in properties) 
                {                  
					if (typeof properties[ArrayOfCatalogPropertyBase] === 'object') 
                    {                        
                        var choices = [],
                            controlType = self.convertToControlType(properties[ArrayOfCatalogPropertyBase][controlTypeText].value);
                        
                        if(controlType !== catalogPropertyControlType.RadioButton)
                        {                        
                            for (Choices in properties[ArrayOfCatalogPropertyBase][choicesText])
                            {
                                if (typeof properties[ArrayOfCatalogPropertyBase][choicesText][Choices] === 'object') 
                                {
                                    choices.push(properties[ArrayOfCatalogPropertyBase][choicesText][Choices].value);
                                }
                            }
                        }
                        
                        else
                            choices = Constants.radiobuttonValues;
                        
                        var property = new searchProperty(choices,
                                                          controlType,
                                                          (properties[ArrayOfCatalogPropertyBase][hiddenText].value).parseBool(),
                                                          properties[ArrayOfCatalogPropertyBase][descriptionText].value,
                                                          properties[ArrayOfCatalogPropertyBase][dataTypeText].value,
                                                          properties[ArrayOfCatalogPropertyBase][nameText].value,
                                                          properties[ArrayOfCatalogPropertyBase][idText].value,
                                                          self.getSearchOperatorsForControlType(controlType));
                        
                        propertiesList.push(property);
                        propertiesName.push(property.name);
                        
                        for(var i = 0; i < klamlSearchProperties.length; i++)
                        {
                            if(klamlSearchProperties[i].name === property.name)
                            {
                                property.value(klamlSearchProperties[i].condition);
                                property.selectedOperator(klamlSearchProperties[i].operator);
                                property.conjunction(klamlSearchProperties[i].conjunction);
                                
                                searchProperties.push(property);
                            }
                        }
                    }                    
                }
                
                searchBuilderResult.propertiesList = propertiesList;
                searchBuilderResult.propertiesName = propertiesName;
                searchBuilderResult.searchProperties = searchProperties;
                
                return searchBuilderResult;
            }
            
            self.convertToControlType = function (property) {
                switch(property.toUpperCase())
                {
                    case "NUMBER":
                        return catalogPropertyControlType.Number;
                    case "TEXTBOX":
                        return catalogPropertyControlType.TextBox;
                    case "DROPDOWN":
                        return catalogPropertyControlType.DropDown;
                    case "CALENDAR":
                        return catalogPropertyControlType.Calendar;
                    case "RADIOBUTTON":
                        return catalogPropertyControlType.RadioButton;
                    case "COMBOBOX":
                        return catalogPropertyControlType.ComboBox;
                    
                    default:
                        return catalogPropertyControlType.TextBox;
                }
            }
            
            self.getSearchOperatorsForControlType = function (controlType) {                
                switch(controlType)
                {
                    case catalogPropertyControlType.Number:
                        return Constants.numberOperators;
                    case catalogPropertyControlType.TextBox:
                        return Constants.textboxOperators;
                    case catalogPropertyControlType.DropDown:
                        return Constants.dropdownOperators;
                    case catalogPropertyControlType.Calendar:
                        return Constants.calendarOperators;
                    case catalogPropertyControlType.RadioButton:
                        return Constants.radiobuttonOperators;
                    case catalogPropertyControlType.ComboBox:
                        return Constants.comboboxOperators;
                    
                    default:
                        return Constants.textboxOperators;            
                }                
            }           
			
			return self;
        };
		
		return searchBuilderService;
    });
