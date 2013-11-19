/*global QUnit*/
define(['domain/application',
		'logger',
		'mocks/pluginsMock'],
    function (application, logger) {
        QUnit.module("Testing domain/application");		
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator works with wa=wsignin1.0", function () {
			//arrange
			var url = "http://asdfsdfswa=wsignin1.0",
				containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(url);
			
			//assert
			QUnit.equal(containsIndicator, true);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator works with wa=wsignin1.0 (some casing diff)", function () {
			//arrange
			var url = "http://www.test.com?wa=WSignin1.0",
				containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(url);
			
			//assert
			QUnit.equal(containsIndicator, true);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator works with _login", function () {
			//arrange
			var url = "http://asdfsdfswa=_login",
				containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(url);
			
			//assert
			QUnit.equal(containsIndicator, true);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator works with _login (some casing diff)", function () {
			//arrange
			var url = "http://www.test.com?_LOgin",
				containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(url);
			
			//assert
			QUnit.equal(containsIndicator, true);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator works with Authenticate.aspx", function () {
			//arrange
			var url = "http://asdfsdfs=Authenticate.aspx",
				containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(url);
			
			//assert
			QUnit.equal(containsIndicator, true);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator works with Authenticate.aspx (some casing diff)", function () {
			//arrange
			var url = "http://www.test.com/aUthentiCate.aspx",
				containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(url);
			
			//assert
			QUnit.equal(containsIndicator, true);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator works with multiple indicators", function () {
			//arrange
			var url = "http://www.test.com/aUthentiCate.aspx/_login/wa=WSignin1.0",
				containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(url);
			
			//assert
			QUnit.equal(containsIndicator, true);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator fails with no indicators", function () {
			//arrange
			var url = "http://www.test.com",
				containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(url);
			
			//assert
			QUnit.equal(containsIndicator, false);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator fails with empty string", function () {
			//arrange
			var containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator("");
			
			//assert
			QUnit.equal(containsIndicator, false);
        });
		
		QUnit.test("test application.urlContainsClaimsSignInIndicator fails gracefully with NULL", function () {
			//arrange
			var containsIndicator;
			
			//act
			containsIndicator = application.urlContainsClaimsSignInIndicator(null);
			
			//assert
			QUnit.equal(containsIndicator, false);
        });
		
		QUnit.asyncTest("test toast set valid state", function () {
			//arrange
			var initValue;
			
			//act
			//make sure we wait for the toast to definitely not be up
			setTimeout(function () {
				initValue = application.isToastVisible();
				application.showToast("fdf");
				
				//assert
				QUnit.equal(application.isToastVisible(), true);
				QUnit.equal(initValue, false);
				
				QUnit.start();
			}, 3000);
        });
		
		QUnit.test("test application says we are running in simulator when forced (browser)", function () {
			//arrange
			
			//act
			application.deviceUUID = null;
			
			//assert
			QUnit.equal(application.isRunningInSimulator(), true);
        });
		
		QUnit.test("test application says we are running in simulator when forced (specific UUID)", function () {
			//arrange
			var testDeviceId = "e0101010d38bde8e6740011221af335301010333";
						
			//act
			application.deviceUUID = testDeviceId;
			
			//assert
			QUnit.equal(application.deviceUUID, testDeviceId);
			QUnit.equal(application.isRunningInSimulator(), true);
        });
		
		QUnit.test("test application says we are NOT running in simulator when forced (fake UUID)", function () {
			//arrange
			var testDeviceId = "e0101010d38bde8e67400301010333";
						
			//act
			application.deviceUUID = testDeviceId;
			
			//assert
			QUnit.equal(application.isRunningInSimulator(), false);
        });
		
		QUnit.asyncTest("test toast hides after 3000 milliseconds", function () {
			//arrange
			
			//act			
			application.showToast("fdf");
			
			//assert
			QUnit.equal(application.isToastVisible(), true);
			
			setTimeout(function () {
				QUnit.equal(application.isToastVisible(), false);
				QUnit.start();
            }, 3005);
        });
		
		QUnit.test("test that we can show keyboard with mock", function () {
			//arrange
			
			//act
			application.showSoftKeyboard();
			
			//assert
			QUnit.ok(window.plugins);
			QUnit.ok(window.plugins.SoftKeyBoard);
        });
		
		QUnit.test("test that we can hide keyboard with mock", function () {
			//arrange
			
			//act
			application.hideSoftKeyboard();
			
			//assert
			QUnit.ok(window.plugins);
			QUnit.ok(window.plugins.SoftKeyBoard);
        });
		
		QUnit.test("RESET DEVICE UUID TO DEFAULT", function () {
			//arrange
			
		    //act
		    if (window.device && window.device.uuid) {
		        application.deviceUUID = window.device.uuid;
		    }
		    else if (window.WinJS) {
		        application.deviceUUID = "WinJS";
		    }
			
			//assert
			QUnit.ok(application.deviceUUID);
		});

		QUnit.test("test  application.setBusyHtml sets busy html properly", function () {
		    //arrange
		    var busyText = "xxx";

		    //act
		    application.setBusyHtml(busyText);

		    //assert
		    QUnit.ok(!window.App || window.App.loading === busyText);
		});
    });
