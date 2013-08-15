/*global QUnit*/
define(["services/soapParsingService"], 
	function (soapParsingService) {
		var soapResultsJson = "{\"value\":\"\",\"QueryExResult\":{\"value\":\"\",\"xs:schema\":{\"value\":\"\",\"xmlns\":\"\",\"xmlns:xs\":\"http://www.w3.org/2001/XMLSchema\",\"xmlns:msdata\":\"urn:schemas-microsoft-com:xml-msdata\",\"xmlns:msprop\":\"urn:schemas-microsoft-com:xml-msprop\",\"id\":\"Results\",\"xs:element\":{\"value\":\"\",\"name\":\"Results\",\"msdata:IsDataSet\":\"true\",\"msdata:UseCurrentLocale\":\"true\",\"msprop:QueryTerms\":\"test;\",\"msprop:IgnoredNoiseWords\":\"\",\"msprop:Keyword\":\"\",\"msprop:QueryModification\":\"\",\"msprop:ElapsedTime\":\"62\",\"msprop:Definition\":\"\",\"msprop:SpellingSuggestion\":\"\",\"xs:complexType\":{\"value\":\"\",\"xs:choice\":{\"value\":\"\",\"minOccurs\":\"0\",\"maxOccurs\":\"unbounded\",\"xs:element\":{\"value\":\"\",\"name\":\"RelevantResults\",\"msprop:TotalRows\":\"3500\",\"msprop:IsTotalRowsExact\":\"False\",\"xs:complexType\":{\"value\":\"\",\"xs:sequence\":{\"value\":\"\",\"xs:element\":{\"value\":\"\",\"name\":\"WorkId\",\"type\":\"xs:long\",\"minOccurs\":\"0\"},\"xs:element1\":{\"value\":\"\",\"name\":\"Rank\",\"type\":\"xs:long\",\"minOccurs\":\"0\"},\"xs:element2\":{\"value\":\"\",\"name\":\"Title\",\"type\":\"xs:string\",\"minOccurs\":\"0\"},\"xs:element3\":{\"value\":\"\",\"name\":\"Author\",\"msdata:DataType\":\"System.String[], mscorlib, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089\",\"type\":\"xs:anyType\",\"minOccurs\":\"0\"},\"xs:element4\":{\"value\":\"\",\"name\":\"Size\",\"type\":\"xs:long\",\"minOccurs\":\"0\"},\"xs:element5\":{\"value\":\"\",\"name\":\"Path\",\"type\":\"xs:string\",\"minOccurs\":\"0\"},\"xs:element6\":{\"value\":\"\",\"name\":\"Description\",\"type\":\"xs:string\",\"minOccurs\":\"0\"},\"xs:element7\":{\"value\":\"\",\"name\":\"Write\",\"type\":\"xs:dateTime\",\"minOccurs\":\"0\"},\"xs:element8\":{\"value\":\"\",\"name\":\"SiteName\",\"type\":\"xs:string\",\"minOccurs\":\"0\"},\"xs:element9\":{\"value\":\"\",\"name\":\"CollapsingStatus\",\"type\":\"xs:long\",\"minOccurs\":\"0\"},\"xs:element10\":{\"value\":\"\",\"name\":\"HitHighlightedSummary\",\"type\":\"xs:string\",\"minOccurs\":\"0\"},\"xs:element11\":{\"value\":\"\",\"name\":\"HitHighlightedProperties\",\"type\":\"xs:string\",\"minOccurs\":\"0\"},\"xs:element12\":{\"value\":\"\",\"name\":\"ContentClass\",\"type\":\"xs:string\",\"minOccurs\":\"0\"},\"xs:element13\":{\"value\":\"\",\"name\":\"IsDocument\",\"type\":\"xs:boolean\",\"minOccurs\":\"0\"},\"xs:element14\":{\"value\":\"\",\"name\":\"PictureThumbnailURL\",\"type\":\"xs:string\",\"minOccurs\":\"0\"},\"xs:element15\":{\"value\":\"\",\"name\":\"ServerRedirectedURL\",\"type\":\"xs:string\",\"minOccurs\":\"0\"}}}}}}}},\"diffgr:diffgram\":{\"value\":\"\",\"xmlns:msdata\":\"urn:schemas-microsoft-com:xml-msdata\",\"xmlns:diffgr\":\"urn:schemas-microsoft-com:xml-diffgram-v1\",\"Results\":{\"value\":\"\",\"xmlns\":\"\",\"RelevantResults\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults1\",\"msdata:rowOrder\":\"0\",\"WorkId\":{\"value\":\"9314\"},\"Rank\":{\"value\":\"83193546\"},\"Title\":{\"value\":\"2071 Test Library\"},\"Size\":{\"value\":\"0\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/2071 Test Library/Forms/AllItems.aspx\"},\"Write\":{\"value\":\"2013-02-04T20:35:32-06:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/2071 Test Library/Forms\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"DocumentLibrary <ddd/> Site Actions <ddd/> This page location is: <ddd/> Home <ddd/> All Documents <ddd/> Top Link Bar <ddd/> Search <ddd/> Team 1 <ddd/> Team 2 <ddd/> Team 3 <ddd/> Team 4 <ddd/> Team 5 <ddd/> Team M <ddd/> PM <ddd/> Quick Launch <ddd/> Sites <ddd/> Libraries <ddd/> Shared Documents <ddd/> Framework Unit Testing <ddd/> Lists <ddd/> Calendar <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle>2071 <c0>Test</c0> Library</HHTitle><HHUrl>http://prodsp2010.dev.local/2071 <c0>Test</c0> Library/Forms/AllItems.aspx</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_List_DocumentLibrary\"},\"IsDocument\":{\"value\":\"false\"}},\"RelevantResults1\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults2\",\"msdata:rowOrder\":\"1\",\"WorkId\":{\"value\":\"72087\"},\"Rank\":{\"value\":\"79568368\"},\"Title\":{\"value\":\"Permissions Test\"},\"Size\":{\"value\":\"0\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/Permissions Test/Forms/AllItems.aspx\"},\"Write\":{\"value\":\"2013-05-03T19:37:32-05:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/Permissions Test/Forms\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"DocumentLibrary <ddd/> Site Actions <ddd/> This page location is: <ddd/> Team 2 Home <ddd/> All Documents <ddd/> Top Link Bar <ddd/> Document Sets <ddd/> unittest <ddd/> Over Full <c0>Test</c0> <ddd/> KLSearch <ddd/> HR <ddd/> RecordCenter <ddd/> AJG <ddd/> Quick Launch <ddd/> Pictures <ddd/> Awesome Photos <ddd/> Sites <ddd/> Shared <ddd/> <c0>Test</c0> List <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle>Permissions <c0>Test</c0></HHTitle><HHUrl>http://prodsp2010.dev.local/sites/team2/Permissions <c0>Test</c0>/Forms/AllItems.aspx</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_List_DocumentLibrary\"},\"IsDocument\":{\"value\":\"false\"}},\"RelevantResults2\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults3\",\"msdata:rowOrder\":\"2\",\"WorkId\":{\"value\":\"10426\"},\"Rank\":{\"value\":\"78875606\"},\"Title\":{\"value\":\"Test List\"},\"Size\":{\"value\":\"0\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/Lists/Test List/AllItems.aspx\"},\"Write\":{\"value\":\"2013-05-20T15:36:03-05:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/Lists/Test List\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"GenericList <ddd/> Site Actions <ddd/> This page location is: <ddd/> Team 2 Home <ddd/> All Items <ddd/> Top Link Bar <ddd/> Document Sets <ddd/> unittest <ddd/> Over Full <c0>Test</c0> <ddd/> KLSearch <ddd/> HR <ddd/> RecordCenter <ddd/> AJG <ddd/> Quick Launch <ddd/> Pictures <ddd/> Awesome <ddd/> Permissions <c0>Test</c0> <ddd/> <c0>test</c0> 1 <ddd/> <c0>test</c0> 2 <ddd/> <c0>test</c0> 3 <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle><c0>Test</c0> List</HHTitle><HHUrl>http://prodsp2010.dev.local/sites/team2/Lists/<c0>Test</c0> List/AllItems.aspx</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_List_GenericList\"},\"IsDocument\":{\"value\":\"false\"}},\"RelevantResults3\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults4\",\"msdata:rowOrder\":\"3\",\"WorkId\":{\"value\":\"1124\"},\"Rank\":{\"value\":\"74848804\"},\"Title\":{\"value\":\"Test\"},\"Author\":{\"value\":\"\",\"string\":{\"value\":\"Brad Porter\"}},\"Size\":{\"value\":\"0\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/Shared Documents/123456/Test\"},\"Write\":{\"value\":\"2012-11-29T19:06:32-06:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/Shared Documents/123456\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"Share a document with the team by adding it to this document library. <ddd/> 2071 <c0>Test</c0> Library <ddd/> There are no items to show in this view of the &quot;Shared Documents&quot; document library. To add a new item, click &quot;New <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle><c0>Test</c0></HHTitle><HHUrl>http://prodsp2010.dev.local/Shared Documents/123456/<c0>Test</c0></HHUrl>\"},\"ContentClass\":{\"value\":\"STS_ListItem_DocumentLibrary\"},\"IsDocument\":{\"value\":\"false\"}},\"RelevantResults4\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults5\",\"msdata:rowOrder\":\"4\",\"WorkId\":{\"value\":\"1675\"},\"Rank\":{\"value\":\"73793672\"},\"Title\":{\"value\":\"Thoughts on Connect 5\"},\"Author\":{\"value\":\"\",\"string\":{\"value\":\"Alex Thompson\"}},\"Size\":{\"value\":\"20755\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/sites/team3/AlexLib/Connect 5 Usability Test.docx\"},\"Write\":{\"value\":\"2013-07-22T15:34:35-05:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/sites/team3/AlexLib\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"When selecting locations from within a site, different locations seem to be highlighted randomly <ddd/> After cancelling out the Edit Properties menu, it should revert back to the Documents tab, rather than <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle>Thoughts on Connect 5</HHTitle><HHUrl>http://prodsp2010.dev.local/sites/team3/AlexLib/Connect 5 Usability <c0>Test</c0>.docx</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_ListItem_DocumentLibrary\"},\"IsDocument\":{\"value\":\"true\"}},\"RelevantResults5\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults6\",\"msdata:rowOrder\":\"5\",\"WorkId\":{\"value\":\"1347\"},\"Rank\":{\"value\":\"73663314\"},\"Title\":{\"value\":\"365 Test Results\"},\"Author\":{\"value\":\"\",\"string\":{\"value\":\"Alex Thompson\"}},\"Size\":{\"value\":\"213969\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/sites/team3/AlexLib/365 Test Results.pdf\"},\"Write\":{\"value\":\"2013-07-15T14:58:11-05:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/sites/team3/AlexLib\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"\"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle>365 <c0>Test</c0> Results</HHTitle><HHUrl>http://prodsp2010.dev.local/sites/team3/AlexLib/365 <c0>Test</c0> Results.pdf</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_ListItem_DocumentLibrary\"},\"IsDocument\":{\"value\":\"true\"}},\"RelevantResults6\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults7\",\"msdata:rowOrder\":\"6\",\"WorkId\":{\"value\":\"9249\"},\"Rank\":{\"value\":\"72954850\"},\"Title\":{\"value\":\"Walmart Test Site\"},\"Size\":{\"value\":\"107737\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/sites/team4/Walmart\"},\"Write\":{\"value\":\"2013-08-09T20:15:01-05:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/sites/team4\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"Add a new image, change this welcome text or add new lists to this page by clicking the edit button above. You can click on Shared Documents to add files or on the calendar to create new team events <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle>Walmart <c0>Test</c0> Site</HHTitle><HHUrl>http://prodsp2010.dev.local/sites/team4/Walmart</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_Web\"},\"IsDocument\":{\"value\":\"false\"}},\"RelevantResults7\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults8\",\"msdata:rowOrder\":\"7\",\"WorkId\":{\"value\":\"72128\"},\"Rank\":{\"value\":\"72909626\"},\"Title\":{\"value\":\"test\"},\"Author\":{\"value\":\"\",\"string\":{\"value\":\"Sam Swanner\"},\"string1\":{\"value\":\"Windows User\"}},\"Size\":{\"value\":\"26870\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/SamLib/test.docx\"},\"Write\":{\"value\":\"2013-05-07T13:12:17-05:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/SamLib\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"Middle East:Sub:AFDuplicate:AF <ddd/> AD|e213d89a-7a39-48e4-9451-edfabdcf7c8b <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle><c0>test</c0></HHTitle><HHUrl>http://prodsp2010.dev.local/sites/team2/SamLib/<c0>test</c0>.docx</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_ListItem_DocumentLibrary\"},\"IsDocument\":{\"value\":\"true\"}},\"RelevantResults8\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults9\",\"msdata:rowOrder\":\"8\",\"WorkId\":{\"value\":\"1008\"},\"Rank\":{\"value\":\"72840748\"},\"Title\":{\"value\":\"Over Full Test\"},\"Size\":{\"value\":\"105247\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/OverFull\"},\"Write\":{\"value\":\"2013-08-10T14:45:06-05:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/sites/team2\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"Add a new image, change this welcome text or add new lists to this page by clicking the edit button above. You can click on Shared Documents to add files or on the calendar to create new team events <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle>Over Full <c0>Test</c0></HHTitle><HHUrl>http://prodsp2010.dev.local/sites/team2/OverFull</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_Web\"},\"IsDocument\":{\"value\":\"false\"}},\"RelevantResults9\":{\"value\":\"\",\"diffgr:id\":\"RelevantResults10\",\"msdata:rowOrder\":\"9\",\"WorkId\":{\"value\":\"1863\"},\"Rank\":{\"value\":\"72788974\"},\"Title\":{\"value\":\"test\"},\"Author\":{\"value\":\"\",\"string\":{\"value\":\"Nick Heembrock\"},\"string1\":{\"value\":\"Windows User\"}},\"Size\":{\"value\":\"30669\"},\"Path\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/FormsLib/test.docx\"},\"Write\":{\"value\":\"2012-12-19T15:54:54-06:00\"},\"SiteName\":{\"value\":\"http://prodsp2010.dev.local/sites/team2/FormsLib\"},\"CollapsingStatus\":{\"value\":\"0\"},\"HitHighlightedSummary\":{\"value\":\"Apples <ddd/> Halo: Combat Evolved <ddd/> Old <ddd/> Scars of Mirrodin <ddd/> ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc <ddd/> \"},\"HitHighlightedProperties\":{\"value\":\"<HHTitle><c0>test</c0></HHTitle><HHUrl>http://prodsp2010.dev.local/sites/team2/FormsLib/<c0>test</c0>.docx</HHUrl>\"},\"ContentClass\":{\"value\":\"STS_ListItem_XMLForm\"},\"IsDocument\":{\"value\":\"true\"}}}}}}";
		
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
				input = parseSoapResultsString(soapResultsJson),
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
				input = parseSoapResultsString(soapResultsJson),
				results;
			
			//act
			service = new soapParsingService();
			results = service.parseSoapJson(input);					
			
			//assert
			QUnit.ok(results);
			QUnit.equal(results.length, 10);
			
			QUnit.ok(results[0].metadata);
			
			QUnit.equal(results[0].url, "http://prodsp2010.dev.local/2071 Test Library/Forms/AllItems.aspx");
			QUnit.equal(results[0].icon, "app/images/icon/ICGEN.png");			
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