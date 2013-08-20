/* html5 'local storage' file management implementation */

define([], function () {
	var fileSystemMock = function () {
		var self = this;
		
		self.fileSystem = {};
		
		self.Exists = function (path) {
			var dfd = $.Deferred();
			
			return dfd.promise();
        }
		
		self.Write = function (path, data) {
			var dfd = $.Deferred();
			
			return dfd.promise();
		}
		
		self.Read = function (path) {
			var dfd = $.Deferred();
			
			return dfd.promise();
        }
		
		self.Delete = function (path) {
			var dfd = $.Deferred();
			
			return dfd.promise();
        }
		
		return self;
    };
	
	return fileSystemMock;
});