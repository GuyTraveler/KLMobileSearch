/*global QUnit*/
define(['jquery',
		'services/office365LogonService',
		'unitTests/unitTestSettings'],
    function ($, office365LogonService, TestSettings) {
        QUnit.module("Testing services/office365LogonService");

		QUnit.test("Test office365LogonService is available", function () {
			//arrange
			
			//act
			
			//assert
			QUnit.ok(office365LogonService);			
        });
		
		QUnit.test("Test office365LogonService initializes properly", function () {
			//arrange
			var service;
			
			//act
			service = new office365LogonService();
			
			//assert
			QUnit.ok(service);			
        });			
		
		QUnit.asyncTest("Test getSamlTemplateAsync returns template twice", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			promise = service.getSamlTemplateAsync();
			
			//assert			
			promise.done(function (template) {
				QUnit.ok(template);
				QUnit.notEqual(template.length, 0);
				
				promise = service.getSamlTemplateAsync();
				
				promise.done(function (template2) {
					QUnit.ok(template2);
					QUnit.equal(template.length, template2.length);
					
					QUnit.start();
	            });
				
				promise.fail(function () {
					QUnit.ok(false, "Failed to get SAML template 2");
					QUnit.start();
	            });
            });
			
			promise.fail(function () {
				QUnit.ok(false, "Failed to get SAML template");
				QUnit.start();
            });
        });
		
		QUnit.test("Test office365LogonService.hasErrorResult == true with empty XML", function () {
			//arrange
			var service,
				xml,
				result;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			xml = "";
			result = service.hasErrorResult(xml);
			
			//assert
			QUnit.equal(result, true);
        });
		
		QUnit.test("Test office365LogonService.hasErrorResult == true with fault in XML", function () {
			//arrange
			var service,
				xml,
				result;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			xml = $.parseXML(TestSettings.claimsFaultXml);
			result = service.hasErrorResult(xml);
			
			//assert
			QUnit.equal(result, true);
        });
			
		QUnit.test("Test office365LogonService.hasErrorResult == false with good XML", function () {
			//arrange
			var service,
				xml,
				result;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			xml = $.parseXML(TestSettings.claimsValidXml);
			result = service.hasErrorResult(xml);
			
			//assert
			QUnit.equal(result, false);
        });
		
		QUnit.test("Test parseBinaryTokenFromXml fails with invalid XML", function () {
			//arrange
			var service,
				token;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			token = service.parseBinaryTokenFromXml("<test<");
			
			//assert
			QUnit.equal(token, "");
        });
		
		QUnit.test("Test parseExpirationFromXml fails with invalid XML", function () {
			//arrange
			var service,
				exp;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			exp = service.parseExpirationFromXml("<test<");
			
			//assert
			QUnit.equal(exp, "");
        });
		
		QUnit.asyncTest("Test office365LogonService.getBinarySecurityTokenAsync works with valid credentials", function () {
			//arrange
			var service,
				promise,
				token,
				expiration;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			promise = service.getBinarySecurityTokenAsync(TestSettings.claimsTestDomainOnly, TestSettings.claimsTestUserOnly, TestSettings.claimsTestPassword);
			
			//assert			
			promise.done(function (result) {
				token = service.parseBinaryTokenFromXml(result);
				expiration = service.parseExpirationFromXml(result);
				
				QUnit.ok(token);
				QUnit.ok(expiration);
				
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(false, "Failed to get SAML template");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365LogonService.getBinarySecurityTokenAsync fails with invalid credentials", function () {
			//arrange
			var service,
				promise,
				token,
				expiration;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			promise = service.getBinarySecurityTokenAsync(TestSettings.testClaimsDomainOnly, "dfasf", TestSettings.testClaimsUserNameOnly);
			
			//assert			
			promise.done(function (result) {
				token = service.parseBinaryTokenFromXml(result);
				expiration = service.parseExpirationFromXml(result);
				
				QUnit.ok(!token);
				QUnit.ok(!expiration);
				
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(true);
				QUnit.ok(!service.logonExpiration);
				
				QUnit.start();
            });
        });
				
		QUnit.asyncTest("Test office365LogonService.logonAsync works with valid credentials", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			promise = service.logonAsync(TestSettings.claimsTestDomainOnly, TestSettings.claimsTestUserOnly, TestSettings.claimsTestPassword);
			
			//assert			
			promise.done(function (result) {
				QUnit.ok(service.logonExpiration);
				
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(false, "Failed to logon with good creds?!");
				QUnit.start();
            });
        });
				
		QUnit.asyncTest("Test office365LogonService.logonAsync fails with invalid credentials", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			promise = service.logonAsync(TestSettings.claimsTestDomainOnly, TestSettings.claimsTestUserOnly, "dfdf");
			
			//assert			
			promise.done(function (result) {
				QUnit.ok(false, "logon with bad creds should have failed");
				
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365LogonService.logonAsync fails with invalid URL", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365LogonService("https://fadsfsdafd");
			promise = service.logonAsync(TestSettings.claimsTestDomainOnly, TestSettings.claimsTestUserOnly, "dfdf");
			
			//assert			
			promise.done(function (result) {
				QUnit.ok(false, "logon with bad creds should have failed");
				
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365LogonService.logonAsync works with cached creds", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			promise = service.logonAsync(TestSettings.claimsTestDomainOnly, TestSettings.claimsTestUserOnly, TestSettings.claimsTestPassword);
			
			//assert			
			promise.done(function (result) {
				QUnit.ok(service.logonExpiration);
				
				promise = service.logonAsync();
				
				promise.done(function () {
					QUnit.ok(true);
					QUnit.start();
                });
				
				promise.fail(function () {
					QUnit.ok(false, "logonAsync should have returned true on second pass");
					QUnit.start();
                });							
            });
			
			promise.fail(function () {
				QUnit.ok(false, "Failed to logon with good creds?!");
				QUnit.start();
            });
        });
	
		QUnit.test("test logonExpirationToDate parses good UTC date", function () {
			//arrange
			var service,
				parsed;
			
			//act
			service = new office365LogonService(TestSettings.claimsTestUrl);
			service.logonExpiration = "2013-10-23T00:00:00.000Z";
			parsed = service.logonExpirationToDate();
			
			//assert			
			QUnit.ok(parsed);
			QUnit.equal(parsed.getFullYear(), 2013);
			QUnit.equal(service.logonExpiration, parsed.toISOString());
		});
	});