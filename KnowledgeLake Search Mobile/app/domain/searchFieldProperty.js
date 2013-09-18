define([], function () {
    var searchFieldProperty = function(name, operator, condition, conjunction) {
        var self = this;
        
        self.name = name; 
        self.operator = operator;
        self.condition = condition;
        self.conjunction = conjunction;
              
        return self;
    };
    
    return searchFieldProperty;
});