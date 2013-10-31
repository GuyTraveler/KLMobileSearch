define(["jquery",
        "domain/result",
        "domain/search",
        "domain/searchType",
        "services/imaging/imagingDetectionService",
        "services/imaging/facetQuerySearchService",
        "extensions"], 
    function ($, result, search, searchType, ImagingDetectionService, facetQuerySearchService) {
    
    var serverSavedSearchesService = function () {
        var self = this;
        
        self.facetSearchAsync = function (site, klaml) {  
            var dfd = $.Deferred(),            
                service = new facetQuerySearchService(site),
				facetSearchPromise = service.FacetSearch(klaml);
            
            facetSearchPromise.done(function (result) {
                if(result && result.FacetSearchResult && result.FacetSearchResult.Data)
                    dfd.resolve(self.parseSearchResults(result.FacetSearchResult.Data));
                else
                    dfd.reject("Failed to retrieve search results.");
            });
          
            facetSearchPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                dfd.reject(XMLHttpRequest, textStatus, errorThrown);
            });            
            
            return dfd.promise();
        }
        
        self.loadServerSavedSearchesAsync = function (site) {
            // detect if imaging search is installed
            var dfd = $.Deferred();
            
            var detectPromise = ImagingDetectionService.detectAsync(site);
            
            detectPromise.done(function (result) {
                var service = new facetQuerySearchService(site),
					getCurrentUserNamePromise = service.GetCurrentUserName();
            
                getCurrentUserNamePromise.done(function (currentUserName) {
                    if(currentUserName && currentUserName.GetCurrentUserNameResult && currentUserName.GetCurrentUserNameResult.value)
                    {
                        var getQueryUserPromise = service.GetQueryUser(currentUserName.GetCurrentUserNameResult.value);
                        
                        getQueryUserPromise.done(function (queryUser) {
                            if(queryUser && queryUser.GetQueryUserResult && queryUser.GetQueryUserResult.Name && queryUser.GetQueryUserResult.Name.value)
                            {
                                var getQueriesForUserPromise = service.GetQueriesForUser(queryUser.GetQueryUserResult.Name.value, site.url);
                                
                                getQueriesForUserPromise.done(function (queryResults) {
                                    if(queryResults && queryResults.GetQueriesForUserResult)
                                    {
                                        dfd.resolve(self.parseQueryResults(site.url, queryResults.GetQueriesForUserResult));
                                    }
                                    
                                    else
                                        dfd.reject("Failed to retrieve queries.");
                                });
                              
                                getQueriesForUserPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                                });
                            }
                            
                            else
                                dfd.reject("Failed to retrieve query user.");
                        });
                                          
                        getQueryUserPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                            dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                        });
                    }
                    
                    else
                        dfd.reject("Failed to retrieve current user name.");
                });
              
                getCurrentUserNamePromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    dfd.reject(XMLHttpRequest, textStatus, errorThrown);
                });
            });
          
            detectPromise.fail(function (error) {
                dfd.reject("Imaging search not activated.");
            });
            
            return dfd.promise();
        }
        
        self.parseQueryResults = function (url, queryResults) {
            var results = [];
            
            if(queryResults)
            {
                for (prop in queryResults) 
                {					
					if (typeof queryResults[prop] === 'object' && prop.startsWith("Query"))
                    {
                        var serverSearch = new search(url, queryResults[prop].Title.value, searchType.server, queryResults[prop].Klaml.value);
                    
                        results.push(serverSearch);
                    }                    
                }
            }
            
            return results;
        }
        
        self.parseSearchResults = function (searchResults) {
            var results = [],
                pathProperty = "Path",
                titleProperty = "Title";
                        
            if(searchResults)
            {
                for (FacetResultItem in searchResults) 
                {
                    if (typeof searchResults[FacetResultItem] === 'object')
                    {
                        var parsedResult,                    
    					    metadata = self.buildResultMetadata(searchResults[FacetResultItem].Values);                    
                        
                        if(!metadata[titleProperty])
                            metadata[titleProperty] = self.convertPathToTitle(metadata[pathProperty]);
                        
                        parsedResult = new result(metadata[pathProperty], metadata);                        
                        
                        results.push(parsedResult);     
                    }
                }
            }
            
            return results;
        }
        
        self.buildResultMetadata = function (FacetResultItemValues) {
            var json = {},
                titleProperty = "Title",
                titleTextProperty = "TitleText";
            
            if(FacetResultItemValues)
            {
                for(keyValuePair in FacetResultItemValues)
                {
                    if (typeof FacetResultItemValues[keyValuePair] === 'object')
                    {
                        if(FacetResultItemValues[keyValuePair].Key.value === titleTextProperty)
                            json[titleProperty] = FacetResultItemValues[keyValuePair].Value.value;
                        
                        else
                            json[FacetResultItemValues[keyValuePair].Key.value] = FacetResultItemValues[keyValuePair].Value.value;
                    }
                }
            }
            
            return json;
        }
        
        self.convertPathToTitle = function (path) {
            var title = "";
            
            if(path)
            {
                var urlComponents = path.split("/");
                
                if(urlComponents)
                {
                    var lastComponent = urlComponents[urlComponents.length-1];                    
                    var titleComponents = lastComponent.split(".");
                    
                    title = titleComponents[0];
                }
            }
            
            return title;
        }
    };
    
    return serverSavedSearchesService;
});