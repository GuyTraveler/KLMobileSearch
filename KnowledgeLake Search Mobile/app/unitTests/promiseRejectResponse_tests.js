/*global QUnit*/
define(['domain/promiseResponse/promiseRejectResponse'],
    function (promiseRejectResponse) {
        QUnit.module("Testing promiseRejectResponse");
		
		QUnit.test("test promiseRejectResponse can be instantiated with no parameters", function () {
			//arrange
			var response;
			
			//act
			response = new promiseRejectResponse();

			//assert
			QUnit.ok(response);
			QUnit.equal(response.response, null);
			QUnit.equal(response.error, null);
        });
		
		QUnit.test("test promiseRejectResponse is properly instantiated with 1 parameter", function () {
			//arrange
			var response,
				code = 400;
			
			//act
			response = new promiseRejectResponse(code);

			//assert
			QUnit.ok(response);			
			QUnit.equal(response.response, code);
			QUnit.equal(response.error, null);
        });
		
		QUnit.test("test promiseRejectResponse is properly instantiated with 2 parameters", function () {
			//arrange
			var response,
				code = 400,
				errorMsg = "howdy";
			
			//act
			response = new promiseRejectResponse(code, errorMsg);

			//assert
			QUnit.ok(response);			
			QUnit.equal(response.response, code);
			QUnit.equal(response.error, errorMsg);
        });
	});