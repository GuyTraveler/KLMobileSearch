define(["jquery", "system", "framework/Constants", "extensions"],
        function ($, system, Constants) {
        
		var klamlBuilderService = function () {
			var self = this,
                masterQueryTemplate = "<KLQuery><Query><Where>{whereClause}</Where><OrderBy/><Select><Field displayName=\"Title\" type=\"Text\" /><Field displayName=\"LastModifiedTime\" type=\"DateTime\" /></Select></Query><Results><MaxRows num=\"5000\" /><Duplicates trim=\"True\"/><PageSize num=\"20\" /></Results></KLQuery>",
                masterContentWhereTemplate = "<Content wordConjunction=\"And\" conjunction=\"And\"><![CDATA[{keyword}]]></Content>",
                masterMetaDataWhereTemplate = "<Field id=\"\" displayName=\"{displayName}\" type=\"{type}\" operator=\"{operator}\" condition=\"{condition}\" conjunction=\"{conjunction}\"/>",
                defaultQueryTemplate = "<KLQuery><Query><Where>{whereClause}</Where><OrderBy /><Select><Field displayName=\"Title\" type=\"Text\" /><Field displayName=\"LastModifiedTime\" type=\"DateTime\" /></Select></Query><Results><MaxRows num=\"5000\" /><Duplicates trim=\"True\" /><PageSize num=\"20\" /></Results></KLQuery>",
                IsDocument = "<Field id=\"\" displayName=\"IsDocument\" type=\"YesNo\" operator=\"eq\" condition=\"1\" conjunction=\"And\"/>";
        
            self.buildKlamlQueryFromServerSavedQuery = function (keyword, searchProperties) {
                var query,
                    whereClause = ""; 
                
                if(keyword && keyword !== "")
                {
                    var keywordClause = masterContentWhereTemplate;
                    
                    whereClause += keywordClause.replace("{keyword}", keyword);
                }                
                
                if(searchProperties)
                {
                    query = masterQueryTemplate; 
                    
                    if(self.appendIsDocument(searchProperties))
                    {
                        whereClause += IsDocument;
                    }
                    
                    var searchPropertiesLength = searchProperties.length;
                    
                    for(var i = 0; i < searchPropertiesLength; i++)
                    {
                        whereClause += self.buildFieldFromSearchProperty(searchProperties[i]);
                    }
                }
                
                else
                {
                    query = defaultQueryTemplate;
                    whereClause += IsDocument;
                }
                
                return query.replace("{whereClause}", whereClause);
            }     
            
            self.buildFieldFromSearchProperty = function (searchProperty) {
                var field = masterMetaDataWhereTemplate;
                                
                // field.replace("{id}", searchProperty.id);
                field = field.replace("{displayName}", searchProperty.name); // change to searchProperty.selectedProperty() later?
                field = field.replace("{type}", searchProperty.dataType);
                field = field.replace("{operator}", self.GetKlamlOperator(searchProperty.selectedOperator()));
                field = field.replace("{condition}", searchProperty.value());
                field = field.replace("{conjunction}", (searchProperty.conjunction()).parseBoolToConjunction());
                
                return field;
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
                if (operatorToken == Constants.Contains)
                    return "contains";
    
                if (operatorToken == Constants.StartsWith)
                    return "beginswith";
    
                if (operatorToken == Constants.Like)
                    return "Like";
    
                if (operatorToken == Constants.IsNotNull)
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
                        return string.Empty;
                }
            }
			
			return self;
        };
		
		return klamlBuilderService;
    });
