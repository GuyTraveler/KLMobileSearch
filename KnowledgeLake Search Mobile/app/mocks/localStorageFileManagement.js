/* html5 'local storage' file management implementation */

define(["system",
		"domain/promiseResponse/promiseResolveResponse", 
        "domain/promiseResponse/promiseRejectResponse"
	   ], function (system, PromiseResolveResponse, PromiseRejectResponse) {
	var fileSystemMock = function () {
		var self = this,
			localStorageAvailable = function () {
				return ('localStorage' in window && window['localStorage'] !== null);
            };
		
		self.fileSystem = {};
		
		self.ExistsAsync = function (path) {
			var dfd = $.Deferred();
						
			if (!localStorageAvailable()) {
				dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
            }
			else if (window.localStorage[path] != null) {
				dfd.resolve(new PromiseResolveResponse(system.strings.FileFound));
            }
			else {
				dfd.resolve(new PromiseResolveResponse(system.strings.FileNotFound));
			}
			
			return dfd.promise();
        }
		
		self.WriteAsync = function (path, data) {
			var dfd = $.Deferred(),
				writeData = typeof data === 'string' ? data : JSON.stringify(data);
			
			if (!localStorageAvailable()) {
				dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
            }
			else {
				window.localStorage[path] = writeData;
				dfd.resolve(new PromiseResolveResponse(system.strings.FileWriteSuccess));
            }
			
			return dfd.promise();
		}
		
		self.ReadAsync = function (path) {
			var dfd = $.Deferred();
			
			if (!localStorageAvailable()) {
				dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
            }
			else if (window.localStorage[path] == null) {
				dfd.reject(new PromiseRejectResponse(system.strings.FileNotFound, null));
            }
			else {
				dfd.resolve(new PromiseResolveResponse(window.localStorage[path]));
            }
			
			return dfd.promise();
        }
		
		self.DeleteAsync = function (path) {
			var dfd = $.Deferred();
			
			if (!localStorageAvailable()) {
				dfd.reject(new PromiseRejectResponse(system.strings.FileSystemNull, null));
            }
			else if (window.localStorage[path] != null) {
				delete window.localStorage[path];
				dfd.resolve(new PromiseResolveResponse(system.strings.FileDeleteSuccess));
            }
			else {
				dfd.resolve(new PromiseResolveResponse(system.strings.FileDeleteSuccess));
            }			
			
			return dfd.promise();
        }
		
		return self;
    };
	
	return fileSystemMock;
});