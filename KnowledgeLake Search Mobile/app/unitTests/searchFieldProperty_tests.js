/*global QUnit*/
define(['domain/searchFieldProperty',
		'unitTests/unitTestSettings'],
    function (searchFieldProperty, TestSettings) {
		var id = "hello",
			name = "test",
            type = "DateTime",
			operator = "Contains",
			condition1 = "x eq x",
            condition2 = "x geq y",
			conjunction = "Or";
		
		
        QUnit.module("Testing searchFieldProperty");
		
		QUnit.test("test searchFieldProperty ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(searchFieldProperty);
        });
        
        /*self.id = id;        
        self.name = name; 
        self.type = type;
        self.operator = operator;
        self.condition1 = condition1 ? condition1 : "";
        self.condition2 = condition2 ? condition2 : "";        
        self.conjunction = conjunction;*/
		
		QUnit.test("test searchFieldProperty instantiates properly with no parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty();

			//assert
			QUnit.ok(s);            
			QUnit.equal(s.id, null);
			QUnit.equal(s.name, null);
            QUnit.equal(s.type, null);
			QUnit.equal(s.operator, null);
			QUnit.equal(s.condition1, "");
			QUnit.equal(s.condition2, "");
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 1 parameter", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(id);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.id, id);
			QUnit.equal(s.name, null);
            QUnit.equal(s.type, null);
			QUnit.equal(s.operator, null);
			QUnit.equal(s.condition1, "");
			QUnit.equal(s.condition2, "");
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 2 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(id, name);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.id, id);
			QUnit.equal(s.name, name);
            QUnit.equal(s.type, null);
			QUnit.equal(s.operator, null);
			QUnit.equal(s.condition1, "");
			QUnit.equal(s.condition2, "");
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 3 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(id, name, type);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.id, id);
			QUnit.equal(s.name, name);
            QUnit.equal(s.type, type);
			QUnit.equal(s.operator, null);
			QUnit.equal(s.condition1, "");
			QUnit.equal(s.condition2, "");
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 4 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(id, name, type, operator);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.id, id);
			QUnit.equal(s.name, name);
            QUnit.equal(s.type, type);
			QUnit.equal(s.operator, operator);
			QUnit.equal(s.condition1, "");
			QUnit.equal(s.condition2, "");
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 5 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(id, name, type, operator, condition1);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.id, id);
			QUnit.equal(s.name, name);
            QUnit.equal(s.type, type);
			QUnit.equal(s.operator, operator);
			QUnit.equal(s.condition1, condition1);
			QUnit.equal(s.condition2, "");
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 6 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(id, name, type, operator, condition1, condition2);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.id, id);
			QUnit.equal(s.name, name);
            QUnit.equal(s.type, type);
			QUnit.equal(s.operator, operator);
			QUnit.equal(s.condition1, condition1);
			QUnit.equal(s.condition2, condition2);
			QUnit.equal(s.conjunction, null);
        });
		
		QUnit.test("test searchFieldProperty instantiates properly with 7 parameters", function () {
			//arrange
			var s;
			
			//act
			s = new searchFieldProperty(id, name, type, operator, condition1, condition2, conjunction);

			//assert
			QUnit.ok(s);
			QUnit.equal(s.id, id);
			QUnit.equal(s.name, name);
            QUnit.equal(s.type, type);
			QUnit.equal(s.operator, operator);
			QUnit.equal(s.condition1, condition1);
			QUnit.equal(s.condition2, condition2);
			QUnit.equal(s.conjunction, conjunction);
        });
	});