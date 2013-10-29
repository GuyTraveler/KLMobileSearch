/*global QUnit*/
//explicit request to authenticationService
define(["jquery",
		"services/sharepoint/authenticationService", 
		"domain/authenticationMode",
		"unitTests/unitTestSettings"],
    function ($, authenticationService, authenticationMode, TestSettings) {
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
            
            service.Mode(url)
				.done(function (result) {
	                QUnit.ok(false, "Mode was successful when it should have been 404");
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.notEqual(XMLHttpRequest.status, 200);
	                QUnit.start();
	            });
        });
                
        QUnit.asyncTest("Test authentication Windows Auth returns Windows", function () {
            //arrange
            var service,
                url = "http://prodsp2010.dev.local/sites/team4";
            
            //act
            service = new authenticationService(url);
            
            //assert
            QUnit.ok(service);
            
            service.Mode(url)
				.done(function (result) {
	                var mode = result.ModeResult.value;
	                
	                QUnit.equal(mode, authenticationMode.Windows);
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
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
            
            service.Mode(url)
				.done(function (result) {
	                var mode = result.ModeResult.value;
	                
	                QUnit.equal(mode, authenticationMode.ClaimsOrForms);
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
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
            
            service.Mode(url)
				.done(function (result) {
	                var mode = result.ModeResult.value;
	                
	                QUnit.equal(mode, authenticationMode.ClaimsOrForms);
	                QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.notEqual(XMLHttpRequest.status, 200);
	                QUnit.start();
	            });
        });        
		
		QUnit.asyncTest("Test authentication.Login can log into FBA site with good creds", function () {
            //arrange
            var service;
            
            //act
            service = new authenticationService(TestSettings.fbaTestUrl);
            
            //assert
            QUnit.ok(service);
            
            service.Login(TestSettings.fbaTestUser, TestSettings.fbaTestPassword)
				.done(function (result) {
	                QUnit.ok(result);
					QUnit.ok(result.LoginResult);
					QUnit.ok(result.LoginResult.CookieName);
					QUnit.ok(result.LoginResult.CookieName.value);
					QUnit.equal(result.LoginResult.CookieName.value, "FedAuth");
					
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false, "FBA logon failed and should have succeeded");
	                QUnit.start();
	            });
        });        
		
		//NOTE: do not make a test with a GOOD user name and BAD password.  It will cause the user to get locked out
		QUnit.asyncTest("Test authentication.Login fails with bad creds", function () {
            //arrange
            var service;
            
            //act
			service = new authenticationService(TestSettings.fbaTestUrl);

			//assert
            service.Login("fdasfsdf", TestSettings.fbaTestPassword)
				.done(function (result) {
	                QUnit.ok(result);
					QUnit.ok(result.LoginResult);
					QUnit.ok(!result.LoginResult.CookieName);
					
					QUnit.start();
	            })
	            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
	                QUnit.ok(false, "Fatal error in FBA login test");
	                QUnit.start();
	            });
        });        
    });
