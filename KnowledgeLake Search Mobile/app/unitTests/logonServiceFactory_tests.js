/*global QUnit*/
define(['domain/credentialType',
		'factory/logonServiceFactory',
		'services/ntlmLogonService',
		'services/office365LogonService',
		'services/adfs365LogonService',
		'services/formsLogonService',
		'unitTests/unitTestSettings'],
    function (credentialType, logonServiceFactory, ntlmLogonService, office365LogonService, adfs365LogonService, formsLogonService, TestSettings) {
        QUnit.module("Testing factory/logonServiceFactory");

		QUnit.test("Test logonServiceFactory OK", function () {
			//arrange
						
			//act
			
			//assert
			QUnit.ok(logonServiceFactory);
			QUnit.equal(typeof logonServiceFactory, 'object');
        });
		
		QUnit.test("Test FBA site obtains formsLogonService", function () {
			//arrange
			var service;
			
			//act
			service = logonServiceFactory.createLogonService(TestSettings.fbaTestUrl, credentialType.claimsOrForms);
			
			//assert
			QUnit.ok(service);
			QUnit.equal(service.constructor, formsLogonService);
        });
		
		QUnit.test("Test FBA site obtains formsLogonService 2", function () {
			//arrange
			var service;
			
			//act
			service = logonServiceFactory.createLogonService(TestSettings.fbaTestUrl, credentialType.claimsOrForms, false, "");
			
			//assert
			QUnit.ok(service);
			QUnit.equal(service.constructor, formsLogonService);
        });
		
		QUnit.test("Test NTLM site obtains ntlmLogonService", function () {
			//arrange
			var service;
			
			//act
			service = logonServiceFactory.createLogonService(TestSettings.ntlmTestUrl, credentialType.ntlm);
			
			//assert
			QUnit.ok(service);
			QUnit.equal(service.constructor, ntlmLogonService);
        });
		
		QUnit.test("Test office 365 Std site obtains office365LogonService", function () {
			//arrange
			var service;
			
			//act
			service = logonServiceFactory.createLogonService(TestSettings.claimsTestUrl, credentialType.claimsOrForms, true);
			
			//assert
			QUnit.ok(service);
			QUnit.equal(service.constructor, office365LogonService);
        });
			
		QUnit.test("Test office 365 Std site obtains office365LogonService 2", function () {
			//arrange
			var service;
			
			//act
			service = logonServiceFactory.createLogonService(TestSettings.claimsTestUrl, credentialType.claimsOrForms, true, "");
			
			//assert
			QUnit.ok(service);
			QUnit.equal(service.constructor, office365LogonService);
        });
			
		QUnit.test("Test ADFS 365 Std site obtains adfs365LogonService", function () {
			//arrange
			var service;
			
			//act
			service = logonServiceFactory.createLogonService(TestSettings.adfsTestUrl, credentialType.claimsOrForms, true, TestSettings.adfsSTSTestUrl);
			
			//assert
			QUnit.ok(service);
			QUnit.equal(service.constructor, adfs365LogonService);
        });
			
	});