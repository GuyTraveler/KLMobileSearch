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
            var detectPromise = ImagingDetectionService.detect(siteData);
            
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
        
        QUnit.test("Test identifyImagingSearchByFeatureID with Imaging search guid", function () {
            //arrange
            
            //act
            result = ImagingDetectionService.identifyImagingSearchByFeatureID(TestSettings.imagingSearchId);
            
            //assert
            QUnit.equal(result, true);
        });
        
        QUnit.test("Test identifyImagingSearchByFeatureID with invalid guid", function () {
            //arrange
            
            //act
            result = ImagingDetectionService.identifyImagingSearchByFeatureID(TestSettings.invalidId);
            
            //assert
            QUnit.equal(result, false);
        });
        
        QUnit.test("Test identifyImagingSearchByFeatureID with null guid", function () {
            //arrange
            
            //act
            result = ImagingDetectionService.identifyImagingSearchByFeatureID();
            
            //assert
            QUnit.equal(result, false);
        });
    });
