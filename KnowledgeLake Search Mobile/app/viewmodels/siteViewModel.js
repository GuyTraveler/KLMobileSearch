define(["knockout", 'services/keywordValidationService'], 
    function (ko, ValidationService) {
        var siteViewModel = function (site) {
            var self = this;
            
            self.url = site.url;
            self.title = site.title;
            self.majorVersion = site.majorVersion;
            self.credential = site.credential;   
            self.keyword = site.keyword ? ko.observable(site.keyword) : ko.observable("");
            
            self.isKeywordValid = ko.computed(function () {
                return ValidationService.validate(self.keyword());
            });
            
            return self;
        };
        
        return siteViewModel;
    });