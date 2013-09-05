define(["knockout", 'services/keywordValidationService'], 
    function (ko, ValidationService) {
        var siteViewModel = function (site) {
            var self = this;
            
            self.url = site.url;
            self.title = site.title;
            self.majorVersion = site.majorVersion;
            self.credential = site.credential;
            
            return self;
        };
        
        return siteViewModel;
    });