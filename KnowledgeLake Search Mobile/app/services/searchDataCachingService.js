define(["jquery", 
        "FileManagement",  
		"system",
        "domain/promiseResponse/promiseResolveResponse", 
        "domain/promiseResponse/promiseRejectResponse"], 
        function ($, File, system, PromiseResolveResponse, PromiseRejectResponse) {
    var service = function () {
        var self = this, 
            searchDataFileName = "searches.dat";
        
        self.localSearches = null;
        
        self.LoadSearchesAsync = function (site) {
            var dfd = $.Deferred(),
                results = [], 
                promiseReadyToComplete = false;
            
            if(self.localSearches)
            {
                results.concat(self.getSearchesByURL(site.url));
                promiseReadyToComplete = true; 
            }
            
            else
            {
                var existsPromise = File.ExistsAsync(searchDataFileName);
                    
                existsPromise.done(function (result) {
                    if(result.response === system.strings.FileFound)
                    {
                        var readPromise = File.ReadAsync(searchDataFileName);
                        
                        readPromise.done(function (result) {
                            self.localSearches = JSON.parse(result.response);
                            
                            if(promiseReadyToComplete)
                            {
                                dfd.resolve(new PromiseResolveResponse(results.concat(self.getSearchesByURL(site.url)))); 
                            }
                            
                            else
                            {
                                results.concat(self.getSearchesByURL(site.url));
                                promiseReadyToComplete = true; 
                            }
                        });
                        
                        readPromise.fail(function (error) {
                            dfd.reject(error);
                        });
                    }
                    else
                        dfd.reject(result);
                });
                
                existsPromise.fail(function (error) {                                 
                    // critical error 
                    dfd.reject(error);
                });
            }
            
            // call get saved searches using site information
            // be sure to set search type to server
            
            return dfd.promise();
        }
        
		self.AddSearchAsync = function (site) {
            var dfd = $.Deferred();
            
            if(self.localSearches && Object.prototype.toString.call(self.localSearches) === '[object Array]')
            {            
				if(!self.SearchExists(site.url))
                {
                    self.localSearches.push(site);
					self.WriteSearchData(dfd);
				}
                else
                {
                    dfd.reject(new PromiseRejectResponse(system.strings.SiteConnectionExists, null));
                }
            }
            else
            {
                self.localSearches = [];
                
                self.localSearches.push(site);                
                self.WriteSearchData(dfd);                
            }
            
            return dfd.promise();
		}
        
        self.UpdateSearchAsync = function (site) {
            var dfd = $.Deferred();
            
            if(self.localSearches && Object.prototype.toString.call(self.localSearches) === '[object Array]')
            {
				if(self.SearchExists(site.url))
                {
                    var searchIndex = self.IndexOfSearch(site.url);
                    
                    if(searchIndex !== -1)
                    {                       
                        self.localSearches[siteIndex].title = site.title;
                        self.localSearches[siteIndex].majorVersion = site.majorVersion;
                        self.localSearches[siteIndex].credential = site.credential;
					    
                        self.WriteSearchData(dfd);
                    }
                    
                    else
                        dfd.reject(new PromiseRejectResponse(system.strings.InvalidSite, null));               
				}
                else
                {
                    dfd.reject(new PromiseRejectResponse(system.strings.InvalidSite, null));
                }
            }
            else
            {
                self.localSearches = [];
                
                self.localSearches.push(site);                
                self.WriteSearchData(dfd);                
            }
            
            return dfd.promise();            
        }
        
        self.RemoveSearchAsync = function (site) {
            var dfd = $.Deferred(); 
            
            if(self.localSearches && Object.prototype.toString.call(self.localSearches) === '[object Array]')
            {
                if(self.SearchExists(site.url))
                {
                    self.RemoveSearchData(site.url);
                    self.WriteSearchData(dfd);
                }
                else
                    dfd.reject(new PromiseRejectResponse(system.strings.InvalidSite, null));
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(system.strings.SiteDataEmpty, null));
            }
            
            return dfd.promise();
        }
        
        self.getSearchesByURL = function (url) {
            return self.filterSearches(url);
        }     
        
        self.SearchExists = function (url) {            
            var filtered = self.filterSearches(url);
            
            if(filtered.length > 0)
            {
                return true;
            }
            
            return false;
        }
        
        self.filterSearches = function (url) {
            if(self.sites && Object.prototype.toString.call(self.sites) === '[object Array]')
            {
                var filtered = $(self.sites).filter(function () {
                    return this.url === url;
                });
                
                return filtered;
            }
            
            return [];
        }
        
        self.IndexOfSearch = function (url) {
            if(self.localSearches && Object.prototype.toString.call(self.localSearches) === '[object Array]')
            {
                var localSearchesLength = self.localSearches.length;
                
                for(var i = 0; i < localSearchesLength; i++)
                {
                    if(self.localSearches[i].url === url)
                        return i;
                }
            }
            
            return -1; 
        }
  
		self.WriteSearchData = function (dfd) {			
            var data = JSON.stringify(self.localSearches),
			    writePromise = File.WriteAsync(searchDataFileName, data);
            
			writePromise.done(function (result) {
				dfd.resolve(result);
			});
			writePromise.fail(function (error) {
				dfd.reject(error);
			});
		}
        
        self.RemoveSearchData = function (url) {
            var localSearchesLength = self.localSearches.length;
            
            for(var i = 0; i < localSearchesLength; i++)
            {
            	if (self.localSearches[i].url === url) 
                {
                    self.localSearches.splice(i, 1);
                }
            }
        }
    }

    return new service(); 
});