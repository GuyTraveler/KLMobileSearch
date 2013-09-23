/*global QUnit*/
define(['domain/catalogPropertyControlType'],
    function (catalogPropertyControlType) {
        QUnit.module("Testing catalogPropertyControlType");
		
		QUnit.test("test catalogPropertyControlType + properties ok", function () {
			//arrange
			
			//act

			//assert
			QUnit.ok(catalogPropertyControlType);
			QUnit.ok(catalogPropertyControlType.Number);
			QUnit.ok(catalogPropertyControlType.TextBox);
			QUnit.ok(catalogPropertyControlType.DropDown);
			QUnit.ok(catalogPropertyControlType.Calendar);
			QUnit.ok(catalogPropertyControlType.RadioButton);
			QUnit.ok(catalogPropertyControlType.ComboBox);
			
			QUnit.equal(catalogPropertyControlType.Number, "Number");
			QUnit.equal(catalogPropertyControlType.TextBox, "TextBox");
			QUnit.equal(catalogPropertyControlType.DropDown, "DropDown");
			QUnit.equal(catalogPropertyControlType.Calendar, "Calendar");
			QUnit.equal(catalogPropertyControlType.RadioButton, "RadioButton");
			QUnit.equal(catalogPropertyControlType.ComboBox, "ComboBox");
        });
	});