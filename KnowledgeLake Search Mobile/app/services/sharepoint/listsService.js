define(["keyValuePair", 
		"services/soapServiceBase",
		"ISecureHttpService"], 
function (keyValuePair, soapServiceBase, SecureHttpService) {
    
    var listsService = function (site) {
        var self = this,
            serviceName = "Lists";
       
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, site, serviceName, SecureHttpService);
        
        self.GetList = function (listName) {
            return self.executeSoapMethodAsync(arguments);
        }
		
        self.GetListItemsAsync = function (listName, viewName, query, viewFields, rowLimit, queryOptions, webID) {
            return self.executeSoapMethodAsync(arguments);
        }
        
        self.GetListContentTypeAsync = function (listName, contentTypeId) {
            return self.executeSoapMethodAsync(arguments);
        }
        
        self.GetListAndView = function (listName, viewName) {
            return self.executeSoapMethodAsync(arguments);
        }
        
        return self;
    };
    
    return listsService;
});
