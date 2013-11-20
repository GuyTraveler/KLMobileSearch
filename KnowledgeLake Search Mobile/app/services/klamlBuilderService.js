define(["jquery", 
        "knockout",
		"application", 
        "domain/searchProperty",
		"domain/keywordConjunction",
        "domain/catalogPropertyControlType",
		"domain/Constants",
        "services/dateTimeConverter",
        "knockoutMapping", 
		"extensions"],
        function ($, ko, application, searchProperty, keywordConjunction, catalogPropertyControlType, Constants, DateTimeConverter, mapping) {
        
		var klamlBuilderService = function () {
			var self = this,
                masterQueryTemplate = "<KLQuery><Query><Where>{whereClause}</Where><OrderBy/><Select><Field displayName=\"Title\" type=\"Text\" /><Field displayName=\"LastModifiedTime\" type=\"DateTime\" /></Select></Query><Results><MaxRows num=\"100\" /><Duplicates trim=\"True\"/><PageSize num=\"20\" /></Results></KLQuery>",
                masterContentWhereTemplate = "<Content wordConjunction=\"{conjunction}\" conjunction=\"{conjunction}\"><![CDATA[{keyword}]]></Content>",
                masterMetaDataWhereTemplate = "<Field id=\"{id}\" displayName=\"{displayName}\" type=\"{type}\" operator=\"{operator}\" condition=\"{condition}\" conjunction=\"{conjunction}\"/>",
                defaultQueryTemplate = "<KLQuery><Query><Where>{whereClause}</Where><OrderBy /><Select><Field displayName=\"Title\" type=\"Text\" /><Field displayName=\"LastModifiedTime\" type=\"DateTime\" /></Select></Query><Results><MaxRows num=\"100\" /><Duplicates trim=\"True\" /><PageSize num=\"20\" /></Results></KLQuery>",
                IsDocument = "<Field id=\"\" displayName=\"IsDocument\" type=\"YesNo\" operator=\"eq\" condition=\"1\" conjunction=\"And\"/>";
        
            self.buildKlamlQueryFromServerSavedQuery = function (keyword, searchProperties, conjunction) {
                var query,
                    whereClause = ""; 
				
				if (!conjunction)
					conjunction = keywordConjunction.defaultConjunction;
                
                if (keyword)
                {
                    var keywordClause = masterContentWhereTemplate;
                    
					keywordClause = keywordClause.replace(/{keyword}/g, keyword);
					keywordClause = keywordClause.replace(/{conjunction}/g, conjunction);
					
                    whereClause += keywordClause;
                }                
                
                if (searchProperties)
                {
                    query = masterQueryTemplate; 
                    
                    if(self.appendIsDocument(searchProperties))
                    {
                        whereClause += IsDocument;
                    }
                    
                    self.refineKlamlProperties(searchProperties);
                    
                    var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                        if(!ko.unwrap(searchProperties[i].hidden) && ((searchProperties[i].value() && searchProperties[i].value() !== "") || searchProperties[i].selectedOperator() === application.strings.IsNotNull))
                            whereClause += self.buildFieldFromSearchProperty(searchProperties[i]);
                    }
                }
                
                else
                {
                    query = defaultQueryTemplate;
                    whereClause += IsDocument;
                }
                
                return query.replace(/{whereClause}/g, whereClause);
            }  
            
            self.refineKlamlProperties = function (searchProperties)
            {
                if(searchProperties)
                {                    
                    for(var i = searchProperties.length - 1; i >= 0; i--)
                    {
                        if(ko.unwrap(searchProperties[i].controlType) === catalogPropertyControlType.Calendar)
                        {
                            if(searchProperties[i].selectedOperator() === application.strings.Range)
                            {
                                searchProperties = self.duplicateKlamlProperty(searchProperties, i);
                                
                                var klamlDateTimesRange = DateTimeConverter.convertToKlamlDateTimeRange(searchProperties[i].value(), searchProperties[i+1].value());
                                         
                                searchProperties[i].value(klamlDateTimesRange.startDate);
                                searchProperties[i+1].value(klamlDateTimesRange.endDate);
                            }
                            
                            else if(searchProperties[i].selectedOperator() === Constants.equalOperator)
                            {
                                searchProperties = self.duplicateKlamlProperty(searchProperties, i);
                                
                                var klamlDateTimesEqual = DateTimeConverter.convertToKlamlDateTimeEqual(searchProperties[i].value()); 
                                
                                searchProperties[i].value(klamlDateTimesEqual.startDate);
                                searchProperties[i+1].value(klamlDateTimesEqual.endDate);
                            }
                            
                            else if(searchProperties[i].selectedOperator() === Constants.greaterThanOperator ||
                                    searchProperties[i].selectedOperator() === Constants.lessThanOrEqualOperator)
                            {
                                searchProperties[i].value(DateTimeConverter.convertToKlamlDateTimeDayEnd(searchProperties[i].value()));
                            }
                            
                            else if(searchProperties[i].selectedOperator() === Constants.greaterThanOrEqualOperator)
                            {                                
                                searchProperties[i].value(DateTimeConverter.convertToKlamlDateTimePreviousDay(searchProperties[i].value()));
                            }
                            
                            else
                            {
                                searchProperties[i].value(DateTimeConverter.convertToKlamlDateTime(searchProperties[i].value()));
                            }
                        }
                        else if (ko.unwrap(searchProperties[i].controlType) === catalogPropertyControlType.RadioButton)
                        {
                            var numericValue;

                            if (searchProperties[i].value() == Constants.radiobuttonValues[0]) { //Yes
                                numericValue = "1";
                            }
                            else if (searchProperties[i].value() == Constants.radiobuttonValues[1]) {  //No
                                numericValue = "0";
                            }
                            else {   //Not Set
                                numericValue = "";
                            }

                            searchProperties[i].value(numericValue);
                        }
                        else if (ko.unwrap(searchProperties[i].controlType) === catalogPropertyControlType.Number &&
                                 searchProperties[i].selectedOperator() === application.strings.Range)
                        {
                            searchProperties = self.duplicateKlamlProperty(searchProperties, i);
                        }
                    }
                }
                
                return searchProperties;
            }
            
            self.duplicateKlamlProperty = function(searchProperties, index) {
                if(searchProperties && !isNaN(index) && index >= 0)
                {
                    var modifiedProperty = new searchProperty();
                            
                    mapping.fromJS(searchProperties[index], {}, modifiedProperty);                            
                    
                    searchProperties[index].selectedOperator(Constants.greaterThanOrEqualOperator);
                    modifiedProperty.selectedOperator(Constants.lessThanOrEqualOperator);                            
                    modifiedProperty.value(modifiedProperty.secondaryValue());
                    
                    searchProperties.splice(index + 1, 0, modifiedProperty);
                }
                
                return searchProperties;
            }
            
            self.buildFieldFromSearchProperty = function (searchProperty) {

                if (searchProperty || (ko.unwrap(searchProperty.controlType) === catalogPropertyControlType.RadioButton && searchProperty.value()))
                {
                    var field = masterMetaDataWhereTemplate;
                                    
					field = field.replace(/{id}/g, ko.unwrap(searchProperty.id));
                    field = field.replace(/{displayName}/g, ko.unwrap(searchProperty.name)); // change to searchProperty.selectedProperty() later?
                    field = field.replace(/{type}/g, ko.unwrap(searchProperty.dataType));
					
                    field = field.replace(/{operator}/g, self.GetKlamlOperator(searchProperty.selectedOperator()));
                    field = field.replace(/{condition}/g, searchProperty.value());
                    field = field.replace(/{conjunction}/g, searchProperty.conjunction());
                    
                    return field;
                }                
                return "";
            }
            
            self.appendIsDocument = function(searchProperties) {
                if(searchProperties)
                {
                    var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                        if(searchProperties[i].name === Constants.IsDocument)
                            return false;
                    }
                }
                
                return true;
            }
            
            self.GetKlamlOperator = function(operatorToken)
            {
                if (operatorToken == application.strings.Contains)
                    return "contains";
    
                if (operatorToken == application.strings.StartsWith)
                    return "beginswith";
    
                if (operatorToken == application.strings.Like)
                    return "Like";
    
                if (operatorToken == application.strings.IsNotNull)
                    return "isnotnull";
    
                switch (operatorToken)
                {
                    case "=":
                        return "eq";
                    case "<":
                        return "lt";
                    case "<=":
                        return "leq";
                    case ">":
                        return "gt";
                    case ">=":
                        return "geq";
                    default:
                        return "";
                }
            }
			
			return self;
        };
		
		return klamlBuilderService;
    });
