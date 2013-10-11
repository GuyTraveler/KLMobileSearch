define(["jquery", 
		"application",
		"logger",
		"keyValuePair",
		"services/soapServiceBase"], 
	function ($, application, logger, keyValuePair, soapServiceBase) {
    
    var authenticationService = function (siteUrl) {
        var self = this,
            serviceName = "Authentication";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.Mode = function (webUrl) {
			logger.logVerbose("authenticationService.Mode called");
            return self.executeSoapMethodAsync("Mode", null);
        }
		
		self.Login = function (userName, password) {
			var parms = [
				new keyValuePair("userName", userName),
				new keyValuePair("password", password)
			];
			
			logger.logVerbose("authenticationService.Login called");
			return self.executeSoapMethodAsync("Login", parms);
        }
        
        return self;
    };
    
    return authenticationService;
});