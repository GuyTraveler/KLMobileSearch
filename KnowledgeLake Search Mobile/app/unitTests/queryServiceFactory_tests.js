/*global QUnit*/
define(["factory/queryServiceFactory",
		"services/sqlQueryService",
		"services/kqlQueryService"],
    function (QueryServiceFactory, sqlQueryService, kqlQueryService) {
		var ntlmTestUrl = "http://prodsp2010.dev.local";
		
        QUnit.module("Testing factory/queryServiceFactory");

        QUnit.test("test queryServiceFactory initialized", function () {
            //arrange
            
            //act 
                        
            //assert
            QUnit.ok(QueryServiceFactory);
        });  
      
        QUnit.test("test queryServiceFactory returns sqlQueryService for < 15", function () {
            //arrange
            var service;
			
            //act 
			service = QueryServiceFactory.getQueryService(ntlmTestUrl, 14);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof sqlQueryService);
        });  
      
        QUnit.test("test queryServiceFactory returns kqlQueryService for == 15", function () {
            //arrange
            var service;
			
            //act 
			service = QueryServiceFactory.getQueryService(ntlmTestUrl, 15);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof kqlQueryService);
        });  
      
        QUnit.test("test queryServiceFactory returns kqlQueryService for > 15", function () {
            //arrange
            var service;
			
            //act 
			service = QueryServiceFactory.getQueryService(ntlmTestUrl, 16);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof kqlQueryService);
        });  
      
        QUnit.test("test queryServiceFactory returns service even for bad URL", function () {
            //arrange
            var service;
			
            //act 
			service = QueryServiceFactory.getQueryService(null, 12);
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof sqlQueryService);
        });  
      
        QUnit.test("test queryServiceFactory returns sqlQueryService for bad version", function () {
            //arrange
            var service;
			
            //act 
			service = QueryServiceFactory.getQueryService(null, "g");
                        
            //assert
            QUnit.ok(service);
			QUnit.ok(service instanceof sqlQueryService);
        });  
      
	});