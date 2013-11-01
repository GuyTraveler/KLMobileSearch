define(["jquery", 
		"keyValuePair", 
		"services/soapServiceBase",
		"ISecureHttpService"], 
function ($, keyValuePair, soapServiceBase, SecureHttpService) {
    
    var siteDataService = function (site) {
        var self = this,
            serviceName = "SiteData";
     
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName, SecureHttpService);
        
        self.GetSiteUrlAsync = function (url) {
            var parameters = [
                new keyValuePair("Url", encodeURI(url))
            ];
            
            return self.executeSoapMethodAsync("GetSiteUrl", parameters);
        }
		
		self.GetURLSegmentsAsync = function (strURL) {
			var parameters = [
					new keyValuePair("strURL", strURL)
				],
				dfd = $.Deferred(),
				promise = self.executeSoapMethodAsync("GetURLSegments", parameters);
			
			promise.done(function (result) {
				if (!result || !result.GetURLSegmentsResult || !result.GetURLSegmentsResult.value || result.GetURLSegmentsResult.value == "false") {
					dfd.reject(null, "Unknown error", null);					
                }
				else {
					dfd.resolve(result);
                }
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				dfd.reject(XMLHttpRequest, textStatus, errorThrown);
            });
			
			return dfd.promise();
        }
        
        return self;
    };
    
    return siteDataService;
});