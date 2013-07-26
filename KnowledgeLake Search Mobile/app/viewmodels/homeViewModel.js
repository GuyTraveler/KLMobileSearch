define(["knockout", "system"], 
    function (ko, system) {
        var homeViewModel = function () {
            var self = this;
            
            self.TestMessage = ko.observable("Homegg");
            
            self.init = function (e) {
                system.logVerbose("homeViewModel init");
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("homeViewModel beforeShow");
            }
            
            self.show = function (e) {
                system.logVerbose("homeViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("homeViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("homeViewModel hide");
            }
            
            return self;
        };
        
        return homeViewModel;
    });