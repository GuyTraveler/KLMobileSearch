define(["knockout", "system", "FileManagement", "services/sharepoint/siteDataService"], 
    function (ko, system, File, siteDataService) {
        var configureSiteViewModel = function () {
            var self = this,
                defaultUrlText = "http://",
                homeUrl = "#home",
                questionUrl = "app/images/question.png",
                invalidUrl = "app/images/invalid.png",
                validUrl = "app/images/valid.png";
                 
            
            self.url = ko.observable(defaultUrlText);
            self.validationImageSrc = ko.observable(questionUrl);
            
            self.saveSiteSettings = function () {
                system.logVerbose("save site settings");
            }
            
            self.closeSiteSettings = function () {
                system.logVerbose("closing site settings");
                
                // add logic to append newest site to sites.dat
                // if file exists writeAppend
                // if file does not exist write
                
                window.App.navigate(homeUrl);
            }
            
            self.validateSiteUrl = function () {
                var dataService;
                
                system.logVerbose("validateSiteUrl called");
                window.App.showLoading();
                
                dataService = new siteDataService(self.url());
                dataService.GetSiteUrl(self.url(), self.onSiteUrlValidated, self.onSiteUrlFailed);
            }
            
            self.onSiteUrlValidated = function (result) {
                system.logVerbose("site url validation success");
                
                self.setValidUrl();   
                
                window.App.hideLoading();
            }
            
            self.onSiteUrlFailed = function (XMLHttpRequest, textStatus, errorThrown) {
                var status = XMLHttpRequest.status;
                system.logVerbose("site url validation failed with status: " + status);
                
                if (status == 401 || status == 200) {
                    self.setValidUrl();   
                }
                else {
                    self.setInvalidUrl();
                }
                
                window.App.hideLoading();
            }
            
            
            self.setValidUrl = function () {
                self.validationImageSrc(validUrl);
            }
            
            self.setInvalidUrl = function () {
                self.validationImageSrc(invalidUrl);    
            }
            
            self.resetUrlValidation = function () {
                self.validationImageSrc(questionUrl);    
            }
            
            
            
            self.init = function (e) {
                system.logVerbose("configureSiteViewModel init");
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("configureSiteViewModel beforeShow");
            }
            
            self.show = function (e) {
                system.logVerbose("configureSiteViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("configureSiteViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("configureSiteViewModel hide");
            } 
   
            return self;
        };
        
        return configureSiteViewModel;
    });