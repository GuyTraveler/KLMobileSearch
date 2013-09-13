/*global QUnit*/
define(['domain/httpProtocols',
		'unitTests/unitTestSettings'],
    function (httpProtocols, TestSettings) {
        QUnit.module("Testing framework/system");

		QUnit.test("test httpProtocols initializes properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.https, "HTTPS");
			QUnit.equal(httpProtocols.http, "HTTP");
        });
				
		QUnit.test("test httpProtocols.isHttps Parses SSL url correctly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.isHttps(TestSettings.adfsTestUrl), true);
        });
		
				
		QUnit.test("test httpProtocols.isHttps Parses non-SSL url correctly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.isHttps(TestSettings.ntlmTestUrl), false);
        });
					
		QUnit.test("test httpProtocols.isHttps Parses raw HTTPS string properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.isHttps("HTTPS"), true);
        });
		
		QUnit.test("test httpProtocols.isHttps Parses raw HTTP string properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(false, httpProtocols.isHttps("HTTP"));
        });
		
		QUnit.test("test httpProtocols.isHttps Parses empty string properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.isHttps(""), false);
        });
		
		QUnit.test("test httpProtocols.isHttps Parses NULL properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.isHttps(null), false);
        });
		
		QUnit.test("test httpProtocols.parseProtocol Parses SSL url string properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.parseProtocol(TestSettings.adfsTestUrl), httpProtocols.https);
        });
		
		QUnit.test("test httpProtocols.parseProtocol Parses non-SSL url string properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.parseProtocol(TestSettings.ntlmTestUrl), httpProtocols.http);
        });
		
		QUnit.test("test httpProtocols.parseProtocol Parses empty string properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.parseProtocol(""), httpProtocols.http);
        });
		
		QUnit.test("test httpProtocols.parseProtocol Parses NULL properly", function () {
			//arrange
			
			//act
						
			//assert
			QUnit.equal(httpProtocols.parseProtocol(null), httpProtocols.http);
        });
	});