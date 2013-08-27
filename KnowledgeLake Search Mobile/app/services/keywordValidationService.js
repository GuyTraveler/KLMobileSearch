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
       
        return self;
    };
    
    return new keywordValidationService();
});