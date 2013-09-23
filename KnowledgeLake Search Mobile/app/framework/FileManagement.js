define(["system", 
        "jquery", 
        "domain/promiseResponse/promiseResolveResponse", 
        "domain/promiseResponse/promiseRejectResponse"], 
        function (system, $, PromiseResolveResponse, PromiseRejectResponse) {
    var fileManagement = function () {
        var self = this,
            knowledgelakeDirectory = "KnowledgeLake";
        
        self.fileSystem = null;
        
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
            system.fileSystem = null;
            
            system.logFatal(FileResponse.LoadFileSysystemFailure + ": " + error.code);
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
                            dfd.resolve(new PromiseResolveResponse(system.strings.FileFound));
                        },
                        function () {
                            dfd.resolve(new PromiseResolveResponse(system.strings.FileNotFound));
                        });
                    }
                    else
                        dfd.reject(new PromiseRejectResponse(system.strings.AccessDirectoryFailure, null));
                });
                
                getFolderPromise.fail(function (error) {
                    dfd.reject(error);
                });
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
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
                                    dfd.reject(new PromiseRejectResponse(system.strings.FileReadFailure, error));
                                }
                                
                                reader.readAsText(file);
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(system.strings.GetFileFailure, error));
                            });
                        },
                        function (error) {
                            dfd.reject(new PromiseRejectResponse(system.strings.FileNotFound, error));
                        });
                    }
                    else
                        dfd.reject(new PromiseRejectResponse(system.strings.AccessDirectoryFailure, null));                        
                });
                
                getFolderPromise.fail(function (error) {
                    dfd.reject(error);
                });                
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
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
                                    dfd.resolve(new PromiseResolveResponse(system.strings.FileWriteSuccess));
                                }
                                writer.onerror = function (error) {
                                    dfd.reject(new PromiseRejectResponse(system.strings.FileWriteFailure, error));
                                }
                                
                                writer.write(data);
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(system.strings.GetWriterFailure, error));
                            });
                        },
                        function (error) {
                            dfd.reject(new PromiseRejectResponse(system.strings.GetFileFailure, error));
                        });
                    }
                    else
                        dfd.reject(new PromiseRejectResponse(system.strings.AccessDirectoryFailure, null));                             
                });                
                
                getFolderPromise.fail(function (error) {
                    dfd.reject(error);
                }); 
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
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
                                dfd.resolve(new PromiseResolveResponse(system.strings.FileDeleteSuccess));
                            },
                            function (error) {
                                dfd.reject(new PromiseRejectResponse(system.strings.FileDeleteFailure, error));
                            });
                        },
                        function (error) {
                            dfd.resolve(new PromiseResolveResponse(system.strings.FileNotFound));
                        });
                    }
                    else
                        dfd.reject(new PromiseRejectResponse(system.strings.AccessDirectoryFailure, null));                             
                });                
                
                getFolderPromise.fail(function (error) {
                    dfd.reject(error);
                });                    
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
            }
            
            return dfd.promise();
        } 
        
        self.getFolderAsync = function () {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                self.fileSystem.root.getDirectory(knowledgelakeDirectory, {create: true, exclusive: false},
                function (directoryEntry) {
                    dfd.resolve(new PromiseResolveResponse(directoryEntry));
                },
                function (error) {
                    
                dfd.reject(new PromiseRejectResponse(system.strings.CreateDirectoryFailure, error));
                });
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
            }
            
            return dfd.promise();
	    }
    }
    
    return fileManagement;
});