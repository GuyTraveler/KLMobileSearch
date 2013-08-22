define(["knockout", 
        "IQueryService", 
        "domain/keywordConjunction", 
        "factory/logonServiceFactory"], 
    function (ko, QueryService, keywordConjunction, LogonServiceFactory) {
    var resultsViewModel = function () {
        var self = this;
        
        self.resultDataSource = ko.observableArray(); 
        
        self.selectedResult = null;
        self.navBarVisible = ko.observable(false);
            
        self.navBarVisible.subscribe(function (newValue) {
			$(".nav-button").kendoMobileButton();
        });
        
        self.SetDataSource = function (results) {
            if(results)
            {               
                self.resultDataSource([]);
                self.resultDataSource(results);
            }
        }
        
        self.init = function (e) {
            system.logVerbose("resultsViewModel init");
        }
        
        self.beforeShow = function (e) {
            system.logVerbose("resultsViewModel beforeShow");
            
            
            if(homeViewModel.selectedSite)  
                self.keywordSearch(homeViewModel.selectedSite);
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
                self.selectedResult = null;
            
            else
                self.selectedResult = selection;
            
            self.navBarVisible(self.selectedResult);
        }
            
        self.isSelectedResult = function (result) {
			if (self.navBarVisible())
				return (self.selectedResult === result);
        }
        
        self.editProperties = function () {
            if(self.selectedResult)
            {
                // navigate to properties page with properties from result                    
            }
        }
        
        self.navigateToResult = function (result) {
            // /Forms/DispForm.aspx?ID=
            if(result)
            {                
                window.open(result.url, "_blank");
            }
        }
        
        self.keywordSearch = function (searchSite) {          
            window.App.loading = "<h1>" + system.strings.searching + "</h1>";
            window.App.showLoading();
            
            service = new QueryService(searchSite.url);
            logonService = LogonServiceFactory.createLogonService(searchSite);
            
            logonPromise = logonService.logon(searchSite.credential.domain, searchSite.credential.userName, searchSite.credential.password);
            
            logonPromise.done(function () {                
                searchPromise = service.keywordSearch(searchSite.keyword, keywordConjunction.and, true);                
                
                searchPromise.done(function (result) {
                    self.SetDataSource(result);
                    
                    window.App.hideLoading();
                });
                
                searchPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {				
                    // search failed
                    window.App.hideLoading();
                });
            });
            
            logonPromise.fail(function () {
                // failed to login
                window.App.hideLoading();
            });
        }
            
        return self;
    };
    
    return resultsViewModel;
});