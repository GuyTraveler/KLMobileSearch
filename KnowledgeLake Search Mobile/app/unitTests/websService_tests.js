/*global QUnit*/
define(["services/sharepoint/websService", 
		"ntlm",
		"unitTests/unitTestSettings"],
    function (websService, ntlm, TestSettings) {
        QUnit.module("Testing websService");
        
        
        QUnit.test("Test can instantiate websService", function () {
            //arrange
            var service;
            
            //act
            service = new websService("");
            
            //assert
            QUnit.ok(service);
        });

        QUnit.asyncTest("Test webs bad URL returns error", function () {
            //arrange
            var service,
                url = "http://www.knowledgggglake.com";
            
            //act
            service = new websService(url);
            
            //assert
            QUnit.ok(service);
            
            service.GetWeb(url)
				.done(function (result) {
	                QUnit.ok(false, "GetWeb was successful when it should have been 404");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.notEqual(XMLHttpRequest.status, 200);
	                QUnit.start();
	            });
        });
        
          
        QUnit.asyncTest("Test siteData GOOD URL, BAD CREDS returns 401: unauthorized (NTLM)", function () {
            //arrange
            var service;
            
            //act
            service = new websService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials("ffff", "fff", "fff");
            ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            
            service.GetWeb(TestSettings.ntlmTestUrl)
				.done(function (result) {
	                QUnit.ok(false, "GetWeb was successful when it should have been 401");
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
                authResult = false;
            
            //act
            service = new websService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetWeb(TestSettings.ntlmTestUrl)
				.done(function (result) {
	                QUnit.ok(true, "GetWeb was successful");
	                QUnit.ok(TestSettings.ntlmTestUrl, result.GetWebResult.Web.Url, "Found URL in response");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false,  "GetWeb failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });           
        });
                 
        QUnit.asyncTest("Test siteData GOOD URL, GOOD CREDS with trailing '/' returns 200 (NTLM)", function () {
            //arrange
            var service,
                authResult = false;
            
            //act
            service = new websService(TestSettings.ntlmTestUrl);
            ntlm.setCredentials(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
            authResult = ntlm.authenticate(service.serviceUrl);
            
            //assert
            QUnit.ok(service);
            QUnit.ok(authResult);
            
            service.GetWeb(TestSettings.ntlmTestUrl)
				.done(function (result) {
	                QUnit.ok(true, "GetWeb was successful");
	                QUnit.ok(TestSettings.ntlmTestUrl, result.GetWebResult.Web.Url, "Found URL in response");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false,  "GetWeb failed with result: " + XMLHttpRequest.status);
	                QUnit.start();
	            });           
        });
        
         
        QUnit.asyncTest("Test siteData GOOD URL, BAD CREDS returns error (O365)", function () {
            //arrange
            var service;
            
            //act
            service = new websService(TestSettings.adfsInvalidUrl);
            deleteAllCookies();
                        
            //assert
            QUnit.ok(service);
            
            service.GetWeb(TestSettings.adfsInvalidUrl)
				.done(function (result) {
	                QUnit.ok(false, "GetWeb was successful when it should have been 401");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(true, "GetWeb failed with no credentials supplied");
	                QUnit.start();
	            });
        });
        
        QUnit.asyncTest("Test siteData GOOD URL, BAD CREDS returns error (O365)", function () {
            //arrange
            var service;
            
            //act
            service = new websService(TestSettings.ntlmTestUrl);
                        
            //assert
            QUnit.ok(service);
            
            service.GetActivatedFeatures()
				.done(function (result) {
	                QUnit.ok(true, "GetActivatedFeatures was successful");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false, "GetActivatedFeatures failed");
	                QUnit.start();
	            });
        });
        
        
        function deleteAllCookies() {
            var cookies = document.cookie.split(";");
        
            for (var i = 0; i < cookies.length; i++) {
            	var cookie = cookies[i];
            	var eqPos = cookie.indexOf("=");
            	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
    });
