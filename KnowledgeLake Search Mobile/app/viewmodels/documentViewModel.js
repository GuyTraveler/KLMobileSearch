define(["knockout", 
		"system",
		"viewmodels/viewModelBase"], 
function (ko, system, viewModelBase) {
    var documentViewModel = function () {
        var self = this;
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
		
        self.documentTitle = ko.observable("PDF");
        
        self.init = function (e) {
            system.logVerbose("documentViewModel init");
        }
        
        self.beforeShow = function (e) {
            system.logVerbose("documentViewModel beforeShow");
        }
        
        self.show = function (e) {
            system.logVerbose("documentViewModel show");
        }
        
        self.afterShow = function (e) {
			//var tabstrip = e.view.footer.find(".km-tabstrip").data("kendoMobileTabStrip");
			
            system.logVerbose("documentViewModel afterShow");
			
			//tabstrip.clear();
        }
        
        self.hide = function (e) {
            system.logVerbose("documentViewModel hide");
        }
        
        return self;
    };
    
    return documentViewModel;
});