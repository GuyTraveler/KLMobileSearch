define(["system", "jquery"], function (system, $) {
    var File = function () {
        var self = this; 
        
        self.onFileSystemSuccess = function (fileSystem) {
            self.defered.resolve(fileSystem);
        }
        
        self.onFileSystemFail = function (error) {
            self.defered.fail(error);                 
        }
        
        self.loadFileSystem = function () {
            var dfd = $.Deferred();
            
            if(!self.fileSystem)            
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, self.onFileSystemSuccess, self.onFileSystemFail);
            else
                dfd.resolve(self.fileSystem);
            
            return dfd.promise();
        } 
        
        self.defered = self.loadFileSystem();     
        
        self.defered.done = function (fileSystem) {
            self.fileSystem = fileSystem;
        }
        
        self.defered.fail = function(error) {
            system.fileSystem = null; 
            
            system.logFatal("Unable to connect to the file system: " + error.code); 
        }
        
        self.fileSystem;
        
        self.Exists = function (path) {            
            if(self.fileSystem != null)
            {
                self.fileSystem.root.getFile(path, { create: false },
                // success callback
                function () { 
                    return true; 
                },
                // failure callback
                function () { 
                    return false; 
                });                
            }
            
            return false;
        }
        
        self.Read = function (path) {
            if(self.fileSystem != null)
            {
                self.fileSystem.root.getFile(path, null,
                function (fileEntry) {
                    fileEntry.file(
                    function (file) {
                        var reader = new FileReader(); 
                        
                        reader.onload = function (evt) {
                            return evt.target.result; 
                        }
                        
                        reader.onerror = function (error) {
                            system.logError("Failed to read data from file: " + error.code);
                            return null; 
                        }
                        
                        reader.readAsText(file);                        
                    }, 
                    function (error) {
                        system.logError("Failed to get file instance: " + error.code);
                        return null;
                    });
                },
                function (error) {
                    system.logError("File does not exist: " + error.code);
                    return null; 
                });                
            }            
            
            system.logFatal("File system not initialized.");
            return null;             
        }
                
        self.Write = function (path, data) {
            if(self.fileSystem != null)
            {
                self.fileSystem.root.getFile(path, {create: true, exclusive: false},             
                function (fileEntry) {
                    fileEntry.createWriter(
                    function (writer) {
                        writer.onwrite = function (evt) {
                            return true;
                        }
                        writer.onerror = function (error) {
                            system.logError("Failed to write data to file: " + error.code);
                            return false; 
                        }
                        
                        writer.write(data); 
                    }, 
                    function (error) {
                        system.logError("Failed to create file writer: " + error.code);
                        return false;
                    });
                }, 
                function (error) {
                    system.logError("Failed to get file entry: " + error.code); 
                    return false;
                });                 
            }
            
            system.logFatal("File system not initialized.");
            return false;             
        }
    }
    
    return new File();
});