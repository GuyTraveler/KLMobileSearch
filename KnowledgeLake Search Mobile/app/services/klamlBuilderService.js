define(["jquery", "system"],
        function ($, system) {
        
		var klamlBuilderService = function () {
			var self = this;
        
            self.buildKlamlQueryFromServerSavedQuery = function (keyword, searchProperties, query) {
                // mash in conditions and keyword
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
