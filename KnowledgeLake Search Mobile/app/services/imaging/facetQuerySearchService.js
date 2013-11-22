define(["jquery", 
		"application",
		"logger",
		"keyValuePair", 
		"services/soapServiceBase",
		"ISecureHttpService",
		"extensions"], 
function ($, application, logger, keyValuePair, soapServiceBase, SecureHttpService) {
    
    var facetQuerySearchService = function (site) {
        var self = this,
            serviceName = "klfacetsearch/facetquerysearch";
       
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName, SecureHttpService);
        
        self.FacetSearch = function (klquery, languageName) {
            if (arguments[0])
                arguments[0] = klquery.encodeXMLWithoutQuotes();

            Array.prototype.push.call(arguments, navigator.language);
			
            logger.logVerbose("Querying FacetQueryService with klaml: " + klquery);
			
			return self.executeSoapMethodAsync(arguments);
        }
        
        self.GetProperties = function () {
            return self.executeSoapMethodAsync(arguments);
        }
        
		self.GetQueriesForUser = function (user, url) {
			return self.executeSoapMethodAsync(arguments);
        }
        
        self.GetQueryUser = function (userSid) {
			return self.executeSoapMethodAsync(arguments);
        }
        
        self.GetCurrentUserName = function () {			
			return self.executeSoapMethodAsync(arguments);
        }
        
        self.GetImagingVersion = function () {			
			return self.executeSoapMethodAsync(arguments);
        }
        
        return self;
    };
    
    return facetQuerySearchService;
});