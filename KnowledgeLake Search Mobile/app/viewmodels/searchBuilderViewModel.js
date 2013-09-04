define(["knockout", "system"], 
    function (ko, system) {
        var searchBuilderViewModel = function () {
            var self = this;
            
            self.keyword = ko.observable("");
            self.isKeywordValid = ko.observable(true);
            
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
            
            self.search = function (e) {
                
            }
            
            self.onSearchKeyUp = function (selection, event) {
				if (event.keyCode === 13)
					self.search(selection);
            }
            
            return self;
        };
        
        return searchBuilderViewModel;
    });