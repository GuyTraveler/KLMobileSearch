define(["converters/urlToFileTypeIcon"], function (UrlToFileTypeIcon) {
    var result = function(url, metadata) {
        var self = this;
       
        self.setUrl = function (url) { 
			self.url = url;
			
			if (self.url)		
        		self.icon = UrlToFileTypeIcon.convert(url);      
        };
		
		self.setUrl(url);
        self.metadata = metadata || {};
        self.title = metadata.Title || metadata.title;
       
        return self;
    };
    
    return result;
});