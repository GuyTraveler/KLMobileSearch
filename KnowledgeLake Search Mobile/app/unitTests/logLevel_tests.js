/*global QUnit*/
define(['framework/logLevel'],
	function (logLevel) {
		QUnit.module("testing framework/logLevel");
		
		QUnit.test("test logLevel is available and props initialized", function () {
			//arrange
			
			//act
			
			//assert
			QUnit.ok(logLevel);
			QUnit.equal(typeof logLevel, 'object');
			QUnit.equal(typeof logLevel.toLevelString, 'function');
			QUnit.equal(0, logLevel.Verbose);
			QUnit.equal(1, logLevel.Debug);
			QUnit.equal(2, logLevel.Warn);
			QUnit.equal(3, logLevel.Error);
			QUnit.equal(4, logLevel.Fatal);
        });
		
		QUnit.test("test logLevel.toLevelString works with valid numbers", function () {
			//arrange
			
			//act
			
			//assert
			QUnit.equal("Verbose", logLevel.toLevelString(0));
			QUnit.equal("Debug", logLevel.toLevelString(1));
			QUnit.equal("Warn", logLevel.toLevelString(2));
			QUnit.equal("Error", logLevel.toLevelString(3));
			QUnit.equal("Fatal", logLevel.toLevelString(4));
		});
		
		QUnit.test("test logLevel.toLevelString returns 'Verbose' with all types of bad data", function () {
			//arrange
			
			//act
			
			//assert
			QUnit.equal("Verbose", logLevel.toLevelString());
			QUnit.equal("Verbose", logLevel.toLevelString(""));
			QUnit.equal("Verbose", logLevel.toLevelString("sadfs"));
			QUnit.equal("Verbose", logLevel.toLevelString(6));
			QUnit.equal("Verbose", logLevel.toLevelString({}));
		});
    });