define(["system", "jquery", "FileManagement", "converters/urlToFileName"], function (system, $, File, UrlToFileName) {
    var fileTransfer = function () {
        var self = this,
            knowledgelakeDirectory = "KnowledgeLake",
            downloadDirectory = "Download",
            downloadPath = knowledgelakeDirectory + "/" + downloadDirectory;
        
        self.transfer = function (url) {            
            var dfd = $.Deferred();
            
            if(url)
            {
                var getFolderPromise = self.getFolder(downloadPath);
                
                getFolderPromise.done(function (folder) {
                    if (folder)
                    {
                        var fileName = UrlToFileName.convert(url);                        
                        var filePath = folder + "/" + fileName;
                        
                        var existsPromise = File.Exists(filePath); 
                        
                        existsPromise.done(function (result) {
                            if(result)
                            {
                                // pop dialog to provide unique filename
                                // call transfer again with uniqueFileName
                            }
                            else
                            {                                
                                var transfer = new FileTransfer();
                                
                                transfer.download(url, filePath,
            		            function(entry) {
                                    console.log(entry.fullPath);
                                    dfd.resolve(entry.fullPath); 
                        		},
                        		function(error) {
                                    dfd.reject(false);
                        		});
                            }
                        });
                        
                        existsPromise.fail(function (result) {
                            dfd.reject(false);
                        });	    
                    }               
                    
                    else
                    {
                        // could not access directory
                        dfd.resolve(false);
                    }
                });
              
                getFolderPromise.fail(function (result) {
                    dfd.reject(false);
                });      
            }
            
            else
            {
                dfd.reject(false);
            }
            
            return dfd.promise();
        }
        
        self.getFolder = function () {
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
            
        }
    }
    
    return new fileTransfer;
});