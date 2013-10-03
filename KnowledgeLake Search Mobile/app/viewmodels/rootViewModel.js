define(["knockout", 
		"system",
		"viewmodels/viewModelBase"], 
function (ko, system, viewModelBase) {
    var rootViewModel = function () {
        var self = this;
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
		
        self.init = function (e) {
            system.logVerbose("rootViewModel init");
        }
        
        self.beforeShow = function (e) {
            system.logVerbose("rootViewModel beforeShow");
        }
        
        self.show = function (e) {
            system.logVerbose("rootViewModel show");
        }
        
        self.afterShow = function (e) {
			system.logVerbose("rootViewModel afterShow");
        }
        
        self.hide = function (e) {
            system.logVerbose("rootViewModel hide");
        }
        
        return self;
    };
    
    return rootViewModel;
});