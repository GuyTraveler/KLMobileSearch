define(["services/keywordValidationService", 
		"system", 
		"jquery"], function (KeywordValidationService, system, $) {
        QUnit.module("services/keywordValidationService");

        QUnit.test("test keywordValidationService keyword &", function () {
            var keyword = "&";
            
            //act
            var result = KeywordValidationService.validate(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
            
        QUnit.test("test keywordValidationService keyword &!$", function () {
            var keyword = "&!$";
            
            //act
            var result = KeywordValidationService.validate(keyword);
                        
            //assert
            QUnit.equal(result, false);
        });
            
        QUnit.test("test keywordValidationService keyword &test", function () {
            var keyword = "&test";
            
            //act
            var result = KeywordValidationService.validate(keyword);
                        
            //assert
            QUnit.equal(result, true);
        });
});