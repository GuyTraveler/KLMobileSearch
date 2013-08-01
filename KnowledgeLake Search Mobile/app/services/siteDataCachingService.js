define(["jquery", "FileManagement"], function ($, File) {
    var service = function () {
        var self = this, 
            siteDataFilePath = "sites.dat";
        
        self.sites = null;
        
        self.LoadSites = function () {
            var dfd = $.Deferred();
            
            var existsPromise = File.Exists(siteDataFilePath);
                
            existsPromise.done(function (result) {
                var readPromise = File.Read(filePath);
                
                readPromise.done(function (siteData) {
                    dfd.resolve(siteData); 
                });
                
                readPromise.fail(function (result) {
                    dfd.reject(false);
                });
            });
            
            existsPromise.fail(function (result) {
                if(result)
                {                   
                    dfd.reject(true);                    
                }
                else
                {                    
                    // critical error 
                    dfd.reject(false);
                }
            });
            
            return dfd.promise();
        }
        
        self.AddSite = function (site) {
            var dfd = $.Deferred();
            
            if(self.sites.indexOf(site) == -1)
            {
                self.sites.push(site);
                
                var writePromise = File.Write(siteDataFilePath, self.sites);
            
                writePromise.done(function (result) {
                    dfd.resolve(true);
                });
                writePromise.fail(function (result) {
                    dfd.reject(false);
                });
            }
            else
            {
                // throw site connection already exists
                dfd.reject(true);
            }
            
            return dfd.promise();
        }
        
        self.RemoveSite = function (site) {
            var dfd = $.Deferred(); 
            
            self.sites.remove(site);
            
            var writePromise = File.Write(siteDataFilePath, self.sites);
            
            writePromise.done(function (result) {
                dfd.resolve(true);
            });
            
            writePromise.fail(function (result) {
                dfd.reject(false);
            });
            
            return dfd.promise();
        }        
    }

    return new service(); 
});