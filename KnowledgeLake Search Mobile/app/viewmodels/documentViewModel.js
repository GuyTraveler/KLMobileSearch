define(["knockout", 
		"application",
		"logger",
		"viewmodels/viewModelBase"], 
function (ko, application, logger, viewModelBase) {
    var documentViewModel = function () {
        var self = this;
                   
		self.prototype = Object.create(viewModelBase.prototype);
    	viewModelBase.call(self);
		
        self.documentTitle = ko.observable("PDF");
        
        self.init = function (e) {
            logger.logVerbose("documentViewModel init");
        }
        
        self.beforeShow = function (e) {
            logger.logVerbose("documentViewModel beforeShow");
        }
        
        self.show = function (e) {
            logger.logVerbose("documentViewModel show");
        }
        
        self.afterShow = function (e) {
			//var tabstrip = e.view.footer.find(".km-tabstrip").data("kendoMobileTabStrip");
			
            logger.logVerbose("documentViewModel afterShow");
			
			//tabstrip.clear();
        }
        
        self.hide = function (e) {
            logger.logVerbose("documentViewModel hide");
        }
        
        return self;
    };
    
    return documentViewModel;
});