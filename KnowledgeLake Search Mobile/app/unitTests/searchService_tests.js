/*global QUnit*/
//explicit request to searchService
define(["services/sharepoint/searchService",
		"domain/site",
		"domain/credentialType",
		"domain/credential",
		"unitTests/unitTestSettings",
		"unitTests/unitTestSettings"],
    function (searchService, site, credentialType, credential, TestSettings) {
		QUnit.module("Testing searchService");
        
        
        QUnit.test("Test can instantiate searchService", function () {
            //arrange
            var service;
            
            //act
            service = new searchService("");
            
            //assert
            QUnit.ok(service);
        });
		
		QUnit.asyncTest("Test can get sharepoint search status", function () {
			//arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new searchService(testSite);
			
            //assert
			service.Status()
				.done(function (result) {
					QUnit.ok(result && result.StatusResult && result.StatusResult.value);
					QUnit.ok(result.StatusResult.value == "ONLINE" || result.StatusResult.value == "OFFLINE");
					QUnit.start();
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(false, "search status failed to be obtained");
					QUnit.start();
                });
        });
		
		QUnit.asyncTest("Test can get sharepoint search status vs. bad URL fails gracefully", function () {
			//arrange
            var service,
				testSite = new site("http://dfdf", TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new searchService(testSite);
			
            //assert
			service.Status()
				.done(function (result) {
					QUnit.ok(false, "searchService.Status should have failed");
					QUnit.start();
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(true);
					QUnit.start();
                });				
        });

		QUnit.asyncTest("Test can GetSearchMetadata", function () {
			//arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new searchService(testSite);
			
            //assert
			service.GetSearchMetadata()
				.done(function (result) {
					QUnit.ok(result && result.GetSearchMetadataResult);
					QUnit.ok(typeof result.GetSearchMetadataResult === 'object');
					QUnit.start();
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(false, "GetSearchMetadata failed");
					QUnit.start();
                });
        });
		
		QUnit.asyncTest("Test can GetSearchMetadata vs. bad url fails gracefully", function () {
			//arrange
            var service,
				testSite = new site("http://dfdf", TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new searchService(testSite);
			
            //assert
			service.GetSearchMetadata()
				.done(function (result) {
					QUnit.ok(false, "searchService.GetSearchMetadata should have failed");
					QUnit.start();
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(true);
					QUnit.start();
                });		
        });
		
		QUnit.asyncTest("Test can issue basic search query", function () {
			//arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new searchService(testSite);
			
            //assert
			service.QueryEx(TestSettings.testQueryXml.replace("{value}", "test"))
				.done(function (result) {
					QUnit.ok(result && result.QueryExResult);
					QUnit.ok(result.QueryExResult['diffgr:diffgram'].Results.RelevantResults)
					QUnit.equal(typeof result.QueryExResult['diffgr:diffgram'].Results.RelevantResults, 'object');
					//
					QUnit.start();
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(false, "QueryEx failed");
					QUnit.start();
                });
        });
		
		QUnit.asyncTest("Test search service with bad url fails gracefully", function () {
			//arrange
            var service,
				testSite = new site("http://dsfasdf", TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new searchService(testSite);
			
            //assert
			service.QueryEx(TestSettings.testQueryXml)
				.done(function (result) {
					QUnit.ok(false, "searchService.QueryEx should have failed");
					QUnit.start();
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(true);
					QUnit.start();
                });			
        });
		
		QUnit.asyncTest("Test empty search query fails gracefully", function () {
			//arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new searchService(testSite);

            //assert
			service.QueryEx(TestSettings.emptyQueryXml)
				.done(function (result) {
					QUnit.ok(false, "QueryEx with empty search should not succeed");
					QUnit.start();
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(true);
					QUnit.start();
                });
        });
		
		QUnit.asyncTest("Test malformed search query fails gracefully", function () {
			//arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new searchService(testSite);
			
            //assert
			service.QueryEx(TestSettings.emptyQueryXml + "fdfd")
				.done(function (result) {
					QUnit.ok(false, "QueryEx with malformed search should not succeed");
					QUnit.start();
                })
				.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(true);
					QUnit.start();
                });
        });	               
    
    });