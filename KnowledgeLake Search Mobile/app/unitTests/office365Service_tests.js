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
		
		QUnit.asyncTest("Test office365Service.getOffice365MetadataAsync gets Unknown for badly formatted username", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getOffice365MetadataAsync("Asdfdsaf");
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(result.logonType, office365LogonType.unknown);
				QUnit.equal(result.adfsUrl, "");
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365MetadataAsync failed!");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365Service.getOffice365MetadataAsync gets Unknown for well formatted username, but doesn't exist", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getOffice365MetadataAsync("spadmin@dev.local");
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(result.logonType, office365LogonType.unknown);
				QUnit.equal(result.adfsUrl, "");
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365MetadataAsync failed!");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365Service.getOffice365MetadataAsync gets 'Federated' for valid ADFS user", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getOffice365MetadataAsync(TestSettings.adfsTestFullUser);
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(result.logonType, office365LogonType.adfs);
				QUnit.ok(result.adfsUrl.startsWith(TestSettings.adfsSTSTestUrl));
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365MetadataAsync failed!");
				QUnit.start();
            });
        });
		
		QUnit.asyncTest("Test office365Service.getOffice365MetadataAsync gets 'Managed' for valid Office 365 user", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new office365Service();
			promise = service.getOffice365MetadataAsync(TestSettings.claimsTestUser);
			
			//assert
			promise.done(function (result) {
				QUnit.ok(result);
				QUnit.equal(result.logonType, office365LogonType.managed);
				QUnit.equal(result.adfsUrl, "");
				QUnit.start();
            });
			
			promise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
				QUnit.ok(false, "getOffice365MetadataAsync failed!");
				QUnit.start();
            });
		});
	});