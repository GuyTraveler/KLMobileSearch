define([], function () {
    var searchFieldProperty = function(name, operator, condition) {
        var self = this;
        
        self.name = name; 
        self.operator = operator;
        self.condition = condition;
              
        return self;
    };
    
    return searchFieldProperty;
});