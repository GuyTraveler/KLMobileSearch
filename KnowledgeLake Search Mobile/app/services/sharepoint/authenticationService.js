define(["logger",
		"keyValuePair",
		"services/soapServiceBase",
		"HttpService"], 
	function (logger, keyValuePair, soapServiceBase, HttpService) {
    
    var authenticationService = function (site) {
        var self = this,
            serviceName = "Authentication";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName, HttpService);
        
        self.Mode = function (webUrl) {
            logger.logVerbose("authenticationService.Mode called");
            return self.executeSoapMethodAsync(arguments);
        }
		
		self.Login = function (userName, password) {
			logger.logVerbose("authenticationService.Login called");
			return self.executeSoapMethodAsync(arguments);
        }
        
        return self;
    };
    
    return authenticationService;
});