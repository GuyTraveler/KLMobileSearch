define(["jquery", 
		"application",
		"logger",
		"keyValuePair", 
		"services/soapServiceBase", 
		"extensions"], 
function ($, application, logger, keyValuePair, soapServiceBase) {
    
    var facetQuerySearchService = function (site) {
        var self = this,
            serviceName = "klfacetsearch/facetquerysearch";
       
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName);
        
        self.FacetSearch = function (klaml) {
            var parameters = [
				new keyValuePair("klquery", klaml.encodeXMLWithoutQuotes()),
                new keyValuePair("languageName", navigator.language)
			];
			
			logger.logVerbose("Querying FacetQueryService with klaml: " + klaml);
			
			return self.executeSoapMethodAsync("FacetSearch", parameters);
        }
        
        self.GetProperties = function () {
            return self.executeSoapMethodAsync("GetProperties");
        }
        
		self.GetQueriesForUser = function (user, url) {
			var parameters = [
				new keyValuePair("user", user),
                new keyValuePair("requestUrl", url)
			];
			
			return self.executeSoapMethodAsync("GetQueriesForUser", parameters);
        }
        
        self.GetQueryUser = function (userSid) {
			var parameters = [
				new keyValuePair("userSid", userSid)
			];
			
			return self.executeSoapMethodAsync("GetQueryUser", parameters);
        }
        
        self.GetCurrentUserName = function () {			
			return self.executeSoapMethodAsync("GetCurrentUserName");
        }
        
        self.GetImagingVersion = function () {			
			return self.executeSoapMethodAsync("GetImagingVersion");
        }
        
        return self;
    };
    
    return facetQuerySearchService;
});