define(["knockout"], function (ko) {
    var siteViewModel = function () {
        var self = this;
        
        self.TestMessage = ko.observable("Site Data"); 
        
        self.init = function (e) {
            system.logVerbose("siteViewModel init");
        }
        
        self.beforeShow = function (e) {
            system.logVerbose("siteViewModel beforeShow");
        }
        
        self.show = function (e) {
            system.logVerbose("siteViewModel show");
        }
        
        self.afterShow = function (e) {
            system.logVerbose("siteViewModel afterShow");
        }
        
        self.hide = function (e) {
            system.logVerbose("siteViewModel hide");
        }
            
        return self;
    };
    
    return siteViewModel;
});