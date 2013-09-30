/*global QUnit*/
define(['domain/searchProperty',
		'unitTests/unitTestSettings'],
    function (searchProperty, TestSettings) {
		QUnit.module("Testing searchProperty");
		
		QUnit.test("test searchProperty ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(searchProperty);
        });
		
		QUnit.test("test searchProperty with 0 parameters OK", function () {
			//arrange
			var prop;
			
			//act
			prop = new searchProperty();

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), []);
			QUnit.equal(prop.controlType, null);
			QUnit.equal(prop.hidden, null);
			QUnit.equal(prop.description, null);
			QUnit.equal(prop.dataType, null);
			QUnit.equal(prop.name, null);
			QUnit.equal(prop.id, null);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), []);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), null);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), "");
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with 1 parameter OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"];
			
			//act
			prop = new searchProperty(choices);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, null);
			QUnit.equal(prop.hidden, null);
			QUnit.equal(prop.description, null);
			QUnit.equal(prop.dataType, null);
			QUnit.equal(prop.name, null);
			QUnit.equal(prop.id, null);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), []);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), null);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), "");
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with 2 parameters OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"],
				ctlType = "Text";
			
			//act
			prop = new searchProperty(choices, ctlType);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, ctlType);
			QUnit.equal(prop.hidden, null);
			QUnit.equal(prop.description, null);
			QUnit.equal(prop.dataType, null);
			QUnit.equal(prop.name, null);
			QUnit.equal(prop.id, null);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), []);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), null);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), "");
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with 3 parameters OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"],
				ctlType = "Text",
				hdn = true;
			
			//act
			prop = new searchProperty(choices, ctlType, hdn);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, ctlType);
			QUnit.equal(prop.hidden, hdn);
			QUnit.equal(prop.description, null);
			QUnit.equal(prop.dataType, null);
			QUnit.equal(prop.name, null);
			QUnit.equal(prop.id, null);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), []);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), null);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), "");
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with 4 parameters OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"],
				ctlType = "Text",
				hdn = true,
				desc = "test desc";
			
			//act
			prop = new searchProperty(choices, ctlType, hdn, desc);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, ctlType);
			QUnit.equal(prop.hidden, hdn);
			QUnit.equal(prop.description, desc);
			QUnit.equal(prop.dataType, null);
			QUnit.equal(prop.name, null);
			QUnit.equal(prop.id, null);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), []);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), null);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), "");
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with 5 parameters OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"],
				ctlType = "Text",
				hdn = true,
				desc = "test desc",
				type = "Choice";
			
			//act
			prop = new searchProperty(choices, ctlType, hdn, desc, type);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, ctlType);
			QUnit.equal(prop.hidden, hdn);
			QUnit.equal(prop.description, desc);
			QUnit.equal(prop.dataType, type);
			QUnit.equal(prop.name, null);
			QUnit.equal(prop.id, null);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), []);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), null);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), "");
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with 6 parameters OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"],
				ctlType = "Text",
				hdn = true,
				desc = "test desc",
				type = "Choice",
				name = "Title";
			
			//act
			prop = new searchProperty(choices, ctlType, hdn, desc, type, name);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, ctlType);
			QUnit.equal(prop.hidden, hdn);
			QUnit.equal(prop.description, desc);
			QUnit.equal(prop.dataType, type);
			QUnit.equal(prop.name, name);
			QUnit.equal(prop.id, null);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), []);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), name);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), name);
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with 7 parameters OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"],
				ctlType = "Text",
				hdn = true,
				desc = "test desc",
				type = "Choice",
				name = "Title",
				id = "500";
			
			//act
			prop = new searchProperty(choices, ctlType, hdn, desc, type, name, id);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, ctlType);
			QUnit.equal(prop.hidden, hdn);
			QUnit.equal(prop.description, desc);
			QUnit.equal(prop.dataType, type);
			QUnit.equal(prop.name, name);
			QUnit.equal(prop.id, id);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), []);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), name);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), name);
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with 8 parameters OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"],
				ctlType = "Text",
				hdn = true,
				desc = "test desc",
				type = "Choice",
				name = "Title",
				id = "500",
				operators = [">", "<"];
			
			//act
			prop = new searchProperty(choices, ctlType, hdn, desc, type, name, id, operators);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, ctlType);
			QUnit.equal(prop.hidden, hdn);
			QUnit.equal(prop.description, desc);
			QUnit.equal(prop.dataType, type);
			QUnit.equal(prop.name, name);
			QUnit.equal(prop.id, id);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), operators);
			QUnit.equal(prop.selectedOperator(), "");
			QUnit.equal(prop.selectedProperty(), name);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), name);
			QUnit.equal(prop.conjunctionVisible(), true);
        });
		
		QUnit.test("test searchProperty with selectedOperator OK", function () {
			//arrange
			var prop,
				choices = ["1", "2"],
				ctlType = "Text",
				hdn = true,
				desc = "test desc",
				type = "Choice",
				name = "Title",
				id = "500",
				operators = [">", "<"],
				selectedOp = ">";
			
			//act
			prop = new searchProperty(choices, ctlType, hdn, desc, type, name, id, operators);
			prop.selectedOperator(selectedOp);

			//assert
			QUnit.ok(prop);
			QUnit.deepEqual(prop.choices(), choices);
			QUnit.equal(prop.controlType, ctlType);
			QUnit.equal(prop.hidden, hdn);
			QUnit.equal(prop.description, desc);
			QUnit.equal(prop.dataType, type);
			QUnit.equal(prop.name, name);
			QUnit.equal(prop.id, id);
			
			QUnit.equal(prop.conjunction(), true);
			QUnit.deepEqual(prop.operators(), operators);
			QUnit.equal(prop.selectedOperator(), selectedOp);
			QUnit.equal(prop.selectedProperty(), name);
			QUnit.equal(prop.value(), "");
			QUnit.equal(prop.key(), name + selectedOp);
			QUnit.equal(prop.conjunctionVisible(), true);
        });
	});