/*global QUnit*/
define(["services/imaging/serverSavedSearchesService", 
		"ntlm",
		"unitTests/unitTestSettings", 
        "domain/search",
        "domain/searchType",
        "domain/site",
        "domain/credential",
        "domain/credentialType"],
    function (serverSavedSearchesService, ntlm, TestSettings, search, searchType, site, credential, credentialType) {
        QUnit.module("Testing serverSavedSearchesService");
        
        
        QUnit.asyncTest("Test facetSearch with good credentials", function () {
            //arrange
            var service,
                searchData = new search(TestSettings.siteTestUrl, TestSettings.siteTitle, searchType.server, TestSettings.testKlaml);
            
            service = new serverSavedSearchesService();
            
            ntlm.setCredentials(TestSettings.siteTestDomain, TestSettings.siteTestUser, TestSettings.siteTestPassword);
            ntlm.authenticate(service.serviceUrl);
            
            //act
            var facetSearchPromise = service.facetSearchAsync(searchData);            
            
            //assert
            facetSearchPromise.done(function (result) {
                QUnit.ok(true);                
                QUnit.start();
            });
            
            facetSearchPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        QUnit.asyncTest("Test loadServerSavedSearches with good credentials", function () {
            //arrange
            var service,
                siteData = new site(TestSettings.siteTestUrl, TestSettings.siteTitle, TestSettings.siteMajorVersion, 
                            new credential(credentialType.ntlm, TestSettings.siteTestUser, TestSettings.siteTestPassword, TestSettings.siteTestDomain));
            
            service = new serverSavedSearchesService();
            
            //act
            var loadPromise = service.loadServerSavedSearchesAsync(siteData);
            
            //assert
            loadPromise.done(function (result) {
                QUnit.ok(true);                
                QUnit.start();
            });
            
            loadPromise.fail(function (error) {
                QUnit.ok(false);
                QUnit.start();
            });
        });
        
        QUnit.test("Test parseQueryResults with null queryResults", function () {
            //arrange
            var service;
            
            service = new serverSavedSearchesService();
            
            //act
            result = service.parseQueryResults();
            
            //assert
            QUnit.deepEqual(result, []);
        });
        
        QUnit.test("Test parseSearchResults with null searchResults", function () {
            //arrange
            var service;
            
            service = new serverSavedSearchesService();
            
            //act
            result = service.parseSearchResults();
            
            //assert
            QUnit.deepEqual(result, []);
        });
        
        QUnit.test("Test buildResultMetadata with null FacetResultItemValues", function () {
            //arrange
            var service;
            
            service = new serverSavedSearchesService();
            
            //act
            result = service.buildResultMetadata();
            
            //assert
            QUnit.deepEqual(result, {});
        });
        
        QUnit.test("Test convertPathToTitle with valid path", function () {
            //arrange
            var service;
            
            service = new serverSavedSearchesService();
            
            //act
            result = service.convertPathToTitle(TestSettings.docUrl);
            
            //assert
            QUnit.equal(result, TestSettings.docTitle);
        });
        
        QUnit.test("Test convertPathToTitle with null path", function () {
            //arrange
            var service;
            
            service = new serverSavedSearchesService();
            
            //act
            result = service.convertPathToTitle();
            
            //assert
            QUnit.equal(result, "");
        });
    });
