/*global QUnit*/
define(['jquery',
		'services/office365Service',
		'unitTests/unitTestSettings',
		'domain/office365LogonType',
		'extensions'],
    function ($, office365Service, TestSettings, office365LogonType) {
        QUnit.module("Testing services/office365Service");

		QUnit.test("Test office365Service is available", function () {
			//arrange
			
			//act
			
			//assert
			QUnit.ok(office365Service);			
        });
		
		QUnit.asyncTest("Test office365Service.getOffice365LogonTypeForUserAsync gets Unknown for badly formatted username", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getOffice365LogonTypeForUserAsync("Asdfdsaf");
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(result, office365LogonType.unknown);
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365LogonTypeForUserAsync failed!");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365Service.getOffice365LogonTypeForUserAsync gets Unknown for well formatted username, but doesn't exist", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getOffice365LogonTypeForUserAsync("spadmin@dev.local");
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(result, office365LogonType.unknown);
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getNamespaceTypeForUserAsync failed!");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365Service.getOffice365LogonTypeForUserAsync gets 'Federated' for valid ADFS user", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getOffice365LogonTypeForUserAsync(TestSettings.adfsTestFullUser);
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(result, office365LogonType.adfs);
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getNamespaceTypeForUserAsync failed!");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365Service.getNamespaceTypeForUserAsync gets 'Managed' for valid Office 365 user", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getOffice365LogonTypeForUserAsync(TestSettings.claimsTestUser);
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(result, office365LogonType.managed);
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365LogonTypeForUserAsync failed!");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365Service.getAdfsUri returns empty for badly formatted user", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getAdfsUri("asdfasdfdsf");
			
			//assert
			promise.done(function (result) {
				QUnit.equal(result, "");
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365LogonTypeForUserAsync failed!");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365Service.getAdfsUri returns empty for well formatted user but doesn't exist", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getAdfsUri("spadmin@dev.local");
			
			//assert
			promise.done(function (result) {
				QUnit.equal(result, "");
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365LogonTypeForUserAsync failed!");
				QUnit.start();
            });			
        });
			
		QUnit.asyncTest("Test office365Service.getAdfsUri returns empty for well-known Office 365 STD user", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getAdfsUri(TestSettings.claimsTestUser);
			
			//assert
			promise.done(function (result) {
				QUnit.equal(result, "");
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365LogonTypeForUserAsync failed!");
				QUnit.start();
            });			
        });
			
		QUnit.asyncTest("Test office365Service.getAdfsUri returns valid ADFS URI for valid ADFS user", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getAdfsUri(TestSettings.adfsTestFullUser);
			
			//assert
			promise.done(function (result) {
				QUnit.notEqual(result, "");
				QUnit.ok(result.toLowerCase().startsWith(TestSettings.adfsSTSTestUrl));
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365LogonTypeForUserAsync failed!");
				QUnit.start();
            });
		});
	});