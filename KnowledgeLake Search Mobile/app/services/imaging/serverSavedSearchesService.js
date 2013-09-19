define(["jquery",
        "domain/result",
        "domain/search",
        "domain/searchType",
        "factory/logonServiceFactory",
        "services/imaging/imagingDetectionService",
        "services/imaging/facetQuerySearchService",
        "ntlm",
        "extensions"], 
    function ($, result, search, searchType, LogonServiceFactory, ImagingDetectionService, facetQuerySearchService, ntlm) {
    
    var serverSavedSearchesService = function () {
        var self = this;
        
        self.facetSearchAsync = function (search) {  
            var dfd = $.Deferred(),            
                service = new facetQuerySearchService(search.siteUrl);
            
            var facetSearchPromise = service.FacetSearch(search.query);
            
            facetSearchPromise.done(function (result) {
                dfd.resolve(self.parseSearchResults(result.FacetSearchResult.Data)); 
            });
          
            facetSearchPromise.fail(function (error) {
                dfd.reject(error);
            });        
            
            return dfd.promise();
        }
        
        self.loadServerSavedSearchesAsync = function (site) {
            // detect if imaging search is installed
            var dfd = $.Deferred();
            
            var detectPromise = ImagingDetectionService.detectAsync(site);
            
            detectPromise.done(function (result) {
                var service = new facetQuerySearchService(site.url);          
                
                logonService = LogonServiceFactory.createLogonService(service.serviceUrl, site.credential.credentialType);

                logonPromise = logonService.logonAsync(site.credential.domain, 
                                                       site.credential.userName, 
                                                       site.credential.password,
                                                       service.serviceUrl);
                
                var getCurrentUserNamePromise = service.GetCurrentUserName();
                
                getCurrentUserNamePromise.done(function (currentUserName) {
                    var getQueryUserPromise = service.GetQueryUser(currentUserName.GetCurrentUserNameResult.value);
                    
                    getQueryUserPromise.done(function (queryUser) {
                        var getQueriesForUserPromise = service.GetQueriesForUser(queryUser.GetQueryUserResult.Name.value, site.url);
                        
                        getQueriesForUserPromise.done(function (queryResults) {
                            dfd.resolve(self.parseQueryResults(site.url, queryResults.GetQueriesForUserResult)); 
                        });
                      
                        getQueriesForUserPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                            dfd.reject("failed to get queries");
                        }); 
                    });
                  
                    getQueryUserPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                        dfd.reject("failed to get query user");
                    }); 
                });
              
                getCurrentUserNamePromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                    dfd.reject("failed to get current user name");
                });
            });
          
            detectPromise.fail(function (error) {
                dfd.reject("imaging search not activated");
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
                        
                        if(metadata[titleProperty])
                            parsedResult = new result(metadata[titleProperty], metadata);                        
                        
                        else
                            parsedResult = new result(self.convertPathToTitle(metadata[pathProperty]), metadata);
                        
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