define(["knockout", "system"], 
    function (ko, system) {
        var documentViewModel = function () {
            var self = this;
            
            self.documentTitle = ko.observable("PDF");
            
            self.init = function (e) {
                system.logVerbose("searchViewModel init");
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("searchBuilderViewModel beforeShow");
            }
            
            self.show = function (e) {
                system.logVerbose("searchBuilderViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("searchBuilderViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("searchBuilderViewModel hide");
            }
            
            return self;
        };
        
        return documentViewModel;
    });