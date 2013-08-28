define(["framework/logLevel"], function(logLevel) {
	
    var isUnitTesting = false, 
	    loggingLevel = logLevel.Verbose;
	 
	var config = {           
	   baseUrl: 'app/',
	   paths: {
		   //lib
	       jquery: 'lib/jquery',
	       kendoMain: 'lib/kendo.mobile.min',
	       knockout: 'lib/knockout',	       
	       ntlm: 'lib/ntlm',
	       i18n: 'lib/i18n',
		   jsUri: 'lib/jsUri'
       },
	   shim: {
	       jquery: {
	           exports: 'jquery'
	       },
	       knockout: {
	           exports: 'ko'  
	       },
	       kendoMain: {
	           deps: ['jquery'],
	           exports: 'kendoMain'               
	       },
		   jsUri: {
			   exports: 'jsUri'
           }
	   },
	   map: {              
		   '*': {
               //factory
			   'kendo': 'factory/kendoFactory',
			   'FileManagement': 'factory/fileManagementFactory',
               
               //framework
			   'system': 'framework/system',
			   'extensions': 'framework/extensions',
			   'Uri': 'jsUri',
			   
               //service locations               
               //sharepoint wrappers
			   'IAuthenticationService': 'services/sharepoint/authenticationService',
			   'IWebsService': 'services/sharepoint/websService',
			   'ISiteDataService': 'services/sharepoint/siteDataService',
               'ISearchService': 'services/sharepoint/searchService',
			   'IListsService': 'services/sharepoint/listsService',
               
               //ours
			   'ISiteDataCachingService': 'services/siteDataCachingService',             
			   'INtlmLogonService': 'services/ntlmLogonService',
			   'IClaimsLogonService': 'services/claimsLogonService',
			   'IDocumentService': 'services/documentService'
	       }
	   },
	   logLevel: loggingLevel,
	   /******custom configuration*******/
	   /*       config: {
	       i18n: {
	           locale: 'es'
	       }  
	   },*/
	   isQunit: isUnitTesting
	};
	
	return config;
});
