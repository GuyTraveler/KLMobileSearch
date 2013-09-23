/*global QUnit*/
define(['domain/result',
		'unitTests/unitTestSettings'],
    function (result, TestSettings) {
        QUnit.module("Testing result");
		
		QUnit.test("test result ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(result);
        });
		
		QUnit.test("test result instantiates properly with no parameters", function () {
			//arrange
			var res;
			
			//act
			res = new result();

			//assert
			QUnit.ok(res);
			QUnit.equal(res.url, null);
			QUnit.deepEqual(res.metadata, {});
			QUnit.equal(res.title, null);
        });
		
		QUnit.test("test result instantiates properly with 1 parameter", function () {
			//arrange
			var res;
			
			//act
			res = new result(TestSettings.ntlmTestUrl);

			//assert
			QUnit.ok(res);
			QUnit.equal(res.url, TestSettings.ntlmTestUrl);
			QUnit.deepEqual(res.metadata, {});
			QUnit.equal(res.title, null);
        });
		
		QUnit.test("test result instantiates properly with 2 parameters (empty title)", function () {
			//arrange
			var res,
				metadata = {
					hello: 'test'
                };
			
			//act
			res = new result(TestSettings.ntlmTestUrl, metadata);

			//assert
			QUnit.ok(res);
			QUnit.equal(res.url, TestSettings.ntlmTestUrl);
			QUnit.deepEqual(res.metadata, metadata);
			QUnit.equal(res.title, null);
        });
		
		QUnit.test("test result instantiates properly with 2 parameters (lower case title only)", function () {
			//arrange
			var res,
				metadata = {
					hello: 'test',
					title: 'test'
                };
			
			//act
			res = new result(TestSettings.ntlmTestUrl, metadata);

			//assert
			QUnit.ok(res);
			QUnit.equal(res.url, TestSettings.ntlmTestUrl);
			QUnit.deepEqual(res.metadata, metadata);
			QUnit.equal(res.title, metadata.title);
        });
		
		QUnit.test("test result instantiates properly with 2 parameters (upper case title only)", function () {
			//arrange
			var res,
				metadata = {
					hello: 'test',
					Title: 'test'
                };
			
			//act
			res = new result(TestSettings.ntlmTestUrl, metadata);

			//assert
			QUnit.ok(res);
			QUnit.equal(res.url, TestSettings.ntlmTestUrl);
			QUnit.deepEqual(res.metadata, metadata);
			QUnit.equal(res.title, metadata.Title);
        });
		
		QUnit.test("test result instantiates properly with 2 parameters (upper case title trumps lower case title)", function () {
			//arrange
			var res,
				metadata = {
					hello: 'test',
					Title: 'test',
					title: 'fdsfadf'
                };
			
			//act
			res = new result(TestSettings.ntlmTestUrl, metadata);

			//assert
			QUnit.ok(res);
			QUnit.equal(res.url, TestSettings.ntlmTestUrl);
			QUnit.deepEqual(res.metadata, metadata);
			QUnit.equal(res.title, metadata.Title);
			QUnit.notEqual(res.title, metadata.title);
        });
	});