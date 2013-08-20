/* html5 'local storage' file management implementation */

define(["domain/promiseResponse/promiseResolveResponse", 
        "domain/promiseResponse/promiseRejectResponse",
        "domain/promiseResponse/fileSystemResponse"
	   ], function (PromiseResolveResponse, PromiseRejectResponse, FileSystemResponse) {
	var fileSystemMock = function () {
		var self = this,
			localStorageAvailable = function () {
				return ('localStorage' in window && window['localStorage'] !== null);
            };
		
		self.fileSystem = {};
		
		self.Exists = function (path) {
			var dfd = $.Deferred();
						
			if (!localStorageAvailable()) {
				dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileSystemNull, null));
            }
			else if (window.localStorage[path] != null) {
				dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileFound));
            }
			else {
				dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileNotFound));
			}
			
			return dfd.promise();
        }
		
		self.Write = function (path, data) {
			var dfd = $.Deferred(),
				writeData = typeof data === 'string' ? data : JSON.stringify(data);
			
			if (!localStorageAvailable()) {
				dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileSystemNull, null));
            }
			else {
				window.localStorage[path] = writeData;
				dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileWriteSuccess));
            }
			
			return dfd.promise();
		}
		
		self.Read = function (path) {
			var dfd = $.Deferred();
			
			if (!localStorageAvailable()) {
				dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileSystemNull, null));
            }
			else if (window.localStorage[path] == null) {
				dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileNotFound, null));
            }
			else {
				dfd.resolve(new PromiseResolveResponse(window.localStorage[path]));
            }
			
			return dfd.promise();
        }
		
		self.Delete = function (path) {
			var dfd = $.Deferred();
			
			if (!localStorageAvailable()) {
				dfd.reject(new PromiseRejectResponse(FileSystemResponse.FileSystemNull, null));
            }
			else if (window.localStorage[path] != null) {
				delete window.localStorage[path];
				dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileDeleteSuccess));
            }
			else {
				dfd.resolve(new PromiseResolveResponse(FileSystemResponse.FileDeleteSuccess));
            }			
			
			return dfd.promise();
        }
		
		return self;
    };
	
	return fileSystemMock;
});