define(["system", "jquery", "FileManagement"], function (system, $, File) {
    var fileTransfer = function () {
        var self = this,
            downloadDirectory = "Download",
            knowledgelakeDirectory = "KnowledgeLake";
        
        self.transferAsync = function (url) {            
            var dfd = $.Deferred();
            
            if(url)
            {
                var getFolderPromise = self.getFolderAsync();
                
                getFolderPromise.done(function (folder) {
                    if (folder)
                    {
                        var fileName = self.convertUrlToFileName(url);                        
                        var filePath = folder.fullPath + "/" + fileName;
                        
                        var existsPromise = File.ExistsAsync(filePath); 
                        
                        existsPromise.done(function (result) {
                            if(result.response === system.strings.FileFound)
                            {
                                // pop dialog to provide unique filename
                                // call transfer again with uniqueFileName
                            }
                            else
                            {                                
                                var transfer = new FileTransfer();
                                
                                transfer.download(url, filePath,
            		            function(entry) {
                                    dfd.resolve(entry.fullPath); 
                        		},
                        		function(error) {
                                    dfd.reject(false);
                        		});
                            }
                        });
                        
                        existsPromise.fail(function (error) {
                            dfd.reject(false);
                        });	    
                    }               
                    
                    else
                    {
                        // could not access directory
                        dfd.resolve(false);
                    }
                });
              
                getFolderPromise.fail(function (error) {
                    dfd.reject(false);
                });      
            }
            
            else
            {
                dfd.reject(false);
            }
            
            return dfd.promise();
        }
        
        self.getFolderAsync = function () {
            var dfd = $.Deferred();
            
            if(File.fileSystem)
            {
                File.fileSystem.root.getDirectory(downloadDirectory, {create: true, exclusive: false},
                function (DownloadDirectory) {
                    DownloadDirectory.getDirectory(knowledgelakeDirectory, {create: true, exclusive: false},
                    function (folder)
                    {
                        dfd.resolve(folder);
                    },
                    function (error)
                    {
                        dfd.reject("Unable to access / create KnowledgeLake directory: " + error);
                    })
                },
                function (error) {
                    dfd.reject("Unable to access / create Download directory: " + error);
                });
            }
            else
            {
                dfd.reject("File system not initialized. (getFolder)");
            }
            
            return dfd.promise();
	    }
        
        self.convertUrlToFileName = function (url) {
            defaultFileName = "";       
       
            var urlComponents = url.split("/");
            
            if(urlComponents)
            {
                return urlComponents[urlComponents.length-1];
            }
            
            return defaultFileName;   
        }
    }
    
    return new fileTransfer;
});