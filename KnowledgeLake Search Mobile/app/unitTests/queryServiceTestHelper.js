/*global QUnit*/
define(["INtlmLogonService",
        "domain/keywordConjunction",
		"unitTests/unitTestSettings"],
    function (ntlmLogonService, keywordConjunction, TestSettings) {
		
		var executeQueryServiceTests = function (queryService) {
	        var keywordSearchTest;
	        
	       
	        QUnit.test("Test can instantiate queryService", function () {
	            //arrange
	            var service;
	            
	            //act
	            service = new queryService("");
	            
	            //assert
	            QUnit.ok(service);
	        });
			  
	        QUnit.asyncTest("Test queryService single keyword", function () {
	            keywordSearchTest("word", keywordConjunction.and, true);
	        });
	        
	        QUnit.asyncTest("Test queryService with 2 AND keywords", function () {
	            keywordSearchTest(["quick", "word"], keywordConjunction.and, true);
	        });
			 
	        QUnit.asyncTest("Test queryService with 3 AND keywords", function () {
	            keywordSearchTest(["quick", "word", "knowledgelake"], keywordConjunction.and, true);
	        });
			 
	        QUnit.asyncTest("Test queryService with 2 OR keywords", function () {
	            keywordSearchTest(["quick", "word"], keywordConjunction.or, true);
	        });
			  
	        QUnit.asyncTest("Test queryService with 3 OR keywords", function () {
	            keywordSearchTest(["quick", "word", "knowledgelake"], keywordConjunction.or, true);
	        });
			 
	        QUnit.asyncTest("Test queryService with special char and OR", function () {
	            keywordSearchTest(["quick?", "word"], keywordConjunction.or, true);
	        });
			 
	        QUnit.asyncTest("Test queryService with special char and AND", function () {
	            keywordSearchTest(["quick?", "word"], keywordConjunction.and, true);
	        });
			 
	        QUnit.asyncTest("Test queryService with double quote and AND", function () {
	            keywordSearchTest(["quick\"", "word"], keywordConjunction.and, true);
	        });
			
	        QUnit.asyncTest("Test queryService with @ and AND", function () {
	            keywordSearchTest(["quick@", "word"], keywordConjunction.and, true);
	        });
	      	 
	        QUnit.asyncTest("Test queryService with 2 OR keywords and trim duplicates off", function () {
	            keywordSearchTest(["quick", "word"], keywordConjunction.or, false);
	        });
			    
	        QUnit.asyncTest("Test queryService with 2 AND keywords and trim duplicates off", function () {
	            keywordSearchTest(["quick", "word"], keywordConjunction.and, false);
	        });
			 
	        
	        
	        //failure tests
	        QUnit.asyncTest("Test queryService with garbage object fails gracefully", function () {
	            keywordSearchTest(new Date(), keywordConjunction.or, true, true);
	        });
				 
	        QUnit.asyncTest("Test queryService with undefined object fails gracefully", function () {
	            keywordSearchTest(undefined, keywordConjunction.or, true, true);
	        });
				 
	        QUnit.asyncTest("Test queryService with null object fails gracefully", function () {
	            keywordSearchTest(null, keywordConjunction.or, true, true);
	        });
			
	        
	        keywordSearchTest = function (keywords, conjunction, trimDuplicates, shouldFail) {
	            //arrange
	            var service,
	                logonService,
	                logonPromise,
	                searchPromise;
	            
	            //act
	            shouldFail = shouldFail && shouldFail !== false;
	            
	            service = new queryService(TestSettings.ntlmTestUrl);
	            logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
				logonPromise = logonService.logon(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
				
	            //assert
	            QUnit.ok(logonPromise);
	            
	            logonPromise.done(function (result) {
					searchPromise = service.keywordSearch(keywords, conjunction, trimDuplicates);
	                
	                QUnit.ok(searchPromise);
	                
	                searchPromise.done(function (result) {
						QUnit.ok(result)
						QUnit.start();
	                });
	                
	                searchPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
						QUnit.ok(shouldFail, "query keyword search failed");
						QUnit.start();
	                });				
	            });
				
				logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(false, "logon failed for keyword search");
					QUnit.start();	
	            });
	        };
			
			
	   
	        QUnit.asyncTest("test (!)", function () {
	            invalidCharTest("!", true);
	        });
	               
	        QUnit.asyncTest("test (\")", function () {
	           invalidCharTest("\"", true);
	        });
	        
	        QUnit.asyncTest("test (#)", function () {
	           invalidCharTest("#", true);
	        });
	        
	        QUnit.asyncTest("test ($)", function () {
	           invalidCharTest("$", true);
	        });
	        
	        QUnit.asyncTest("test (%)", function () {
	           invalidCharTest("%", true);
	        });
	        
	        QUnit.asyncTest("test (&)", function () {
	           invalidCharTest("&", true);
	        });
	        
	        QUnit.asyncTest("test (')", function () {
	           invalidCharTest("'", true);
	        });
	        
	        QUnit.asyncTest("test (()", function () {
	           invalidCharTest("(", true);
	        });
	        
	        QUnit.asyncTest("test ())", function () {
	           invalidCharTest(")", true);
	        });
	        
	        QUnit.asyncTest("test (*)", function () {
	           invalidCharTest("*", true);
	        });
	        
	        QUnit.asyncTest("test (+)", function () {
	           invalidCharTest("+", true);
	        });
	        
	        QUnit.asyncTest("test (,)", function () {
	           invalidCharTest(",", true);
	        });
	        
	        QUnit.asyncTest("test (-)", function () {
	           invalidCharTest("-", true);
	        });
	        
	        QUnit.asyncTest("test (.)", function () {
	           invalidCharTest(".", true);
	        });
	        
	        QUnit.asyncTest("test (/)", function () {
	           invalidCharTest("/", true);
	        });
	        
	        QUnit.asyncTest("test (:)", function () {
	           invalidCharTest(":", true);
	        });
	        
	        QUnit.asyncTest("test (;)", function () {
	           invalidCharTest(";", true);
	        });
	        
	        QUnit.asyncTest("test (<)", function () {
	           invalidCharTest("<", true);
	        });
	        
	        QUnit.asyncTest("test (=)", function () {
	           invalidCharTest("=", true);
	        });
	        
	        QUnit.asyncTest("test (>)", function () {
	           invalidCharTest(">", true);
	        });
	        
	        QUnit.asyncTest("test (?)", function () {
	           invalidCharTest("?", true);
	        });
	        
	        QUnit.asyncTest("test (@)", function () {
	           invalidCharTest("@", true);
	        });
	        
	        QUnit.asyncTest("test ([)", function () {
	           invalidCharTest("[", true);
	        });
	        
	        QUnit.asyncTest("test (\\)", function () {
	           invalidCharTest("\\", true);
	        });
	        
	        QUnit.asyncTest("test (])", function () {
	           invalidCharTest("]", true);
	        });
	        
	        QUnit.asyncTest("test (^)", function () {
	           invalidCharTest("^", true);
	        });
	        
	        QUnit.asyncTest("test (_)", function () {
	           invalidCharTest("_", true);
	        });
	        
	        QUnit.asyncTest("test (`)", function () {
	           invalidCharTest("`", true);
	        });
	        
	        QUnit.asyncTest("test ({)", function () {
	           invalidCharTest("{", true);
	        });
	        
	        QUnit.asyncTest("test (})", function () {
	           invalidCharTest("}", true);
	        });
	        
	        QUnit.asyncTest("test (~)", function () {
	           invalidCharTest("~", true);
	        });
	        
	        QUnit.asyncTest("test (—)", function () {
	           invalidCharTest("—", true);
	        });
	        
	        QUnit.asyncTest("test (–)", function () {
	           invalidCharTest("–", true);
	        });
	        
	        QUnit.asyncTest("test (¡)", function () {
	           invalidCharTest("¡", true);
	        });
	        
	        QUnit.asyncTest("test (¦)", function () {
	           invalidCharTest("¦", true);
	        });
	        
	        QUnit.asyncTest("test (|)", function () {
	           invalidCharTest("|", true);
	        });
	        
	        QUnit.asyncTest("test (¨)", function () {
	           invalidCharTest("¨", true);
	        });
	        
	        QUnit.asyncTest("test (´)", function () {
	           invalidCharTest("´", true);
	        });
	        
	        QUnit.asyncTest("test (¯)", function () {
	           invalidCharTest("¯", true);
	        });
	        
	        QUnit.asyncTest("test (¸)", function () {
	           invalidCharTest("¸", true);
	        });
	    
	        
	      
	        QUnit.asyncTest("test (!mobility)", function () {
	            invalidCharTest("!mobility", false);
	        });
	               
	        QUnit.asyncTest("test (\"mobility)", function () {
	           invalidCharTest("\"mobility", false);
	        });
	        
	        QUnit.asyncTest("test (#mobility)", function () {
	           invalidCharTest("#mobility", false);
	        });
	        
	        QUnit.asyncTest("test ($mobility)", function () {
	           invalidCharTest("$mobility", false);
	        });
	        
	        QUnit.asyncTest("test (%mobility)", function () {
	           invalidCharTest("%mobility", false);
	        });
	        
	        QUnit.asyncTest("test (&mobility)", function () {
	           invalidCharTest("&mobility", false);
	        });
	        
	        QUnit.asyncTest("test ('mobility)", function () {
	           invalidCharTest("'mobility", false);
	        });
	        
	        QUnit.asyncTest("test ((mobility)", function () {
	           invalidCharTest("(mobility", false);
	        });
	        
	        QUnit.asyncTest("test ()mobility)", function () {
	           invalidCharTest(")mobility", false);
	        });
	        
	        QUnit.asyncTest("test (*mobility)", function () {
	           invalidCharTest("*mobility", false);
	        });
	        
	        QUnit.asyncTest("test (+mobility)", function () {
	           invalidCharTest("+mobility", false);
	        });
	        
	        QUnit.asyncTest("test (,mobility)", function () {
	           invalidCharTest(",mobility", false);
	        });
	        
	        QUnit.asyncTest("test (-mobility)", function () {
	           invalidCharTest("-mobility", false);
	        });
	        
	        QUnit.asyncTest("test (.mobility)", function () {
	           invalidCharTest(".mobility", false);
	        });
	        
	        QUnit.asyncTest("test (/mobility)", function () {
	           invalidCharTest("/mobility", false);
	        });
	        
	        QUnit.asyncTest("test (:mobility)", function () {
	           invalidCharTest(":mobility", false);
	        });
	        
	        QUnit.asyncTest("test (;mobility)", function () {
	           invalidCharTest(";mobility", false);
	        });
	        
	        QUnit.asyncTest("test (<mobility)", function () {
	           invalidCharTest("<mobility", false);
	        });
	        
	        QUnit.asyncTest("test (=mobility)", function () {
	           invalidCharTest("=mobility", false);
	        });
	        
	        QUnit.asyncTest("test (>mobility)", function () {
	           invalidCharTest(">mobility", false);
	        });
	        
	        QUnit.asyncTest("test (?mobility)", function () {
	           invalidCharTest("?mobility", false);
	        });
	        
	        QUnit.asyncTest("test (@mobility)", function () {
	           invalidCharTest("@mobility", false);
	        });
	        
	        QUnit.asyncTest("test ([mobility)", function () {
	           invalidCharTest("[mobility", false);
	        });
	        
	        QUnit.asyncTest("test (\\mobility)", function () {
	           invalidCharTest("\\mobility", false);
	        });
	        
	        QUnit.asyncTest("test (]mobility)", function () {
	           invalidCharTest("]mobility", false);
	        });
	        
	        QUnit.asyncTest("test (^mobility)", function () {
	           invalidCharTest("^mobility", false);
	        });
	        
	        QUnit.asyncTest("test (_mobility)", function () {
	           invalidCharTest("_mobility", false);
	        });
	        
	        QUnit.asyncTest("test (`mobility)", function () {
	           invalidCharTest("`mobility", false);
	        });
	        
	        QUnit.asyncTest("test ({mobility)", function () {
	           invalidCharTest("{mobility", false);
	        });
	        
	        QUnit.asyncTest("test (}mobility)", function () {
	           invalidCharTest("}mobility", false);
	        });
	        
	        QUnit.asyncTest("test (~mobility)", function () {
	           invalidCharTest("~mobility", false);
	        });
	        
	        QUnit.asyncTest("test (—mobility)", function () {
	           invalidCharTest("—mobility", false);
	        });
	        
	        QUnit.asyncTest("test (–mobility)", function () {
	           invalidCharTest("–mobility", false);
	        });
	        
	        QUnit.asyncTest("test (¡mobility)", function () {
	           invalidCharTest("¡mobility", false);
	        });
	        
	        QUnit.asyncTest("test (¦mobility)", function () {
	           invalidCharTest("¦mobility", false);
	        });
	        
	        QUnit.asyncTest("test (|mobility)", function () {
	           invalidCharTest("|mobility", false);
	        });
	        
	        QUnit.asyncTest("test (¨mobility)", function () {
	           invalidCharTest("¨mobility", false);
	        });
	        
	        QUnit.asyncTest("test (´mobility)", function () {
	           invalidCharTest("´mobility", false);
	        });
	        
	        QUnit.asyncTest("test (¯mobility)", function () {
	           invalidCharTest("¯mobility", false);
	        });
	        
	        QUnit.asyncTest("test (¸mobility)", function () {
	           invalidCharTest("¸mobility", false);
	        });
	        
            
            
	        QUnit.asyncTest("test (& mobility)", function () {
	           invalidCharTest("& mobility", true);
	        });
            
            QUnit.asyncTest("test (& &$mobility)", function () {
	           invalidCharTest("& &$mobility", true);
	        });        
            
            QUnit.asyncTest("test (mobility &)", function () {
	           invalidCharTest("mobility &", true);
	        });
            
            QUnit.asyncTest("test (&$mobility &)", function () {
	           invalidCharTest("&$mobility &", true);
	        });
            
            QUnit.asyncTest("test (mobility test &)", function () {
	           invalidCharTest("mobility test &", true);
	        });
            
            QUnit.asyncTest("test (&$mobility test &)", function () {
	           invalidCharTest("&$mobility test &", true);
	        });
	     
	        invalidCharTest = function (searchString, shouldFail) {
	            //arrange
	            var service,
					logonService,
					logonPromise;
	            
	            //act
	            service = new queryService(TestSettings.ntlmTestUrl);
				logonService = new ntlmLogonService(TestSettings.ntlmTestUrl);
				logonPromise = logonService.logon(TestSettings.ntlmTestDomain, TestSettings.ntlmTestUser, TestSettings.ntlmTestPassword);
				
	            //assert
	            logonPromise.done(function (result) {
					service.keywordSearch(searchString)
						.done(function (result) {
							QUnit.ok(result);
							QUnit.equal(Object.prototype.toString.call(result), '[object Array]');
							
							QUnit.start();
	                    })
						.fail(function (XMLHttpRequest, textStatus, errorThrown) {
							QUnit.ok(shouldFail);
							QUnit.start();
	                    });				
	            });
				
				logonPromise.fail(function (XMLHttpRequest, textStatus, errorThrown) {
					QUnit.ok(false, "invalidCharTest failed to logon!");
					QUnit.start();	
	            }); 
	        }
		};
		
		return executeQueryServiceTests;
    });