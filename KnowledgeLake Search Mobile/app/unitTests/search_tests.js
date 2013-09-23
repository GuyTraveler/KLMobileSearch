/*global QUnit*/
define(['domain/search',
		'unitTests/unitTestSettings'],
    function (search, TestSettings) {
        QUnit.module("Testing search");
		
		QUnit.test("test search ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(search);
        });
		
		QUnit.test("test search instantiates properly with no parameters", function () {
			//arrange
			var s;
			
			//act
			s = new search();

			//assert
			QUnit.ok(s);
			QUnit.equal(s.siteUrl, null);
			QUnit.equal(s.title, null);
			QUnit.equal(s.type, null);
			QUnit.equal(s.query, "");
        });
		
		QUnit.test("test search instantiates properly with 1 parameter", function () {
			//arrange
			var s;
			
			//act
			s = new search(TestSettings.ntlmTestUrl);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.siteUrl, TestSettings.ntlmTestUrl);
			QUnit.equal(s.title, null);
			QUnit.equal(s.type, null);
			QUnit.equal(s.query, "");
        });
		
		QUnit.test("test search instantiates properly with 2 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new search(TestSettings.ntlmTestUrl, TestSettings.siteTitle);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.siteUrl, TestSettings.ntlmTestUrl);
			QUnit.equal(s.title, TestSettings.siteTitle);
			QUnit.equal(s.type, null);
			QUnit.equal(s.query, "");
        });
		
		QUnit.test("test search instantiates properly with 3 parameters", function () {
			//arrange
			var s,
				type = 1;
			
			//act
			s = new search(TestSettings.ntlmTestUrl, TestSettings.siteTitle, type);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.siteUrl, TestSettings.ntlmTestUrl);
			QUnit.equal(s.title, TestSettings.siteTitle);
			QUnit.equal(s.type, type);
			QUnit.equal(s.query, "");
        });
		
		QUnit.test("test search instantiates properly with 4 parameters", function () {
			//arrange
			var s,
				type = 1;
			
			//act
			s = new search(TestSettings.ntlmTestUrl, TestSettings.siteTitle, type, TestSettings.testQueryXml);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.siteUrl, TestSettings.ntlmTestUrl);
			QUnit.equal(s.title, TestSettings.siteTitle);
			QUnit.equal(s.type, type);
			QUnit.equal(s.query, TestSettings.testQueryXml);
        });
	});