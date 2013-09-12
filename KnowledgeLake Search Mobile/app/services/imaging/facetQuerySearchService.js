define(["jquery", "domain/keyValuePair", "services/sharepoint/soapServiceBase", "extensions"], function ($, keyValuePair, soapServiceBase) {
    
    var facetQuerySearchService = function (siteUrl) {
        var self = this,
            serviceName = "klfacetsearch/facetquerysearch";
       
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.FacetSearch = function (klaml) {
            var parameters = [
				new keyValuePair("klquery", klaml.encodeXMLWithoutQuotes()),
                new keyValuePair("languageName", navigator.language)
			];
			
			return self.executeSoapMethod("FacetSearch", parameters);
        }
        
        self.GetProperties = function () {
            return self.executeSoapMethod("GetProperties");
        }
        
		self.GetQueriesForUser = function (user, url) {
			var parameters = [
				new keyValuePair("user", user),
                new keyValuePair("requestUrl", url)
			];
			
			return self.executeSoapMethod("GetQueriesForUser", parameters);
        }
        
        self.GetQueryUser = function (userSid) {
			var parameters = [
				new keyValuePair("userSid", userSid)
			];
			
			return self.executeSoapMethod("GetQueryUser", parameters);
        }
        
        self.GetCurrentUserName = function () {			
			return self.executeSoapMethod("GetCurrentUserName");
        }
        
        return self;
    };
    
    return facetQuerySearchService;
});