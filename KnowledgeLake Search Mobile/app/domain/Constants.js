define(["application"], function (application) {

	return {
		maxResults: 100,  //TODO: change this to something higher once we have dynamic paging
		logLineFormat: "{logLevel}: {message}",
		
		//sharepoint
	    sharePointDelimiter: ";#",
	    sharePoint2013MajorVersion: 15, 
	    phrase: "Q2FyaGFydHQ=",
        IsDocument: "IsDocument",
		
		//office 365
		office365STS: "https://login.microsoftonline.com/extSTS.srf",
		office365LoginUriPart: "_forms/default.aspx?wa=wsignin1.0",
		samlTemplateUrl: "app/services/soapTemplates/Office365/SAML.xml",
			    
		//controls
	    numberOperators: [ "=", ">", "<", ">=", "<=", application.strings.Range ],
	    textboxOperators: [ "=", application.strings.Contains, application.strings.StartsWith, application.strings.Like, application.strings.IsNotNull ],
	    dropdownOperators: [ "=", application.strings.Contains, application.strings.StartsWith, application.strings.IsNotNull ],
	    calendarOperators: [ "=", ">", "<", ">=", "<=", application.strings.Range, application.strings.IsNotNull ],
	    radiobuttonOperators: [ "=", application.strings.IsNotNull ],
	    comboboxOperators: [ "=", application.strings.Contains, application.strings.StartsWith, application.strings.IsNotNull ],
	    
	    radiobuttonValues: [ application.strings.Yes, application.strings.No, application.strings.NotSet ],
		
		//email
		supportEmailAddress: "steve.danner@knowledgelake.com",  //TODO: get from Karen
		emailSubject: "KnowledgeLake Mobile Logs",
		emailBodyStart: "\n\n\Application Attached...\n\n",
		emailIsHtml: true,
        
        // comparison
        plusOperator: "+",
        minusOperator: "-",
        equalOperator: "=",
        greaterThanOperator: ">",
        lessThanOrEqualOperator: "<=",
        greaterThanOrEqualOperator: ">=",
        dateTimeComparator: "DateTime",
        containsComparator: "contains",
        beginsWithComparator: "beginswith",
        isNotNullComparator: "isnotnull",
        
        // document service query parts
        idQuery: "<Query><Where><Eq><FieldRef Name=\"ID\" /><Value Type=\"Number\">{cacheListItemId}</Value></Eq></Where></Query>",
        contentTypeIdViewField: "<ViewFields Properties=\"true\" xmlns=\"\"><FieldRef Name=\"ContentTypeID\" /></ViewFields>",
        propertiesViewFields: "<ViewFields Properties=\"true\" xmlns=\"\">{viewFields}</ViewFields>"
	};
});