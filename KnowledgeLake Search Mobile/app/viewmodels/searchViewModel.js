define(["knockout", "system"], 
    function (ko, system) {
        var searchViewModel = function () {
            var self = this;
            
            self.keyword = ko.observable("");
            self.isKeywordValid = ko.observable(true);
            
            self.init = function (e) {
                system.logVerbose("searchViewModel init");
            }
            
            self.beforeShow = function (e) {
                system.logVerbose("searchViewModel beforeShow");
            }
            
            self.show = function (e) {
                system.logVerbose("searchViewModel show");
            }
            
            self.afterShow = function (e) {
                system.logVerbose("searchViewModel afterShow");
            }
            
            self.hide = function (e) {
                system.logVerbose("searchViewModel hide");
            }
            
            self.search = function (e) {
                
            }
            
            self.onSearchKeyUp = function (selection, event) {
				if (event.keyCode === 13)
					self.search(selection);
            }
            
            return self;
        };
        
        return searchViewModel;
    });