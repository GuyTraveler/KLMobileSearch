/*global QUnit*/
define(['jquery',
		'domain/Constants',
		'services/adfs365LogonService',
		'unitTests/unitTestSettings'],
    function ($, Constants, adfs365LogonService, TestSettings) {
        QUnit.module("Testing services/adfs365LogonService");

		QUnit.test("Test adfs365LogonService is available", function () {
			//arrange
			
			//act
			
			//assert
			QUnit.ok(adfs365LogonService);
        });
		
		
		QUnit.test("Test adfs365LogonService.getUserNameMixedUrl returns expected value", function () {
			//arrange
			var service,
				userNameMixedUrl,
				expected = Constants.adfsTrust2005WindowsTransport.replace("{adfsHost}", TestSettings.adfsSTSTestUrlHost);
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			userNameMixedUrl = service.getUserNameMixedUrl();
			
			//assert
			QUnit.equal(userNameMixedUrl, expected);
        });
		
		
		QUnit.asyncTest("Test adfs365LogonService.postSAMLToAdfs succeeds with good credentials", function () {
			//arrange
			var service,
				promise,
				userNameMixedUrl;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			userNameMixedUrl = service.getUserNameMixedUrl();
			promise = service.postSAMLToAdfs(userNameMixedUrl, TestSettings.adfsTestDomain, TestSettings.adfsTestUser, TestSettings.adfsTestPassword);
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(false, "postSAMLToAdfs should have succeeded");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test adfs365LogonService.postSAMLToAdfs fails with bad URL", function () {
			//arrange
			var service,
				promise,
				userNameMixedUrl;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			userNameMixedUrl = service.getUserNameMixedUrl();
			promise = service.postSAMLToAdfs(userNameMixedUrl + "dafdsf", TestSettings.adfsTestDomain, TestSettings.adfsTestUser, TestSettings.adfsTestPassword);
			
			//assert
			promise.done(function (result) {
				QUnit.ok(false, "postSAMLToAdfs should have failed with bad URL");
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test adfs365LogonService.parseAssertionFromXml works with good credentials/good assertion", function () {
			//arrange
			var service,
				promise,
				userNameMixedUrl,
				assertion;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			userNameMixedUrl = service.getUserNameMixedUrl();
			promise = service.postSAMLToAdfs(userNameMixedUrl, TestSettings.adfsTestDomain, TestSettings.adfsTestUser, TestSettings.adfsTestPassword);
			
			//assert
			promise.done(function (result) {
				assertion = service.parseAssertionFromXml(result);
				
				QUnit.ok(assertion);
				QUnit.notEqual(assertion.length, 0);
				
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(false, "postSAMLToAdfs should have succeeded");
				QUnit.start();
            });
        });
		
		QUnit.test("Test adfs365LogonService.parseAssertionFromXml fails with bad assertion data", function () {
			//arrange
			var service,
				assertion;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			assertion = service.parseAssertionFromXml("Asdfsdf");
			
			//assert
			QUnit.ok(!assertion);
        });
		
		
		QUnit.asyncTest("Test adfs365LogonService.getSamlAdfsTemplateAsync works twice", function () {
			//arrange
			var service,
				promise1,
				promise2;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			promise1 = service.getSamlAdfsTemplateAsync();
			
			//assert
			promise1.done(function (result1) {
				QUnit.ok(result1);
				
				promise2 = service.getSamlAdfsTemplateAsync();
				
				promise2.done(function (result2) {
					QUnit.ok(result2);
					QUnit.equal(result2, result1);
					QUnit.start();
                });
				
				promise2.fail(function () {
					QUnit.ok(false, "getSamlAdfsTemplateAsync failed (pass 2)");
					QUnit.start();
                });
            });
			
			promise1.fail(function () {
				QUnit.ok(false, "getSamlAdfsTemplateAsync failed (pass 1)");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test adfs365LogonService.getSamlAssertionTemplateAsync works twice", function () {
			//arrange
			var service,
				promise1,
				promise2;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			promise1 = service.getSamlAssertionTemplateAsync();
			
			//assert
			promise1.done(function (result1) {
				QUnit.ok(result1);
				
				promise2 = service.getSamlAssertionTemplateAsync();
				
				promise2.done(function (result2) {
					QUnit.ok(result2);
					QUnit.equal(result2, result1);
					QUnit.start();
                });
				
				promise2.fail(function () {
					QUnit.ok(false, "getSamlAssertionTemplateAsync failed (pass 2)");
					QUnit.start();
                });
            });
			
			promise1.fail(function () {
				QUnit.ok(false, "getSamlAssertionTemplateAsync failed (pass 1)");
				QUnit.start();
            });
        });
		
		
		QUnit.asyncTest("Test adfs365LogonService.postAssertionToOffice365STS works with good credentials/good assertion", function () {
			//arrange
			var service,
				stsPromise,
				office365Promise,
				userNameMixedUrl,
				assertion;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			userNameMixedUrl = service.getUserNameMixedUrl();
			stsPromise = service.postSAMLToAdfs(userNameMixedUrl, TestSettings.adfsTestDomain, TestSettings.adfsTestUser, TestSettings.adfsTestPassword);
			
			//assert
			stsPromise.done(function (result) {
				assertion = service.parseAssertionFromXml(result);
				
				QUnit.ok(assertion);
				QUnit.notEqual(assertion.length, 0);
				
				office365Promise = service.postAssertionToOffice365STS(assertion);
				
				office365Promise.done(function (result2) {
					QUnit.ok(result2);
					QUnit.start();
				});
				
				office365Promise.fail(function () {
					QUnit.ok(false, "postAssertionToOffice365STS should have succeeded");
					QUnit.start();
                });
            });
			
			stsPromise.fail(function () {
				QUnit.ok(false, "postSAMLToAdfs should have succeeded");
				QUnit.start();
            });
        });
			
		QUnit.asyncTest("Test adfs365LogonService.postAssertionToOffice365STS fails with bad assertion", function () {
			//arrange
			var service,
				office365Promise;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			office365Promise = service.postAssertionToOffice365STS("asdfasdfs");
				
			office365Promise.done(function (result) {
				QUnit.ok(false, "postAssertionToOffice365STS should have failed");
				QUnit.start();
			});
			
			office365Promise.fail(function () {
				QUnit.ok(true);	
				QUnit.start();
            });
        });
		
		
		
		
		QUnit.asyncTest("Test adfs365LogonService.logonAsync works with valid credentials", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			promise = service.logonAsync(TestSettings.adfsTestDomain, TestSettings.adfsTestUser, TestSettings.adfsTestPassword);
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.start();	
            });
			
			promise.fail(function () {
				QUnit.ok(false, "adfs logon failed");
				QUnit.start();
            });
        });
		
			
		QUnit.asyncTest("Test adfs365LogonService.logonAsync fails with invalid credentials", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new adfs365LogonService(TestSettings.adfsTestUrl, TestSettings.adfsSTSTestUrl);
			promise = service.logonAsync(TestSettings.adfsTestDomain, "dsafsdf", "Sadfsdfs");
			
			//assert
			promise.done(function (result) {
				QUnit.ok(false, "adfs logon should have failed");
				QUnit.start();	
            });
			
			promise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });
	});