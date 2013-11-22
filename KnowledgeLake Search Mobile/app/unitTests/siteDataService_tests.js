/*global QUnit*/
//explicitly request siteDataService
define(["services/sharepoint/siteDataService", 
		"domain/site",
		"domain/credentialType",
		"domain/credential",
		"unitTests/unitTestSettings"],
    function (siteDataService, site, credentialType, credential, TestSettings) {
		QUnit.module("Testing siteDataService");
       
        QUnit.test("Test can instantiate siteDataService", function () {
            //arrange
            var service;
            
            //act
            service = new siteDataService("");
            
            //assert
            QUnit.ok(service);
        });
        
        QUnit.asyncTest("Test siteDataService with non-existent soap template fails", function () {
            //arrange
            var service,
				servicePromise;
            
            //act
            service = new siteDataService("");
           
            //assert
            QUnit.ok(service);
                         
            service.BadMethod = function () {
                return this.executeSoapMethodAsync(arguments, null);
			};
			
			servicePromise = service.BadMethod();
			
			servicePromise.done(function (result) {
                QUnit.ok(false, "BadMethod should have failed");
                QUnit.start();
            });
			
            servicePromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.ok(true);
                QUnit.start();
            });
            
            service.BadMethod();
        });
        
        QUnit.asyncTest("Test siteData bad URL returns error", function () {
            //arrange
            var service,
				testSite = new site("http://www.knowledgggglake.com", TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new siteDataService(testSite);
            
            //assert
            QUnit.ok(service);
            
            service.GetSiteUrlAsync(testSite.url)
				.done(function (result) {
	                QUnit.ok(false, "GetSiteUrlAsync was successful when it should have been 404");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.notEqual(XMLHttpRequest.status, 200);
	                QUnit.start();
	            });
        });
        
          
        QUnit.asyncTest("Test siteData GOOD URL, BAD CREDS returns 401: unauthorized (NTLM)", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, "sdaf", "asdfsad", "asdfsadf"), false, "");
            
            //act
            service = new siteDataService(testSite);
            
            //assert
            QUnit.ok(service);
            
            service.GetSiteUrlAsync(testSite.url)
				.done(function (result) {
	                QUnit.ok(false, "GetSiteUrlAsync was successful when it should have been 401");
	                QUnit.start();
	            })
	            .fail(function (response) {
	                QUnit.equal(response.error, 401);
	                QUnit.start();
	            });
        });
        
              
        QUnit.asyncTest("Test siteData GOOD URL, GOOD CREDS returns 200 (NTLM)", function () {
            //arrange
            var service,
                testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new siteDataService(testSite);
            
            //assert
            QUnit.ok(service);
            
            service.GetSiteUrlAsync(testSite.url)
				.done(function (result) {
	                QUnit.ok(true, "GetSiteUrlAsync was successful");
	                QUnit.equal(testSite.url, result.siteUrl.value, "Found URL in response");
	                QUnit.start();
	            })
	            .fail(function (response) {
	                QUnit.ok(false,  "GetSiteUrlAsync failed with result: " + response.error);
	                QUnit.start();
	            });
        });
		
		QUnit.asyncTest("Test siteData.GetURLSegments returns valid result", function () {
            //arrange
            var service,
                testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, ""),
				itemUrl = "http://prodsp2010.dev.local/sites/team4/TestLib/1bf7a0e8-fcd2-4363-be2e-cb5b09269e39.tif";
            
            //act
            service = new siteDataService(testSite);
            
            //assert
            QUnit.ok(service);
            
            service.GetURLSegmentsAsync(itemUrl)
				.done(function (result) {
	                QUnit.ok(true, "GetURLSegments was successful");
					QUnit.ok(result);
					QUnit.ok(result.GetURLSegmentsResult);
					QUnit.ok(result.strItemID);
					QUnit.ok(result.strListID);
					
					QUnit.equal(result.strItemID.value.toUpperCase(), TestSettings.testItemId.toUpperCase());
					QUnit.equal(result.strListID.value.toUpperCase(), TestSettings.testListId.toUpperCase());
	                
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false,  "GetURLSegments failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
			
		QUnit.asyncTest("Test siteData.GetURLSegments with invalid itemURL fails gracefully", function () {
            //arrange
            var service,
                testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, ""),
				itemUrl = "http://prodsp2dfasdf010.dev.locfdfal/sites/team4/TestLib/hhhhhhh/fdsfasdfsf.tif";
            
            //act
            service = new siteDataService(testSite);
            
            //assert
            QUnit.ok(service);
            
            service.GetURLSegmentsAsync(itemUrl)
				.done(function (result) {
	                QUnit.ok(false, "GetURLSegments should have failed");					
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true,  "GetURLSegments failed gracefully with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
		
    });
