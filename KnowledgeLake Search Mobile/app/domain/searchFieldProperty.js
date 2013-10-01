define([], function () {
    var searchFieldProperty = function(id, name, operator, condition, conjunction) {
        var self = this;
        
		self.id = id;
        self.name = name; 
        self.operator = operator;
        self.condition = condition;
        self.conjunction = conjunction;
              
        return self;
    };
    
    return searchFieldProperty;
});