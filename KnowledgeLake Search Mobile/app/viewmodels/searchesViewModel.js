define(["knockout"], function (ko) {
    var searchesViewModel = function () {
        var self = this;
        
        self.TestMessage = ko.observable("Saved Searches"); 
        
        self.init = function (e) {
            system.logVerbose("searchesViewModel init");
        }
        
        self.beforeShow = function (e) {
            system.logVerbose("searchesViewModel beforeShow");
        }
        
        self.show = function (e) {
            system.logVerbose("searchesViewModel show");
        }
        
        self.afterShow = function (e) {
            system.logVerbose("searchesViewModel afterShow");
        }
        
        self.hide = function (e) {
            system.logVerbose("searchesViewModel hide");
        }
            
        return self;
    };
    
    return searchesViewModel;
});