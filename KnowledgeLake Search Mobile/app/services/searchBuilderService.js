define(["jquery",
        "system",
        "knockout",
        "framework/Constants",
        "factory/logonServiceFactory",
        "services/searchParsingService",
        "services/imaging/facetQuerySearchService",
        "domain/searchProperty",
        "domain/catalogPropertyControlType",
        "ntlm",
        "extensions"],
        function ($, system, ko, Constants, LogonServiceFactory, searchParsingService, facetQuerySearchService, searchProperty, catalogPropertyControlType, ntlm) {
        
		var searchBuilderService = function () {
			var self = this;
        
            self.buildSearchDataSourceAsync = function (site, search) {
                var dfd = $.Deferred(),
                    parsingService = new searchParsingService();               
               
                var klamlSearchFieldProperties = parsingService.getSearchFieldPropertiesFromKlaml(search.query);
                
                if(klamlSearchFieldProperties)
                {
                    var buildSearchPropertiesPromise = self.buildSearchPropertiesAsync(site, search.siteUrl, klamlSearchFieldProperties);
                    
                    buildSearchPropertiesPromise.done(function (result) {
                        dfd.resolve(result);
                    });
                    
                    buildSearchPropertiesPromise.fail(function (error) {                                 
                        dfd.reject(error);
                    });
                }
                
                return dfd.promise();
            }
            
            self.buildSearchPropertiesAsync = function (site, siteUrl, klamlSearchFieldProperties) {  
                var dfd = $.Deferred(),
                    logonService, 
                    facetService = new facetQuerySearchService(siteUrl);                
                
                logonService = LogonServiceFactory.createLogonService(service.serviceUrl, site.credential.credentialType);

                logonPromise = logonService.logonAsync(site.credential.domain, 
                                                       site.credential.userName, 
                                                       site.credential.password,
                                                       service.serviceUrl);
                
                var getPropertiesPromise = facetService.GetProperties();
                
                getPropertiesPromise.done(function (result) {
                    dfd.resolve(self.mapKlamlSearchFieldPropertiesToSearchProperties(klamlSearchFieldProperties, result));
                });
                
                getPropertiesPromise.fail(function (error) {                                 
                    dfd.reject(error);
                });
                
                return dfd.promise();
            }
            
            self.mapKlamlSearchFieldPropertiesToSearchProperties = function (klamlSearchFieldProperties, properties) {
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
                        
                        var klamlSearchFieldPropertiesLength = klamlSearchFieldProperties.length;
                        
                        for(var i = 0; i < klamlSearchFieldPropertiesLength; i++)
                        {
                            if(klamlSearchFieldProperties[i].name === property.name)
                            {
                                property.value(klamlSearchFieldProperties[i].condition);
                                property.selectedOperator(klamlSearchFieldProperties[i].operator);
                                property.conjunction(klamlSearchFieldProperties[i].conjunction);
                                
                                searchProperties.push(property);
                                break;
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
