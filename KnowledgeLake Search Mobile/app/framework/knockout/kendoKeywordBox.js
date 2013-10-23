define(['knockout', 'jquery', 'kendo'],
    function (ko, $, kendo) {
		ko.bindingHandlers.kendoKeywordBox = {
            init: function(element, valueAccessor) {
                if(valueAccessor().onSelect && valueAccessor().onChange)
                {
                    $(element).kendoAutoComplete({                    
                        select: valueAccessor().onSelect,
                        change: valueAccessor().onChange,
                        placeholder: valueAccessor().placeholder,
                        minLength: 0
                    });
                }
                
                else if(valueAccessor().placeholder)
                {
                    $(element).kendoAutoComplete({
                        placeholder: valueAccessor().placeholder,
                        minLength: 0
                    });
                }
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});