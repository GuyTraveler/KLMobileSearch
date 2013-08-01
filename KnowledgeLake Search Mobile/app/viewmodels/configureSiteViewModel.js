define(["knockout", "system", "FileManagement"], 
    function (ko, system, File) {
        var configureSiteViewModel = function () {
            var self = this,
                defaultUrlText = "http://",
                homeUrl = "#home";
                 
            
            self.url = ko.observable(defaultUrlText);
            
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
                system.logVerbose("validateSiteUrl called");
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