/*global QUnit*/
define(["services/sharepoint/authenticationService", "ntlm", "domain/authenticationMode"],
    function (authenticationService, ntlm, authenticationMode) {
        QUnit.module("Testing authenticationService");
        
        
        QUnit.test("Test can instantiate authenticationService", function () {
            //arrange
            var service;
            
            //act
            service = new authenticationService("");
            
            //assert
            QUnit.ok(service);
        });

        QUnit.asyncTest("Test authentication bad URL returns error", function () {
            //arrange
            var service,
                url = "http://www.knowledgggglake.com";
            
            //act
            service = new authenticationService(url);
            
            //assert
            QUnit.ok(service);
            
            service.Mode(url, function (result) {
                QUnit.ok(false, "Mode was successful when it should have been 404");
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.notEqual(XMLHttpRequest.status, 200);
                QUnit.start();
            });
        });
                
        //TODO: test a couple of Claims sites also
        QUnit.asyncTest("Test authentication Windows Auth returns Windows", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4";
            
            //act
            service = new authenticationService(url);
            
            //assert
            QUnit.ok(service);
            
            service.Mode(url, function (result) {
                var mode = $(result).find("ModeResult").text();
                
                QUnit.equal(mode, authenticationMode.Windows);
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.notEqual(XMLHttpRequest.status, 200);
                QUnit.start();
            });
        });        
        
        QUnit.asyncTest("Test authentication Office 365 returns Forms", function () {
            //arrange
            var service,
                url = "https://knowledgelake.sharepoint.com";
            
            //act
            service = new authenticationService(url);
            
            //assert
            QUnit.ok(service);
            
            service.Mode(url, function (result) {
                var mode = $(result).find("ModeResult").text();
                
                QUnit.equal(mode, authenticationMode.ClaimsOrForms);
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.notEqual(XMLHttpRequest.status, 200);
                QUnit.start();
            });
        });        
        
            
        QUnit.asyncTest("Test authentication Office 365 (ADFS) returns Forms", function () {
            //arrange
            var service,
                url = "https://kl.sharepoint.com";
            
            //act
            service = new authenticationService(url);
            
            //assert
            QUnit.ok(service);
            
            service.Mode(url, function (result) {
                var mode = $(result).find("ModeResult").text();
                
                QUnit.equal(mode, authenticationMode.ClaimsOrForms);
                QUnit.start();
            },
            function (XMLHttpRequest, textStatus, errorThrown) {
                QUnit.notEqual(XMLHttpRequest.status, 200);
                QUnit.start();
            });
        });        
    });
