define(["jquery", 
		"keyValuePair", 
		"services/soapServiceBase",
		"ISecureHttpService"], 
	function ($, keyValuePair, soapServiceBase, SecureHttpService) {
    
    var websService = function (site) {
        var self = this,
            serviceName = "Webs";
    
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName, SecureHttpService);
        
        self.GetWeb = function (webUrl) {
            if (arguments[0] && arguments[0].endsWith("/"))
                arguments[0] = arguments[0].substring(0, arguments[0].length - 1);
			
            return self.executeSoapMethodAsync(arguments);
        }
        
        self.GetActivatedFeatures = function () {            
            return self.executeSoapMethodAsync(arguments);
        }
        
        return self;
    };
    
    return websService;
});
