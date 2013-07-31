define(["jquery", "domain/soapParameter", "services/sharepoint/soapServiceBase"], function ($, soapParameter, soapServiceBase) {
    
    var websService = function (siteUrl) {
        var self = this,
            serviceName = "Webs";     
    
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.GetWeb = function (webUrl, successCallback, failCallback) {
            var parameters = [
                new soapParameter("webUrl", webUrl)
            ];
            
            self.executeSoapMethod("GetWeb", parameters, successCallback, failCallback);
        }
        
        return self;
    };
    
    return websService;
});