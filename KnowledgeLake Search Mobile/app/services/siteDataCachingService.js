define(["jquery", 
        "FileManagement",  
		"application",
        "domain/site",
        "framework/promiseResponse/promiseResolveResponse", 
        "framework/promiseResponse/promiseRejectResponse",
        "services/encryptionService"], 
        function ($, File, application, site, PromiseResolveResponse, PromiseRejectResponse, EncryptionService) {
    var service = function () {
        var self = this, 
            siteDataFileName = "sites.dat";
        
        self.sites = null;
        
        self.LoadSitesAsync = function () {
            var dfd = $.Deferred();
            
            var existsPromise = File.ExistsAsync(siteDataFileName);
                
            existsPromise.done(function (result) {
                if (result && result.response && (result.response.fileHandle || result.response === application.strings.FileFound))
                {
                    var readPromise = File.ReadAsync(siteDataFileName);
                    
                    readPromise.done(function (result) {
                        var parsedSites = JSON.parse(result.response),
                            sitesLength = parsedSites.length;

                        self.sites = [];

                        for (var i = 0; i < sitesLength; i++)
                            self.sites.push(self.decodePassword(site.prototype.fromJSON(parsedSites[i])))

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
        
		self.AddSiteAsync = function (site) {
            var dfd = $.Deferred();
            
            if(self.sites && Object.prototype.toString.call(self.sites) === '[object Array]')
            {            
				if(!self.SiteExists(site.url))
                {
                    self.sites.push(site);
					self.WriteSiteData(dfd);
				}
                else
                {
                    dfd.reject(new PromiseRejectResponse(application.strings.SiteConnectionExists, null));
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
        
        self.UpdateSiteAsync = function (site) {
            var dfd = $.Deferred();
            
            if(self.sites && Object.prototype.toString.call(self.sites) === '[object Array]')
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
                        dfd.reject(new PromiseRejectResponse(application.strings.InvalidSite, null));               
				}
                else
                {
                    dfd.reject(new PromiseRejectResponse(application.strings.InvalidSite, null));
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
        
        self.RemoveSiteAsync = function (site) {
            var dfd = $.Deferred(); 
            
            if(self.sites && Object.prototype.toString.call(self.sites) === '[object Array]')
            {
                if(self.SiteExists(site.url))
                {
                    self.RemoveSiteData(site.url);
                    self.WriteSiteData(dfd);
                }
                else
                    dfd.reject(new PromiseRejectResponse(application.strings.InvalidSite, null));
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(application.strings.SiteDataEmpty, null));
            }
            
            return dfd.promise();
        }
        
        self.SiteExists = function (url) {
            if(self.sites && Object.prototype.toString.call(self.sites) === '[object Array]')
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
            if(self.sites && Object.prototype.toString.call(self.sites) === '[object Array]')
            {
                var sitesLength = self.sites.length;
                
                for(var i = 0; i < sitesLength; i++)
                {
                    if(self.sites[i].url === url)
                        return i;
                }
            }
            
            return -1; 
        }
        
        self.encodePasswords = function (sites) {
            var encodedSites = [];
            
            if(sites && Object.prototype.toString.call(sites) === '[object Array]')
            {
                var sitesLength = sites.length;
                
                for(var i = 0; i < sitesLength; i++)
                {
                    if(window.btoa)                    
                        sites[i].credential.password = EncryptionService.encrypt(sites[i].credential.password, application.deviceUUID);
                }
                
                encodedSites = sites;
            }
            
            return encodedSites;
        }
        
        self.decodePassword = function (site) {            
            if(site)
            {
                if(window.atob)                    
                    site.credential.password = EncryptionService.decrypt(site.credential.password, application.deviceUUID);                
            }
            
            return site;
        }

        //self.decodePasswords = function (sites) {
        //    var decodedSites = [];

        //    if (sites && Object.prototype.toString.call(sites) === '[object Array]') {
        //        var sitesLength = sites.length;

        //        for (var i = 0; i < sitesLength; i++) {
        //            decodedSites.push(self.decodePassword(sites[i]));
        //        }
        //    }

        //    return decodedSites;
        //}
  
		self.WriteSiteData = function (dfd) {
			
            var sites = self.encodePasswords(JSON.parse(JSON.stringify(self.sites))),
				data = JSON.stringify(sites),
			    writePromise = File.WriteAsync(siteDataFileName, data);
            
			writePromise.done(function (result) {
				dfd.resolve(result);
			});
			writePromise.fail(function (error) {
				dfd.reject(error);
			});
		}
        
        self.RemoveSiteData = function (url) {
            var sitesLength = self.sites.length;
            
            for(var i = 0; i < sitesLength; i++)
            {
            	if (self.sites[i].url === url) 
                {
            	    self.sites.splice(i, 1);
            	    sitesLength -= 1; 
                }
            }
        }
    }

    return new service(); 
});