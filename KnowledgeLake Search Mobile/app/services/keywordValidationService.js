define([], function () {
    var keywordValidationService = function() {
        var self = this;   
       
        self.validate = function (input) {
            var invalidChars = ["!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", 
                                "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "}", "~", "—", "–", "¡", "¦", "|",
                                "¨", "´", "¯", "¸"];
            
            if(input)
            {
                for(var i = 0; i < input.length; i++)
                {
                    if (invalidChars.indexOf(input[i]) === -1)
                        return true;                    
                }
            }
            
            return false;
        };
        
        self.validateKeyword = function (keyword) {
            if(keyword)
            {
                var indexOfSpace = keyword.indexOf(" ");
                
                if(indexOfSpace !== -1 && indexOfSpace !== (keyword.length - 1))
                {
                    var keywords = keyword.split(" ");
                    
                    for(var i = 0; i < keywords.length; i++)
                    {
                        var result = self.validate(keywords[i]);
                        
                        if(!result)
                            return false; 
                    }
                    
                    return true;
                }
                
                else 
                    return self.validate(keyword);
            }
            
            return false;
            
            return true;
        }
       
        return self;
    };
    
    return new keywordValidationService();
});