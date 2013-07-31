define(["jquery", "domain/soapParameter", "services/sharepoint/soapServiceBase"], function ($, soapParameter, soapServiceBase) {
    
    var authenticationService = function (siteUrl) {
        var self = this,
            serviceName = "Authentication";
      
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.Mode = function (webUrl, successCallback, failCallback) {
            self.executeSoapMethod("Mode", null, successCallback, failCallback);
        }
        
        return self;
    };
    
    return authenticationService;
});