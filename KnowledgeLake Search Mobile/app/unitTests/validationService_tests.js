define(["services/keywordValidationService",
		"jquery"], function (KeywordValidationService, $) {
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
});