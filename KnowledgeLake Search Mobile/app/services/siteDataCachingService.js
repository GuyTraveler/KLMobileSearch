define(["jquery", 
        "FileManagement",  
        "domain/promiseResponse/promiseResolveResponse", 
        "domain/promiseResponse/promiseRejectResponse", 
        "domain/promiseResponse/cachingServiceResponse", 
        "domain/promiseResponse/fileSystemResponse"], 
        function ($, File, PromiseResolveResponse, PromiseRejectResponse, CachingServiceResponse, FileSystemResponse) {
    var service = function () {
        var self = this, 
            siteDataFileName = "sites.dat";
        
        self.sites = null;
        
        self.LoadSites = function () {
            var dfd = $.Deferred();
            
            var existsPromise = File.Exists(siteDataFileName);
                
            existsPromise.done(function (result) {
                if(result.response === FileSystemResponse.FileFound)
                {
                    var readPromise = File.Read(siteDataFileName);
                    
                    readPromise.done(function (result) {
                        self.sites = JSON.parse(result.response);
                        dfd.resolve(new PromiseResolveResponse(self.sites)); 
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
            
            return dfd.promise();
        }
        
		self.AddSite = function (site) {
            var dfd = $.Deferred();
            
            if(self.sites)
            {            
				if(!self.SiteExists(site.url))
                {
                    self.sites.push(site);                    
					self.WriteSiteData(dfd);
				}
                else
                {
                    dfd.reject(new PromiseRejectResponse(CachingServiceResponse.SiteConnectionExists, null));
                }
            }
            else
            {
                self.sites = [];
                
                self.sites.push(site);                
                self.WriteSiteData(dfd);                
            }
            
            return dfd.promise();
		}
        
        self.UpdateSite = function (site) {
            var dfd = $.Deferred();
            
            if(self.sites)
            {
				if(self.SiteExists(site.url))
                {
                    var siteIndex = self.IndexOfSite(site.url);
                    
                    if(siteIndex !== -1)
                    {                       
                        self.sites[siteIndex].title = site.title;
                        self.sites[siteIndex].majorVersion = site.majorVersion;
                        self.sites[siteIndex].credential = site.credential;
					    
                        self.WriteSiteData(dfd);
                    }
                    
                    else
                        dfd.reject(new PromiseRejectResponse(CachingServiceResponse.InvalidSite, null));               
				}
                else
                {
                    dfd.reject(new PromiseRejectResponse(CachingServiceResponse.InvalidSite, null));
                }
            }
            else
            {
                self.sites = [];
                
                self.sites.push(site);                
                self.WriteSiteData(dfd);                
            }
            
            return dfd.promise();            
        }
        
        self.RemoveSite = function (site) {
            var dfd = $.Deferred(); 
            
            if(self.sites)
            {
                if(self.SiteExists(site.url))
                {
                    self.RemoveSiteData(site.url);
                    self.WriteSiteData(dfd);
                }
                else
                    dfd.reject(new PromiseRejectResponse(CachingServiceResponse.InvalidSite, null));
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(CachingServiceResponse.SiteDataEmpty, null));
            }
            
            return dfd.promise();
        }
        
        self.SiteExists = function (url) {
            if(self.sites)
            {
                var filtered = $(self.sites).filter(function () {
                    return this.url === url;
                });
                
                if(filtered.length > 0)
                {
                    return true;
                }         
            }
            
            return false;
        }
        
        self.IndexOfSite = function (url) {
            if(self.sites)
            {
                for(var i = 0; i < self.sites.length; i++)
                {
                    if(self.sites[i].url === url)
                        return i;
                }
            }
            
            return -1; 
        }
  
		self.WriteSiteData = function (dfd) {
			var writePromise = File.Write(siteDataFileName, self.sites);
                  
			writePromise.done(function (result) {
				dfd.resolve(result);
			});
			writePromise.fail(function (error) {
				dfd.reject(error);
			});
		}
        
        self.RemoveSiteData = function (url) {
            for(var i = 0; i < self.sites.length; i++)
            {
            	if (self.sites[i].url === url) 
                {
                    self.sites.splice(i, 1);
                }
            }
        }
    }

    return new service(); 
});