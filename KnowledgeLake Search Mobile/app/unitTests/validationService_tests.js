define(["services/keywordValidationService",
		"jquery",
        "unitTests/unitTestSettings",
        "domain/site",
        "domain/credential",
        "domain/credentialType"], 
        function (KeywordValidationService, $, TestSettings, site, credential, credentialType) {
        QUnit.module("services/keywordValidationService");

        QUnit.test("test keywordValidationService keyword &", function () {
            //arrange
            var keyword = "&";
            
            //act
            var result = KeywordValidationService.validate(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
            
        QUnit.test("test keywordValidationService keyword &!$", function () {
            //arrange
            var keyword = "&!$";
            
            //act
            var result = KeywordValidationService.validate(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
            
        QUnit.test("test keywordValidationService keyword &test", function () {
            //arrange
            var keyword = "&test";
            
            //act
            var result = KeywordValidationService.validate(keyword);
                        
            //assert
            QUnit.equal(result, true);
        });

        QUnit.test("test keywordValidationService keyword null", function () {
            //arrange
            
            //act
            var result = KeywordValidationService.validateKeyword();
                        
            //assert
            QUnit.equal(result, false);
        });

        QUnit.test("test keywordValidationService keyword test", function () {
            //arrange
            var keyword = "test";
            
            //act
            var result = KeywordValidationService.validateKeyword(keyword);
                        
            //assert
            QUnit.equal(result, true);
        });

        QUnit.test("test keywordValidationService keyword & test", function () {
            //arrange
            var keyword = "& test";
            
            //act
            var result = KeywordValidationService.validateKeyword(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
            
        QUnit.test("test keywordValidationService keyword &!$ $test", function () {
            //arrange
            var keyword = "&!$ $test";
            
            //act
            var result = KeywordValidationService.validateKeyword(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
            
        QUnit.test("test keywordValidationService keyword &test mobility", function () {
            //arrange
            var keyword = "&test mobility";
            
            //act
            var result = KeywordValidationService.validateKeyword(keyword);
                        
            //assert
            QUnit.equal(result, true);
        });
			    
        QUnit.test("test keywordValidationService keyword mobi\"lity", function () {
            //arrange
            var keyword = "mobi\"lity";
            
            //act
            var result = KeywordValidationService.validateKeyword(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
				    
        QUnit.test("test keywordValidationService keyword \"mobility", function () {
            //arrange
            var keyword = "\"mobility";
            
            //act
            var result = KeywordValidationService.validateKeyword(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
			
		QUnit.test("test keywordValidationService keyword mobility\"", function () {
            //arrange
            var keyword = "mobility\"";
            
            //act
            var result = KeywordValidationService.validateKeyword(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
			
		QUnit.test("test keywordValidationService keyword m\"obility\"", function () {
            //arrange
            var keyword = "m\"obility\"";
            
            //act
            var result = KeywordValidationService.validateKeyword(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
			
		QUnit.test("test keywordValidationService appendKeywordSearch", function () {
            //arrange
            var siteData = new site(TestSettings.ntlmTestUrl, "ProdSP2010", new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
                expected = [TestSettings.testSearchKeyword];
            
            //act
            KeywordValidationService.appendKeywordSearch(siteData, TestSettings.testSearchKeyword);
                        
            //assert
            QUnit.deepEqual(siteData.keywordSearches, expected);
        });
			
		QUnit.test("test keywordValidationService appendKeywordSearch duplicate", function () {
            //arrange
            var siteData = new site(TestSettings.ntlmTestUrl, "ProdSP2010", new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
                keywordSearches = ["test1", "test2", TestSettings.testSearchKeyword],
                expected = [TestSettings.testSearchKeyword, "test1", "test2"];
            
            //act
            siteData.keywordSearches = keywordSearches;
            KeywordValidationService.appendKeywordSearch(siteData, TestSettings.testSearchKeyword);
                        
            //assert
            QUnit.deepEqual(siteData.keywordSearches, expected);
        });
			
		QUnit.test("test keywordValidationService appendKeywordSearch full array", function () {
            //arrange
            var siteData = new site(TestSettings.ntlmTestUrl, "ProdSP2010", new credential(credentialType.ntlm, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword, TestSettings.ntlmTestDomain)),
                expected = ["test1", "test2", "test3", "test4", "test5"];
            
            //act
            siteData.keywordSearches = expected;
            KeywordValidationService.appendKeywordSearch(siteData, TestSettings.testSearchKeyword);
            
            expected.pop();
            expected.unshift(TestSettings.testSearchKeyword);
                        
            //assert
            QUnit.deepEqual(siteData.keywordSearches, expected);
        });      
			
		QUnit.test("test keywordValidationService bubbleUpKeyword", function () {
            //arrange
            var keywordSearches = ["test1", "test2", "test3", "test4", "test5"],
                expected = ["test4", "test1", "test2", "test3", "test5"];
            
            //act
            KeywordValidationService.bubbleUpKeyword(keywordSearches, 3);
                        
            //assert
            QUnit.deepEqual(keywordSearches, expected);
        });
});