//dependency injection for unit tests
define([], function() {
   return {              
	   '*': {
		   //mocks
		   'kendo': 'unitTests/mocks/kendoMock',		   
		   'FileManagement': 'unitTests/mocks/fileSystemMock',		  
		   
		   'system': 'framework/system',
		   
		   //service locations
		   'IAuthenticationService': 'services/sharepoint/authenticationService',
		   'IWebsService': 'services/sharepoint/websService',
		   'ISiteDataService': 'services/sharepoint/siteDataService',
		   'ISiteDataCachingService': 'services/siteDataCachingService'
       }
	}
});