define(["jquery", "domain/keyValuePair", "services/sharepoint/soapServiceBase"], function ($, keyValuePair, soapServiceBase) {
    
    var siteDataService = function (siteUrl) {
        var self = this,
            serviceName = "SiteData";
       
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.GetSiteUrl = function (url, successCallback, failCallback) {
            var parameters = [
                new keyValuePair("Url", url)
            ];
            
            self.executeSoapMethod("GetSiteUrl", parameters, successCallback, failCallback);
        }
        
        return self;
    };
    
    return siteDataService;
});