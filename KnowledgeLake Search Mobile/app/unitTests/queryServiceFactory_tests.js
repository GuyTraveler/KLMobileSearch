/*global QUnit*/
define(["factory/queryServiceFactory",
		"services/sqlQueryService",
		"services/kqlQueryService",
		"domain/site",
		"domain/credentialType",
		"domain/credential",
		"unitTests/unitTestSettings"],
    function (QueryServiceFactory, sqlQueryService, kqlQueryService, site, credentialType, credential, TestSettings) {
		QUnit.module("Testing factory/queryServiceFactory");

        QUnit.test("test queryServiceFactory initialized", function () {
            //arrange
            
            //act 
                        
            //assert
            QUnit.ok(QueryServiceFactory);
        });  
      
        QUnit.test("test queryServiceFactory returns sqlQueryService for < 15", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, 14, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
			
            //act 
			service = QueryServiceFactory.getQueryService(testSite);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof sqlQueryService);
        });  
      
        QUnit.test("test queryServiceFactory returns kqlQueryService for == 15", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, 15, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
			
            //act 
			service = QueryServiceFactory.getQueryService(testSite);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof kqlQueryService);
        });  
      
        QUnit.test("test queryServiceFactory returns kqlQueryService for > 15", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, 16, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
			
            //act 
			service = QueryServiceFactory.getQueryService(testSite);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof kqlQueryService);
        });  
      
        QUnit.test("test queryServiceFactory returns service even for bad URL", function () {
            //arrange
            var service,
				testSite = new site(null, TestSettings.siteTitle, 12, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
			
            //act 
			service = QueryServiceFactory.getQueryService(testSite);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof sqlQueryService);
        });  
      
        QUnit.test("test queryServiceFactory returns sqlQueryService for bad version", function () {
            //arrange
            var service,
				testSite = new site(null, TestSettings.siteTitle, "g", new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
			
            //act 
			service = QueryServiceFactory.getQueryService(testSite);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof sqlQueryService);
        });  
      
	});