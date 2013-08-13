define([], function () {
	var fileSystemMock = function () {
		var self = this,
			fileBag = [],
			findEntry = function(path) {
				var entry;
				
				for (var i = fileBag.length - 1; i >= 0; i--) {
					entry = fileBag[i];
					
					if (entry.path == path)
						return entry;
                }
				
				return null;
            },
			saveFileEntry = function (fileEntry) {
				var entry;
				
				for (var i = fileBag.length - 1; i >= 0; i--) {
					entry = fileBag[i];
					
					if (entry.path == fileEntry.path) {
						fileBag[i] = entry;
						return;
                    }									
                }
                
                fileBag.push(fileEntry);
            };
		
		self.fileSystem = {};
		
		self.Exists = function (path) {
			var dfd = $.Deferred(),
				entry = findEntry(path);
			
			if (entry) {
				dfd.resolve(true);
            }
			else {
				dfd.resolve(false);
            }
			
			return dfd.promise();
        }
		
		self.Write = function (path, data) {
			var dfd = $.Deferred(),
				entry = { 
					path: path,
					data: data
                };						
			
			saveFileEntry(entry);
			dfd.resolve(true);
			
			return dfd.promise();
		}
		
		self.Read = function (path) {
			var dfd = $.Deferred(),
				entry = findEntry(path);
			
			if (entry) {
				dfd.resolve(entry.data);
            }
			else {
				dfd.reject(false);
            }
			
			return dfd.promise();
        }
		
		self.Delete = function (path) {
			var dfd = $.Deferred(),
				entry = findEntry(path),
				index;
			
			if (entry) {
				index = fileBag.indexOf(entry);
				fileBag.splice(index, 1);
				dfd.resolve(fileBag[path]);
            }
			else {
				dfd.resolve(false);  //resolve it with false
            }
			
			return dfd.promise();
        }
		
		return self;
    };
	
	return fileSystemMock;
});