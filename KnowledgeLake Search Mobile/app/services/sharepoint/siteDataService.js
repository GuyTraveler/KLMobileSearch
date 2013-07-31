define(["jquery", "domain/soapParameter", "services/sharepoint/soapServiceBase"], function ($, soapParameter, soapServiceBase) {
    
    var siteDataService = function (siteUrl) {
        var self = this,
            serviceName = "SiteData";
       
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.GetSiteUrl = function (url, successCallback, failCallback) {
            var parameters = [
                new soapParameter("Url", url)
            ];
            
            self.executeSoapMethod("GetSiteUrl", parameters, successCallback, failCallback);
        }
        
        return self;
    };
    
    return siteDataService;
});