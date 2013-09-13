/*global QUnit*/
define(['services/ntlmLogonService',
		'unitTests/unitTestSettings'],
    function (ntlmLogonService, TestSettings) {
		QUnit.module("Testing ntlmLogonService");

        QUnit.test("test can ntlmLogonService initializes properly", function () {
            //arrange
            var service;
			
            //act 
			service = new ntlmLogonService();
                        
            //assert
            QUnit.ok(service);
        });  
		
		QUnit.asyncTest("test ntlmLogonService.logon with good URL bad CREDS fails", function () {
            //arrange
            var service,
				logonPromise;
			
            //act 
			service = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = service.logonAsync("", "", "");
                        
            //assert
            QUnit.ok(logonPromise);
			
			logonPromise.done(function () {
				QUnit.ok(false, "logon should have failed with bad credentials");
				QUnit.start();
            });
			
			logonPromise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });  
		
		//NOTE: we aren't currently controlling coookies, so if the user is ALREADY authenticated before 
		//we logon, the status will still return true
		QUnit.asyncTest("test ntlmLogonService.checkLogonStatus succeeds", function () {
            //arrange
            var service,
				logonPromise,
				checkLogonPromise;
			
            //act 
			service = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = service.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
                        
            //assert
            QUnit.ok(logonPromise);
			
			logonPromise.done(function () {
				checkLogonPromise = service.checkLogonStatusAsync();
				
				QUnit.ok(checkLogonPromise);
				
				checkLogonPromise.done(function () {
					QUnit.ok(true);
					QUnit.start();
                });
				
				checkLogonPromise.fail(function () {
					QUnit.ok(false, "NTLMLogonService should have returned false to checkLogonStatus");	
					QUnit.start();
                });											
            });
			
			logonPromise.fail(function () {
				QUnit.ok(false, "logon should have succeeded");
				QUnit.start();
            });
        });  
		
		QUnit.asyncTest("test ntlmLogonService.logon with bad URL fails", function () {
            //arrange
            var service,
				logonPromise;
			
            //act 
			service = new ntlmLogonService("http://");
			logonPromise = service.logonAsync("", "", "");
                        
            //assert
            QUnit.ok(logonPromise);
			
			logonPromise.done(function () {
				QUnit.ok(false, "logon should have failed with bad url");
				QUnit.start();
            });
			
			logonPromise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });  
		
		QUnit.asyncTest("test ntlmLogonService.logon fails against CLAIMS site", function () {
            //arrange
            var service,
				logonPromise;
			
            //act 
			service = new ntlmLogonService(TestSettings.claimsTestUrl);
			logonPromise = service.logonAsync("", "", "");
                        
            //assert
            QUnit.ok(logonPromise);
			
			logonPromise.done(function () {
				QUnit.ok(false, "logon should have failed against claims");
				QUnit.start();
            });
			
			logonPromise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });  
		
		QUnit.asyncTest("test ntlmLogonService.logon with good URL good CREDS succeeds", function () {
            //arrange
            var service,
				logonPromise;
			
            //act 
			service = new ntlmLogonService(TestSettings.ntlmTestUrl);
			logonPromise = service.logonAsync(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
                        
            //assert
            QUnit.ok(logonPromise);
			
			logonPromise.done(function () {
				QUnit.ok(true);
				QUnit.start();
            });
			
			logonPromise.fail(function () {
				QUnit.ok(false, "NTLM logon should have been successful");
				QUnit.start();
            });
        }); 	
	});