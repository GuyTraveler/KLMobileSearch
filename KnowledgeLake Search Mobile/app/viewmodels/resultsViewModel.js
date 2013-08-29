define(["knockout",
        "jquery", 
        "factory/queryServiceFactory", 
        "domain/keywordConjunction", 
        "factory/logonServiceFactory", 
        "IDocumentService",
		"ISiteDataService"], 
    function (ko, $, QueryServiceFactory, keywordConjunction, LogonServiceFactory, documentService, SiteDataService) {
    var resultsViewModel = function () {
        var self = this;
        
        self.resultDataSource = ko.observableArray(); 
        
        self.selectedResult = null;
        self.windowRef = null;      
        self.navBarVisible = ko.observable(false);
            
        self.navBarVisible.subscribe(function (newValue) {
			$(".nav-button").kendoMobileButton();
        });

        self.isBusy = ko.observable(false);
		self.isBusy.subscribe(function (newValue) {
			if (newValue == true) {
				window.App.showLoading();
            }
			else {
				window.App.hideLoading();
            }
        });
        
        self.SetDataSource = function (results) {               
            self.resultDataSource([]);

            if(results)
            {
                self.resultDataSource(results);
            }
        }
        
        self.init = function (e) {

        }
        
        self.beforeShow = function (e) {
            system.logVerbose("resultsViewModel beforeShow");                                   
        }
		
		self.show = function (e) {
			system.logVerbose("resultsViewModel show");
			
			if(homeViewModel.selectedSite)  
                self.keywordSearch(homeViewModel.selectedSite);
        }
        
        self.hide = function (e) {            
            self.setSelectedResult(null);
            self.SetDataSource([]);
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
            
            return false;
        }
        
        self.editProperties = function () {
            if(self.selectedResult)
            {
                // navigate to properties page with properties from result                    
            }
        }
        
        self.navigateToResult = function (selection) {
            var dfd = $.Deferred(), 
                service,
                logonService;
            
            if(selection && homeViewModel.selectedSite)
            {
                window.App.loading = "<h1>" + system.strings.loading + "</h1>";
                self.isBusy(true);
                
                service = new documentService(selection.url);        
                logonService = LogonServiceFactory.createLogonService(homeViewModel.selectedSite.url, homeViewModel.selectedSite.credential.credentialType);

                logonPromise = logonService.logon(homeViewModel.selectedSite.credential.domain, 
                                                  homeViewModel.selectedSite.credential.userName, 
                                                  homeViewModel.selectedSite.credential.password,
                                                  selection.url);
            
                logonPromise.done(function (result) {
                    getDisplayFormUrlPromise = service.getDisplayFormUrl();
                
                    getDisplayFormUrlPromise.done(function (result) {                    
                        self.isBusy(false);
                        
                        self.windowRef = window.open(result, "_blank");
						dfd.resolve();
                    });
                    
                    getDisplayFormUrlPromise.fail(function (error) {
                        self.isBusy(false);
                        
                        dfd.reject(error);
                    });
                });
                
                logonPromise.fail(function (error) {
                    self.isBusy(false);
                    
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
            self.isBusy(true);
            
            service = new QueryServiceFactory.getQueryService(searchSite.url, searchSite.majorVersion);
            logonService = LogonServiceFactory.createLogonService(searchSite.url, searchSite.credential.credentialType);
            
            logonPromise = logonService.logon(searchSite.credential.domain, searchSite.credential.userName, searchSite.credential.password);
            
            logonPromise.done(function (result) {
                
                searchPromise = service.keywordSearch(searchSite.keyword().split(" "), keywordConjunction.and, true);
                
                searchPromise.done(function (result) {
                    self.SetDataSource(result);
                    
                    dfd.resolve(true);
                    
                    self.isBusy(false);
                });
                
                searchPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {				
                    dfd.reject(errorThrown);
                    
                    self.isBusy(false);
                });
            });
            
            logonPromise.fail(function (error) {
                dfd.reject(error);
                
                self.isBusy(false);
            });
            
            return dfd.promise();
        }
            
        return self;
    };
    
    return resultsViewModel;
});
