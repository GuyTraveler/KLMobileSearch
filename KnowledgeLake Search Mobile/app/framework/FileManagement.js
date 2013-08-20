define(["system", 
        "jquery", 
        "domain/promiseResponse/promiseResolveResponse", 
        "domain/promiseResponse/promiseRejectResponse",
        "domain/promiseResponse/fileSystemResponse"], 
        function (system, $, PromiseResolveResponse, PromiseRejectResponse, FileSystemResponse) {
    var fileManagement = function () {
        var self = this;
        
        self.fileSystem = null;
        
        var onFileSystemSuccess = function (fileSystem) {
            self.deferred.resolve(fileSystem);
        }
        
        var onFileSystemFail = function (error) {
            self.deferred.reject(error);
        }
        
        self.loadFileSystem = function () {
            self.deferred = $.Deferred();
            
            if(!self.fileSystem)
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
            else
                onFileSystemSuccess(self.fileSystem);
            
            return self.deferred.promise();
        }
        
        var fileSystemPromise = self.loadFileSystem();
        
        fileSystemPromise.done(function (fileSystem) {
            self.fileSystem = fileSystem;
        });
        
        fileSystemPromise.fail(function(error) {
            system.fileSystem = null;
            
            system.logFatal(FileResponse.LoadFileSysystemFailure + ": " + error.code);
        });
        
        self.Exists = function (path) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                self.fileSystem.root.getFile(path, { create: false },
                function () {
                    dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileFound));
                },
                function () {
                    dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileNotFound));
                });
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileSystemNull, null));
            }
            
            return dfd.promise();
        }
        
        self.Read = function (path) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                self.fileSystem.root.getFile(path, { create : false },
                function (fileEntry) {
                    fileEntry.file(
                    function (file) {
                        var reader = new FileReader();
                        
                        reader.onload = function (evt) {
                            dfd.resolve(new PromiseResolveResponse(evt.target.result));
                        }
                        
                        reader.onerror = function (error) {
                            dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileReadFailure, error));
                        }
                        
                        reader.readAsText(file);
                    },
                    function (error) {
                        dfd.reject(new PromiseRejectResponse(FileSystemResponse.GetFileFailure, error));
                    });
                },
                function (error) {
                    dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileNotFound, error));
                });
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileSystemNull, null));
            }
            
            return dfd.promise();
        }
                
        self.Write = function (path, data) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                self.fileSystem.root.getFile(path, {create: true, exclusive: false},
                function (fileEntry) {
                    fileEntry.createWriter(
                    function (writer) {
                        writer.onwrite = function (evt) {
                            dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileWriteSuccess));
                        }
                        writer.onerror = function (error) {
                            dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileWriteFailure, error));
                        }
                        
                        writer.write(data);
                    },
                    function (error) {
                        dfd.reject(new PromiseRejectResponse(FileSystemResponse.GetWriterFailure, error));
                    });
                },
                function (error) {
                    dfd.reject(new PromiseRejectResponse(FileSystemResponse.GetFileFailure, error));
                });
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileSystemNull, null));
            }
            
            return dfd.promise();
        }
        
        self.Delete = function (path) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                self.fileSystem.root.getFile(path, { create: false },
                function (fileEntry) {
                    fileEntry.remove(
                    function () {
                        dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileDeleteSuccess));
                    },
                    function (error) {
                        dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileDeleteFailure, error));
                    });
                },
                function (error) {
                    dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileNotFound));
                });
            }
            else
            {
                dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileSystemNull, null));
            }
            
            return dfd.promise();
        }
    }
    
    return fileManagement;
});