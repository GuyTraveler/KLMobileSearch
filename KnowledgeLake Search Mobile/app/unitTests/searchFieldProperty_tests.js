/*global QUnit*/
define(['domain/searchFieldProperty',
		'unitTests/unitTestSettings'],
    function (searchFieldProperty, TestSettings) {
		var name = "test",
			operator = "Contains",
			condition = "x eq x",
			conjunction = "Or";
		
		
        QUnit.module("Testing searchFieldProperty");
		
		QUnit.test("test searchFieldProperty ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(searchFieldProperty);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with no parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty();

			//assert
			QUnit.ok(s);
			QUnit.equal(s.name, null);
			QUnit.equal(s.operator, null);
			QUnit.equal(s.condition, null);
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 1 parameter", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(name);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.name, name);
			QUnit.equal(s.operator, null);
			QUnit.equal(s.condition, null);
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 2 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(name, operator);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.name, name);
			QUnit.equal(s.operator, operator);
			QUnit.equal(s.condition, null);
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 3 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(name, operator, condition);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.name, name);
			QUnit.equal(s.operator, operator);
			QUnit.equal(s.condition, condition);
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 4 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(name, operator, condition, conjunction);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.name, name);
			QUnit.equal(s.operator, operator);
			QUnit.equal(s.condition, condition);
			QUnit.equal(s.conjunction, conjunction);
        });
	});