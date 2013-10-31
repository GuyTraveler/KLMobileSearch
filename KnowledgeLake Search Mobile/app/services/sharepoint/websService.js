define(["jquery", 
		"keyValuePair", 
		"services/soapServiceBase",
		"ISecureHttpService",
		//uncaught depends
		"extensions"], 
	function ($, keyValuePair, soapServiceBase, SecureHttpService) {
    
    var websService = function (site) {
        var self = this,
            serviceName = "Webs";
    
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName, SecureHttpService);
        
        self.GetWeb = function (webUrl) {
            var parameters = [];
			
			if (webUrl.endsWith("/"))
				webUrl = webUrl.substring(0, webUrl.length - 1);
			
			parameters.push(new keyValuePair("webUrl", webUrl));
            
            return self.executeSoapMethodAsync("GetWeb", parameters);
        }
        
        self.GetActivatedFeatures = function () {            
            return self.executeSoapMethodAsync("GetActivatedFeatures");
        }
        
        return self;
    };
    
    return websService;
});
