/*global QUnit*/
//explicit request to queryService
define(["services/sqlQueryService",
        "unitTests/queryServiceTestHelper"],
    function (sqlQueryService, queryServiceTestHelper) {
		QUnit.module("testing sqlQueryService");
		
		new queryServiceTestHelper(sqlQueryService);
    });