define(["knockout"], function (ko) {
    var documentProperty = function(name, displayName, hidden, value) {
        var self = this;        
        
        self.name = name;
        self.displayName = displayName;
        self.hidden = hidden;
        self.value = value ? value : "";
              
        return self;
    };
    
    return documentProperty;
});