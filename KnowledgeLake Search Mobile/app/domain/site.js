define([], function () {
    var site = function(url, title, credential) {
        var self = this;
       
        self.url = url;
        self.title = title;
        self.credential = credential;
       
        return self;
    };
    
    return site;
});