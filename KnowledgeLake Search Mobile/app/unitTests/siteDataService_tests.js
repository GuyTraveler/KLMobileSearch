/*global QUnit*/
//explicitly request siteDataService
define(["services/sharepoint/siteDataService", 
		"ntlm",
		"unitTests/unitTestSettings"],
    function (siteDataService, ntlm, TestSettings) {
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
                return this.executeSoapMethod("BadMethod", null);
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
                url = "http://www.knowledgggglake.com";
            
            //act
            service = new siteDataService(url);
            
            //assert
            QUnit.ok(service);
            
            service.GetSiteUrl(url)
				.done(function (result) {
	                QUnit.ok(false, "GetSiteUrl was successful when it should have been 404");
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
                url = "http://prodsp2010.dev.local/sites/team4";
            
            //act
            service = new siteDataService(url);
            ntlm.setCredentials("ffff", "fff", "fff");
            ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            
            service.GetSiteUrl(url)
				.done(function (result) {
	                QUnit.ok(false, "GetSiteUrl was successful when it should have been 401");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.equal(XMLHttpRequest.status, 401);
	                QUnit.start();
	            });
        });
        
              
        QUnit.asyncTest("Test siteData GOOD URL, GOOD CREDS returns 200 (NTLM)", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4",
                authResult = false;
            
            //act
            service = new siteDataService(url);
            ntlm.setCredentials("dev", "spadmin", "password");
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetSiteUrl(url)
				.done(function (result) {
	                QUnit.ok(true, "GetSiteUrl was successful");
	                QUnit.equal(url, result.siteUrl.value, "Found URL in response");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false,  "GetSiteUrl failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });
        });
		
		QUnit.asyncTest("Test siteData.GetURLSegments returns valid result", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4/",
				itemUrl = "http://prodsp2010.dev.local/sites/team4/TestLib/1bf7a0e8-fcd2-4363-be2e-cb5b09269e39.tif",
                authResult = false;
            
            //act
            service = new siteDataService(url);
            ntlm.setCredentials("dev", "spadmin", "password");
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetURLSegments(itemUrl)
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
                url = "http://prodsp2010.dev.local/sites/team4/",
				itemUrl = "http://prodsp2dfasdf010.dev.locfdfal/sites/team4/TestLib/hhhhhhh/fdsfasdfsf.tif",
                authResult = false;
            
            //act
            service = new siteDataService(url);
            ntlm.setCredentials("dev", "spadmin", "password");
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetURLSegments(itemUrl)
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
