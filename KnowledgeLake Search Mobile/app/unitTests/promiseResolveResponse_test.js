/*global QUnit*/
define(['framework/promiseResponse/promiseResolveResponse'],
    function (promiseResolveResponse) {
        QUnit.module("Testing promiseResolveResponse");
		
		QUnit.test("test promiseResolveResponse can be instantiated with no parameters", function () {
			//arrange
			var response;
			
			//act
			response = new promiseResolveResponse();

			//assert
			QUnit.ok(response);
			QUnit.equal(response.response, null);
        });
		
		QUnit.test("test promiseResolveResponse is properly instantiated with 1 parameter", function () {
			//arrange
			var response,
				code = 400;
			
			//act
			response = new promiseResolveResponse(code);

			//assert
			QUnit.ok(response);			
			QUnit.equal(response.response, code);
        });
	});