define(["jquery", "system", "domain/searchFieldProperty", "framework/Constants"],
        function ($, system, searchFieldProperty, Constants) {
        
		var searchParsingService = function () {
			var self = this;
        
            self.getSearchFieldPropertiesFromKlaml = function (klaml) {
                var klamlSearchFieldProperties = [],
                    nameProperty = "displayName",
                    operatorProperty = "operator",
                    conditionProperty = "condition",
                    conjunctionProperty = "conjunction";
                
                if(klaml)
                {
                    var fields = $(klaml).find("where").find("field");
                    
                    if(fields)
                    {
                        for(var i = 0; i < fields.length; i++)
                        {
                            if(fields[i])
                            {
                                klamlSearchFieldProperties.push(new searchFieldProperty($(fields[i]).attr(nameProperty), 
                                                                                        $(fields[i]).attr(operatorProperty), 
                                                                                        $(fields[i]).attr(conditionProperty), 
                                                                                        $(fields[i]).attr(conjunctionProperty)));
                            }
                        }
                    }
                }
                
                return klamlSearchFieldProperties;
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

            self.GetSearchPropertyOperator = function(operatorToken)
            {
                if (operatorToken === "contains")
                {
                    return Constants.Contains;
                }
    
                if (operatorToken === "beginswith")
                {
                    return Constants.StartsWith;
                }
    
                if (operatorToken === "isnotnull")
                {
                    return Constants.IsNotNull;
                }
    
                switch (operatorToken)
                {
                    case "eq":
                        return "=";
                    case "lt":
                        return "<";
                    case "leq":
                        return "<=";
                    case "gt":
                        return ">";
                    case "geq":
                        return ">=";
                    default:
                        return operatorToken;
                }
            }
			
			return self;
        };
		
		return searchParsingService;
    });
