define(["converters/urlToFileTypeIcon"], function (UrlToFileTypeIcon) {
    var site = function(url, metadata) {
        var self = this;
       
        self.url = url;
        self.metadata = metadata;
        self.title = metadata.title;
        self.icon = UrlToFileTypeIcon.convert(url);        
       
        return self;
    };
    
    return site;
});