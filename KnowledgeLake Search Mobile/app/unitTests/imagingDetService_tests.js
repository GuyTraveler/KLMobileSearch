/*global QUnit*/
define(["services/imaging/imagingDetectionService", 
		"ntlm",
		"unitTests/unitTestSettings", 
        "domain/site",
        "domain/credential",
        "domain/credentialType"],
    function (ImagingDetectionService, ntlm, TestSettings, site, credential, credentialType) {
        QUnit.module("Testing imagingDetectionService");
        
        
        QUnit.asyncTest("Test detect with good credentials", function () {
            //arrange
            var siteData = new site(TestSettings.siteTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, 
                            new credential(credentialType.ntlm, TestSettings.siteTestUser, TestSettings.siteTestPassword, TestSettings.siteTestDomain));
            
            //act
            var detectPromise = ImagingDetectionService.detectAsync(siteData);
            
            //assert
            detectPromise.done(function (result) {
                QUnit.ok(true);                
                QUnit.start();
            });
            
            detectPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("Test detect with bad credentials", function () {
            //arrange
            var siteData = new site(TestSettings.siteTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, 
                            new credential(credentialType.ntlm, TestSettings.siteTestUser, "", TestSettings.siteTestDomain));
            
            //act
            var detectPromise = ImagingDetectionService.detectAsync(siteData);
            
            //assert
            detectPromise.done(function (result) {
                QUnit.ok(false);                
                QUnit.start();
            });
            
            detectPromise.fail(function (error) {
                QUnit.ok(true);
                QUnit.start();
            });
        });
    });
