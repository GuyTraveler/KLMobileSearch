/*global QUnit*/
//explicit request to queryService
define(["services/kqlQueryService",
        "unitTests/queryServiceTestHelper"],
    function (kqlQueryService, queryServiceTestHelper) {
		QUnit.module("testing kqlQueryService");
		
		new queryServiceTestHelper(kqlQueryService);
    });