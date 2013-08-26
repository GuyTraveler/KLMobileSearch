define(["knockout",
        "jquery", 
        "IQueryService", 
        "domain/keywordConjunction", 
        "factory/logonServiceFactory", 
        "IDocumentService",
		"ISiteDataService"], 
    function (ko, $, QueryService, keywordConjunction, LogonServiceFactory, documentService, SiteDataService) {
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
        
        /*self.init = function (e) {
            system.logVerbose("resultsViewModel init");
        }*/
        
        self.beforeShow = function (e) {
            system.logVerbose("resultsViewModel beforeShow");            
            
            if(homeViewModel.selectedSite)  
                self.keywordSearch(homeViewModel.selectedSite);
        }
        
        /*self.show = function (e) {
            system.logVerbose("resultsViewModel show");
        }
        
        self.afterShow = function (e) {
            system.logVerbose("resultsViewModel afterShow");
        }
        
        self.hide = function (e) {
            system.logVerbose("resultsViewModel hide");
        }*/
        
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
            
            return false;
        }
        
        self.editProperties = function () {
            if(self.selectedResult)
            {
                // navigate to properties page with properties from result                    
            }
        }
        
        self.navigateToResult = function (selection) {
            var dfd = $.Deferred();
            
            if(selection && homeViewModel.selectedSite)
            {
                window.App.loading = "<h1>" + system.strings.loading + "</h1>";
                window.App.showLoading();
                
                var service = new documentService(selection.url);
        
                var logonService = LogonServiceFactory.createLogonService(homeViewModel.selectedSite.url, homeViewModel.selectedSite.credential.credentialType);

                logonPromise = logonService.logon(homeViewModel.selectedSite.credential.domain, 
                                                  homeViewModel.selectedSite.credential.userName, 
                                                  homeViewModel.selectedSite.credential.password,
                                                  selection.url);
            
                logonPromise.done(function (result) {
                    getDisplayFormUrlPromise = service.getDisplayFormUrl();
                
                    getDisplayFormUrlPromise.done(function (result) {                    
                        window.App.hideLoading();
                        
                        window.open(result, "_blank");
                    });
                    
                    getDisplayFormUrlPromise.fail(function (error) {
                        window.App.hideLoading();
                    });
                });
                
                logonPromise.fail(function (error) {
                    window.App.hideLoading();
                    
                    dfd.reject(error);
                });
            }
            
            return dfd.promise();
        }
        
        self.keywordSearch = function (searchSite) {
            var dfd = $.Deferred(),
                service,
                logonService;
            
            window.App.loading = "<h1>" + system.strings.searching + "</h1>";
            window.App.showLoading();
            
            service = new QueryService(searchSite.url);
            logonService = LogonServiceFactory.createLogonService(searchSite.url, searchSite.credential.credentialType);
            
            logonPromise = logonService.logon(searchSite.credential.domain, searchSite.credential.userName, searchSite.credential.password);
            
            logonPromise.done(function (result) {
                searchPromise = service.keywordSearch(searchSite.keyword, keywordConjunction.and, true);
                
                searchPromise.done(function (result) {
                    self.SetDataSource(result);
                    
                    dfd.resolve(true);
                    
                    window.App.hideLoading();
                });
                
                searchPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {				
                    dfd.reject(errorThrown);
                    
                    window.App.hideLoading();
                });
            });
            
            logonPromise.fail(function (error) {
                dfd.reject(error);
                
                window.App.hideLoading();
            });
            
            return dfd.promise();
        }
            
        return self;
    };
    
    return resultsViewModel;
});