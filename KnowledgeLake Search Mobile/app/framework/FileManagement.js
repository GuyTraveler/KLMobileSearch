define(["application", 
		"logger",
        "jquery", 
        "framework/promiseResponse/promiseResolveResponse", 
        "framework/promiseResponse/promiseRejectResponse"], 
function (application, logger, $, PromiseResolveResponse, PromiseRejectResponse) {
    var fileManagement = function () {
        var self = this;
        
        self.fileSystem = null;
		self.knowledgelakeDirectory = "KnowledgeLake";
        
        var onFileSystemSuccess = function (fileSystem) {
            self.deferred.resolve(fileSystem);
        }
        
        var onFileSystemFail = function (error) {
            self.deferred.reject(error);
        }
        
        self.loadFileSystemAsync = function () {
            self.deferred = $.Deferred();
            
            if(!self.fileSystem)
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
            else
                onFileSystemSuccess(self.fileSystem);
            
            return self.deferred.promise();
        }
        
        var fileSystemPromise = self.loadFileSystemAsync();
        
        fileSystemPromise.done(function (fileSystem) {
            self.fileSystem = fileSystem;
        });
        
        fileSystemPromise.fail(function(error) {
            application.fileSystem = null;
            
            logger.logFatal(FileResponse.LoadFileSystemFailure + ": " + error.code);
        });
        
        self.ExistsAsync = function (path) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                var getFolderPromise = self.getFolderAsync();
                
                getFolderPromise.done(function (result) {
                    if(result.response)
                    {
                        result.response.getFile(path, { create: false },
                        function () {
                            dfd.resolve(new PromiseResolveResponse(application.strings.FileFound));
                        },
                        function () {
                            dfd.resolve(new PromiseResolveResponse(application.strings.FileNotFound));
                        });
                    }
                    else
                        dfd.reject(new PromiseRejectResponse(application.strings.AccessDirectoryFailure, null));
                });
                
                getFolderPromise.fail(function (error) {
                    dfd.reject(error);
                });
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));
            }
            
            return dfd.promise();
        }
        
        self.ReadAsync = function (path) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                var getFolderPromise = self.getFolderAsync();
                
                getFolderPromise.done(function (result) {
                    if(result.response)
                    {
                        result.response.getFile(path, { create : false },
                        function (fileEntry) {
                            fileEntry.file(
                            function (file) {
                                var reader = new FileReader();
                                
                                reader.onload = function (evt) {
                                    dfd.resolve(new PromiseResolveResponse(evt.target.result));
                                }
                                
                                reader.onerror = function (error) {
                                    dfd.reject(new PromiseRejectResponse(application.strings.FileReadFailure, error));
                                }
                                
                                reader.readAsText(file);
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(application.strings.GetFileFailure, error));
                            });
                        },
                        function (error) {
                            dfd.reject(new PromiseRejectResponse(application.strings.FileNotFound, error));
                        });
                    }
                    else
                        dfd.reject(new PromiseRejectResponse(application.strings.AccessDirectoryFailure, null));                        
                });
                
                getFolderPromise.fail(function (error) {
                    dfd.reject(error);
                });                
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));
            }
            
            return dfd.promise();
        }
                
        self.WriteAsync = function (path, data) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                var getFolderPromise = self.getFolderAsync();
                
                getFolderPromise.done(function (result) {
                    if(result.response)
                    {
                        result.response.getFile(path, {create: true, exclusive: false},
                        function (fileEntry) {
                            fileEntry.createWriter(
                            function (writer) {
                                writer.onwrite = function (evt) {
                                    dfd.resolve(new PromiseResolveResponse(application.strings.FileWriteSuccess));
                                }
                                writer.onerror = function (error) {
                                    dfd.reject(new PromiseRejectResponse(application.strings.FileWriteFailure, error));
                                }
                                
                                writer.write(data);
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(application.strings.GetWriterFailure, error));
                            });
                        },
                        function (error) {
                            dfd.reject(new PromiseRejectResponse(application.strings.GetFileFailure, error));
                        });
                    }
                    else
                        dfd.reject(new PromiseRejectResponse(application.strings.AccessDirectoryFailure, null));                             
                });                
                
                getFolderPromise.fail(function (error) {
                    dfd.reject(error);
                }); 
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));
            }
            
            return dfd.promise();
        }
        
        self.DeleteAsync = function (path) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                var getFolderPromise = self.getFolderAsync();
                
                getFolderPromise.done(function (result) {
                    if(result.response)
                    {
                        result.response.getFile(path, { create: false },
                        function (fileEntry) {
                            fileEntry.remove(
                            function () {
                                dfd.resolve(new PromiseResolveResponse(application.strings.FileDeleteSuccess));
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(application.strings.FileDeleteFailure, error));
                            });
                        },
                        function (error) {
                            dfd.resolve(new PromiseResolveResponse(application.strings.FileNotFound));
                        });
                    }
                    else
                        dfd.reject(new PromiseRejectResponse(application.strings.AccessDirectoryFailure, null));                             
                });                
                
                getFolderPromise.fail(function (error) {
                    dfd.reject(error);
                });                    
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));
            }
            
            return dfd.promise();
        } 
        
        self.getFolderAsync = function () {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                self.fileSystem.root.getDirectory(self.knowledgelakeDirectory, {create: true, exclusive: false},
                function (directoryEntry) {
                    dfd.resolve(new PromiseResolveResponse(directoryEntry));
                },
                function (error) {
                    
                dfd.reject(new PromiseRejectResponse(application.strings.CreateDirectoryFailure, error));
                });
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(application.strings.FileSystemNull, null));
            }
            
            return dfd.promise();
	    }
    }
    
    return fileManagement;
});