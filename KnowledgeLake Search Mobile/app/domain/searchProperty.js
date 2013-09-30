define(["knockout"], function (ko) {
    var searchProperty = function(choices, controlType, hidden, description, dataType, name, id, operators) {
        var self = this;        
        
        self.choices = choices ? ko.observableArray(choices) : ko.observableArray([]);
        self.controlType = controlType;
        self.hidden = hidden;
        self.description = description;
        self.dataType = dataType;
        self.name = name; 
        self.id = id;
        
        self.conjunction = ko.observable(true);
        self.operators = operators ? ko.observableArray(operators) : ko.observableArray([]);
        self.selectedOperator = ko.observable("");
        self.selectedProperty = ko.observable(self.name);
        self.value = ko.observable("");
		self.key = ko.computed(function () {
			return (self.name ? self.name : "") + self.selectedOperator();
        });
		self.conjunctionVisible = ko.observable(true);
              
        return self;
    };
    
    return searchProperty;
});