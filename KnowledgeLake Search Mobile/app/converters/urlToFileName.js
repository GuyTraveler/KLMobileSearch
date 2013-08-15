define([], function () {
    var urlToFileNameConverter = function() {
        var self = this, 
            defaultFileName = "";
       
        self.convert = function (url) {
            var urlComponents = url.split("/");
            
            if(urlComponents)
            {
                return urlComponents[urlComponents.length-1];
            }
            
            return defaultFileName; 
        };        
       
        return self;
    };
    
    return new urlToFileNameConverter();
});