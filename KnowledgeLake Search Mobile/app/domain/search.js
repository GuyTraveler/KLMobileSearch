define([], function () {
    var search = function(url, title, description, type, query) {
        var self = this;        
        
        self.siteUrl = url;
        self.title = title;
        self.description = description;
        self.type = type;
        self.query = query ? query : "";
              
        return self;
    };
    
    return search;
});