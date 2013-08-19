define([], function () {
    var result = function(url, metadata) {
        var self = this;
		
		self.url = url;
        self.metadata = metadata || {};
        self.title = self.metadata.Title || self.metadata.title;
       
        return self;
    };
    
    return result;
});