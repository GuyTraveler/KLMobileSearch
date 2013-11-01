/*global QUnit*/
define(["services/sharepoint/websService", 
		"domain/site",
		"domain/credentialType",
		"domain/credential",
		"unitTests/unitTestSettings"],
    function (websService, site, credentialType, credential, TestSettings) {
        QUnit.module("Testing websService");
		        
        
        QUnit.test("Test can instantiate websService", function () {
            //arrange
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new websService(testSite);
            
            //assert
            QUnit.ok(service);
        });

        QUnit.asyncTest("Test webs bad URL returns error", function () {
            //arrange
            var service,
                testSite = new site("http://www.knowledgggglake.com", TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new websService(testSite);
            
            //assert
            QUnit.ok(service);
            
            service.GetWeb(testSite.url)
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
            var service,
				testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, "d", "d", TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new websService(testSite);
            
            //assert
            QUnit.ok(service);
            
            service.GetWeb(TestSettings.ntlmTestUrl)
				.done(function (result) {
	                QUnit.ok(false, "GetWeb was successful when it should have been 401");
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
            service = new websService(testSite);
            
            //assert
            QUnit.ok(service);
            
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
                testSite = new site(TestSettings.ntlmTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain), false, "");
            
            //act
            service = new websService(testSite);
            
            //assert
            QUnit.ok(service);
            
            service.GetWeb(TestSettings.ntlmTestUrl + "/")
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
            var service,
				testSite = new site(TestSettings.adfsTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, new credential(credentialType.claimsOrForms, "asdfasdf", TestSettings.adfsTestPassword, TestSettings.adfsTestDomain), true, TestSettings.adfsSTSTestUrl);
            
            //act
            service = new websService(testSite);
            deleteAllCookies();
                        
            //assert
            QUnit.ok(service);
            
            service.GetWeb(TestSettings.adfsTestUrl)
				.done(function (result) {
	                QUnit.ok(false, "GetWeb was successful when it should have been 401");
	                QUnit.start();
	            })
	            .fail(function (response) {
	                QUnit.equal(response.error, 401);
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
