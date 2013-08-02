define(["jquery", "FileManagement"], function ($, File) {
    var service = function () {
        var self = this, 
            siteDataFilePath = "sites.dat";
        
        self.sites = null;
        
        self.LoadSites = function () {
            var dfd = $.Deferred();
            
            var existsPromise = File.Exists(siteDataFilePath);
                
            existsPromise.done(function (result) {
                if(result)
                {
                    var readPromise = File.Read(siteDataFilePath);
                    
                    readPromise.done(function (siteData) {
                        dfd.resolve(siteData); 
                    });
                    
                    readPromise.fail(function (result) {
                        dfd.reject(false);
                    });
                }
                else
                    dfd.reject(true);
            });
            
            existsPromise.fail(function (result) {                                 
                // critical error 
                dfd.reject(false);
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
                    // throw site connection already exists
                    dfd.reject(true);
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
                    dfd.reject(true);
            }
            else
            {
                dfd.reject(false);
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
  
		self.WriteSiteData = function (dfd) {
			var writePromise = File.Write(siteDataFilePath, self.sites);
                  
			writePromise.done(function (result) {
				dfd.resolve(true);
			});
			writePromise.fail(function (result) {
				dfd.reject(false);
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