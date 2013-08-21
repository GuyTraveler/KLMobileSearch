define(["jquery", "domain/keyValuePair", "services/sharepoint/soapServiceBase"], function ($, keyValuePair, soapServiceBase) {
    
    var listsService = function (siteUrl) {
        var self = this,
            serviceName = "Lists";
       
        self.prototype = Object.create(soapServiceBase.prototype);
        soapServiceBase.call(self, siteUrl, serviceName);
        
        self.GetListItems = function (listName, viewName, query, viewFields, rowLimit, queryOptions, webID, successCallback, failCallback) {
            var parameters = [
                new keyValuePair("listName", listName),
				new keyValuePair("viewName", viewName),
				new keyValuePair("query", query),
				new keyValuePair("viewFields", viewFields),
				new keyValuePair("rowLimit", rowLimit),
				new keyValuePair("queryOptions", queryOptions),
				new keyValuePair("webID", webID)
            ];
            
            self.executeSoapMethod("GetListItems", parameters, successCallback, failCallback);
        }
        
        return self;
    };
    
    return listsService;
});