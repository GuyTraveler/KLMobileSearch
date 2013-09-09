/*global QUnit*/
define(["services/soapParsingService", "unitTests/unitTestSettings"], 
	function (soapParsingService, TestSettings) {
		QUnit.module("test results parser");
		
		QUnit.test("test can instantiate soapParsingService", function () {
			//arrange
			var service;
			
			//act
			service = new soapParsingService();
			
			//assert
			QUnit.ok(service);
        });
		
		QUnit.test("test soapParsingService.parseSoapJson returns 10 results", function () {
			//arrange
			var service,
				input = parseSoapResultsString(TestSettings.soapResultsJson),
				results;
			
			//act
			service = new soapParsingService();
			results = service.parseSoapJson(input);
			
			//assert
			QUnit.ok(results);
			QUnit.equal(results.length, 10);
        });
		
		QUnit.test("test soapParsingService.parseSoapJson returns valid results", function () {
			//arrange
			var service,
				input = parseSoapResultsString(TestSettings.soapResultsJson),
				results;
			
			//act
			service = new soapParsingService();
			results = service.parseSoapJson(input);					
			
			//assert
			QUnit.ok(results);
			QUnit.equal(results.length, 10);
			
			QUnit.ok(results[0].metadata);
			
			QUnit.equal(results[0].url, "http://prodsp2010.dev.local/2071 Test Library/Forms/AllItems.aspx");
			QUnit.equal(results[0].title, "2071 Test Library");
			
			QUnit.equal(results[0].metadata.order, 0);			
			QUnit.equal(results[0].metadata.CollapsingStatus, 0);
			QUnit.equal(results[0].metadata.ContentClass, "STS_List_DocumentLibrary");
			QUnit.equal(results[0].metadata.HitHighlightedProperties, "<HHTitle>2071 <c0>Test</c0> Library</HHTitle><HHUrl>http://prodsp2010.dev.local/2071 <c0>Test</c0> Library/Forms/AllItems.aspx</HHUrl>");
			QUnit.equal(results[0].metadata.IsDocument, "false");
			QUnit.equal(results[0].metadata.Path, "http://prodsp2010.dev.local/2071 Test Library/Forms/AllItems.aspx");
			QUnit.equal(results[0].metadata.Rank, "83193546");
			QUnit.equal(results[0].metadata.SiteName, "http://prodsp2010.dev.local/2071 Test Library/Forms");
			QUnit.equal(results[0].metadata.Size, "0");
			QUnit.equal(results[0].metadata.Title, "2071 Test Library");
			QUnit.equal(results[0].metadata.WorkId, "9314");
			QUnit.equal(results[0].metadata.Write, "2013-02-04T20:35:32-06:00");
			QUnit.equal(results[0].metadata.id, "RelevantResults1");
			QUnit.equal(results[0].metadata.order, "0");
        });
		
		QUnit.test("test soapParsingService.parseSoapJson invalid results fails gracefully 1", function () {
			//arrange
			var service,
				results;
			
			//act
			service = new soapParsingService();
			results = service.parseSoapJson("");
			
			//assert
			QUnit.ok(results);
			QUnit.equal(results.length, 0);
        });
			
		QUnit.test("test soapParsingService.parseSoapJson invalid results fails gracefully 2", function () {
			//arrange
			var service,
				results;
			
			//act
			service = new soapParsingService();
			results = service.parseSoapJson({ QueryExResult: 'hhh' });
			
			//assert
			QUnit.ok(results);
			QUnit.equal(results.length, 0);
        });
				
		QUnit.test("test soapParsingService.parseSoapJson invalid results fails gracefully 3", function () {
			//arrange
			var service,
				results;
			
			//act
			service = new soapParsingService();
			results = service.parseSoapJson(
			{ 
				QueryExResult: { 
					'diffgr:diffgram': 'ggg'
				}
			});
			
			//assert
			QUnit.ok(results);
			QUnit.equal(results.length, 0);
        });
					
		QUnit.test("test soapParsingService.parseSoapJson invalid results fails gracefully 4", function () {
			//arrange
			var service,
				results;
			
			//act
			service = new soapParsingService();
			results = service.parseSoapJson(
			{ 
				QueryExResult: { 
					'diffgr:diffgram': {
						Results: {}
                    }
				}
			});
			
			//assert
			QUnit.ok(results);
			QUnit.equal(results.length, 0);
        });
						
		QUnit.test("test soapParsingService.parseSoapJson invalid results fails gracefully 5", function () {
			//arrange
			var service,
				results;
			
			//act
			service = new soapParsingService();
			results = service.parseSoapJson(
			{ 
				QueryExResult: { 
					'diffgr:diffgram': {
						Results: {
							RelevantResults: {
								test: { }
                            }
                        }
                    }
				}
			});
			
			//assert
			QUnit.ok(results);
			QUnit.equal(results.length, 1);
        });
		
		
		function parseSoapResultsString (str) {
			return JSON.parse(str);
        }
    });