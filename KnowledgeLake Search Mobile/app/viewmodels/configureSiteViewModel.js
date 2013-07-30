define(["knockout", "system"], 
    function (ko, system) {
        var configureSiteViewModel = function () {
            var self = this;
                 
            
            self.url = ko.observable("http://");
            
            self.saveSiteSettings = function () {
                system.logVerbose("save site settings");
            }
            
            self.closeSiteSettings = function () {
                system.logVerbose("closing site settings");
                window.App.navigate("#home");
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