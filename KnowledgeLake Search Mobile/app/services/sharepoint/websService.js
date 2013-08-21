define(["jquery", "domain/keyValuePair", "services/sharepoint/soapServiceBase"], function ($, keyValuePair, soapServiceBase) {
    
    var websService = function (siteUrl) {
        var self = this,
            serviceName = "Webs";
    
        /*self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);*/
		$.extend(self, new soapServiceBase(siteUrl, serviceName));
        
        self.GetWeb = function (webUrl, successCallback, failCallback) {
            var parameters = [];
			
			if (webUrl.endsWith("/"))
				webUrl = webUrl.substring(0, webUrl.length - 1);
			
			parameters.push(new keyValuePair("webUrl", webUrl));
            
            self.executeSoapMethod("GetWeb", parameters, successCallback, failCallback);
        }
        
        return self;
    };
    
    return websService;
});