define(["system", "jquery"], function (system, $) {
    var fileManagement = function () {
        var self = this;
        
        self.fileSystem = null;
        
        var onFileSystemSuccess = function (fileSystem) {
            self.deferred.resolve(fileSystem);
        }
        
        var onFileSystemFail = function (error) {
            self.deferred.fail(error);
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
            
            system.logFatal("Unable to connect to the file system: " + error.code);
        });
        
        self.Exists = function (path) {
            var dfd = $.Deferred();
            
            if(self.fileSystem)
            {
                self.fileSystem.root.getFile(path, { create: false },
                function () {
                    dfd.resolve(true);
                },
                function () {
                    dfd.resolve(false);
                });
            }
            else
            {
                dfd.reject(false);
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
                            dfd.resolve(evt.target.result);
                        }
                        
                        reader.onerror = function (error) {
                            system.logError("Failed to read data from file: " + error.code);
                            dfd.reject(false);
                        }
                        
                        reader.readAsText(file);
                    },
                    function (error) {
                        system.logError("Failed to get file instance: " + error.code);
                        dfd.reject(false);
                    });
                },
                function (error) {
                    system.logError("File does not exist: " + error.code);
                    dfd.reject(false);
                });
            }
            else
            {
                system.logFatal("File system not initialized. (Read)");
                dfd.reject(false);
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
                            dfd.resolve(true);
                        }
                        writer.onerror = function (error) {
                            system.logError("Failed to write data to file: " + error.code);
                            dfd.reject(false);
                        }
                        
                        writer.write(data);
                    },
                    function (error) {
                        system.logError("Failed to create file writer: " + error.code);
                        dfd.reject(false);
                    });
                },
                function (error) {
                    system.logError("Failed to get file entry: " + error.code);
                    dfd.reject(false);
                });
            }
            else
            {
                system.logFatal("File system not initialized. (Write)");
                dfd.reject(false);
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
                        dfd.resolve(true);
                    },
                    function (error) {
                        system.logError("Failed to delete file: " + error.code);
                        dfd.reject(false);
                    });
                },
                function (error) {
                    // File does not exist (not a failure state)
                    dfd.resolve(false);
                });
            }
            else
            {
                system.logFatal("File system not initialized. (Delete)");
                dfd.reject(false);
            }
            
            return dfd.promise();
        }
    }
    
    return fileManagement;
});