/*global QUnit*/
define(["services/sharepoint/siteDataService", "ntlm"],
    function (siteDataService, ntlm) {
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
            var service;
            
            //act
            service = new siteDataService("");
           
            //assert
            QUnit.ok(service);
                         
            service.BadMethod = function () {
                this.executeSoapMethod("BadMethod", null, function (result) {
                    QUnit.ok(false, "BadMethod should have failed");
                    QUnit.start();
                },
                function (XMLHttpRequest, textStatus, errorThrown) {
                    QUnit.ok(true);
                    QUnit.start();
                });
            };
            
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
            
            service.GetSiteUrl(url, function (result) {
                QUnit.ok(false, "GetSiteUrl was successful when it should have been 404");
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
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
            
            service.GetSiteUrl(url, function (result) {
                QUnit.ok(false, "GetSiteUrl was successful when it should have been 401");
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
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
            
            service.GetSiteUrl(url, function (result) {
                var stringResult = (new XMLSerializer()).serializeToString(result);
                
                QUnit.ok(true, "GetSiteUrl was successful");
                QUnit.ok(stringResult.indexOf(url) > -1, "Found URL in response");
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.ok(false,  "GetSiteUrl failed with result: " + XMLHttpRequest.status);
                QUnit.start();
            });
        });
    });
