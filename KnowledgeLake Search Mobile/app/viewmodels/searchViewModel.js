define(["knockout"], 
    function (ko) {
        var searchViewModel = function (site, savedSearches) {
            var self = this;
            
            self.url = site.url;
            self.title = site.title;
            self.majorVersion = site.majorVersion;
            self.credential = site.credential;            
            
            self.keyword = site.keyword ? ko.observable(site.keyword) : ko.observable("");
            
            self.savedSearches = savedSearches ? savedSearches : [];
            
            return self;
        };
        
        return searchViewModel;
    });