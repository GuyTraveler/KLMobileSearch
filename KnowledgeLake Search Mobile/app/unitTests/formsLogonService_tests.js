/*global QUnit*/
define(['jquery',
		'services/formsLogonService',
		'unitTests/unitTestSettings'],
    function ($, formsLogonService, TestSettings) {
        QUnit.module("Testing services/formsLogonService");

		QUnit.test("Test formsLogonService is available", function () {
			//arrange
			
			//act
			
			//assert
			QUnit.ok(formsLogonService);
			QUnit.equal(typeof formsLogonService, 'function');
        });
		
		QUnit.asyncTest("Test formsLogonService.logonAsync works with good creds", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new formsLogonService(TestSettings.fbaTestUrl);
			promise = service.logonAsync("", TestSettings.fbaTestUser, TestSettings.fbaTestPassword);
			
			//assert
			promise.done(function () {
				QUnit.ok(true);
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(false);
				QUnit.start();
            });
        });
		
		//NOTE: do not make a test with a valid user name as thaat will lock the user out depending on server settings
		QUnit.asyncTest("Test formsLogonService.logonAsync fails with bad creds", function () {
			//arrange
			var service,
				promise;
			
			//act
			service = new formsLogonService(TestSettings.fbaTestUrl);
			promise = service.logonAsync("", "Testdfsadf", TestSettings.fbaTestPassword);
			
			//assert
			promise.done(function () {
				QUnit.ok(false);
				QUnit.start();
            });
			
			promise.fail(function () {
				QUnit.ok(true);
				QUnit.start();
            });
        });	
	});