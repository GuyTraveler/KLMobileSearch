define(["knockout"], function (ko) {
    var resultsViewModel = function () {
        var self = this;
        
        self.resultDataSource = ko.observableArray(); 
        
        self.selectedResult = null;
        self.navBarVisible = ko.observable(false);
        
        self.SetDataSource = function (results) {
            if(results)
                self.siteDataSource(results);
        }
        
        self.init = function (e) {
            system.logVerbose("resultsViewModel init");
        }
        
        self.beforeShow = function (e) {
            system.logVerbose("resultsViewModel beforeShow");
        }
        
        self.show = function (e) {
            system.logVerbose("resultsViewModel show");
        }
        
        self.afterShow = function (e) {
            system.logVerbose("resultsViewModel afterShow");
        }
        
        self.hide = function (e) {
            system.logVerbose("resultsViewModel hide");
        }
        
        self.setSelectedResult = function (selection) {
            if(self.selectedResult === selection)
            {
                self.selectedResult = null;
                self.navBarVisible(false);
            }
            
            else
            {
                self.selectedResult = selection;
                self.navBarVisible(true);
            }
        }
        
        self.downloadResult = function () {
            if(self.selectedResult)
            {
                // call filetransfer command                 
            }
        }
            
        return self;
    };
    
    return resultsViewModel;
});