define(["jquery", "domain/keyValuePair", "services/sharepoint/soapServiceBase"], function ($, keyValuePair, soapServiceBase) {
    
    var siteDataService = function (siteUrl) {
        var self = this,
            serviceName = "SiteData";
       
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.GetSiteUrl = function (url) {
            var parameters = [
                new keyValuePair("Url", encodeURI(url))
            ];
            
            return self.executeSoapMethod("GetSiteUrl", parameters);
        }
		
		self.GetURLSegments = function (strURL) {
			var parameters = [
				new keyValuePair("strURL", encodeURI(strURL))
			];
			
			return self.executeSoapMethod("GetURLSegments", parameters);
        }
        
        return self;
    };
    
    return siteDataService;
});