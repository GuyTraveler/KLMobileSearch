define([], function () {
    var search = function(url, title, type, query) {
        var self = this;        
        
        self.siteUrl = url;
        self.title = title;
        self.type = type;
        self.query = query ? query : "";
              
        return self;
    };
    
    return search;
});