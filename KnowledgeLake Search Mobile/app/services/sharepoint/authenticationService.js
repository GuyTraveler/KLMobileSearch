define(["jquery", "domain/keyValuePair", "services/sharepoint/soapServiceBase"], function ($, keyValuePair, soapServiceBase) {
    
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