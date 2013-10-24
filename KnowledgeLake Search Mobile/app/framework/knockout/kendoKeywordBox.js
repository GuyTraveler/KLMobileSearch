define(['knockout', 'jquery', 'kendo'],
    function (ko, $, kendo) {
		ko.bindingHandlers.kendoKeywordBox = {
            init: function(element, valueAccessor) {
                var autoComplete = $(element).kendoAutoComplete({                    
                                        select: valueAccessor().onSelect,
                                        change: valueAccessor().onChange,
                                        placeholder: valueAccessor().placeholder,
                                        minLength: 0
                                    }).data("kendoAutoComplete");
                
                valueAccessor().element = autoComplete;
            },
            update: function(element, valueAccessor) {
                
            }
        };
	});