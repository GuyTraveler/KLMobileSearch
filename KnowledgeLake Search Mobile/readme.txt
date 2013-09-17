KnowledgeLake Mobile Search
READ ME
Steve Danner
09-17-2013

Summary:
KnowledgeLake Mobile Search, at the time of this writing, is a Telerik Icenium-based mobile application written in 
javascript/HTML5/CSS3 for the Android and iOS operating systems with the goal to add more OS support later.  This
readme will outline the 3rd party libraries used, the project architecture and foldering structure, and any helpful
hints or gotchas that the mobile development team deems important for the readme.

Source Control:
GitHub repo (Primary): https://github.com/srd8580/KLMobileSearch.git
TFS source (secondary): https://devtfs.knowledgelake.com:8081/DefaultCollection/Mobile%20Search%20(Scrum)
TFS Project portal: https://devtfs.knowledgelake.com/sites/DefaultCollection/Mobile%20Search%20(Scrum)

Tools:
Telerik Icenium -- primary IDE and build tool (http://www.icenium.com/)
	* IDE
	* Build
	* Beta package deployment

Cordova (PhoneGap) -- JavaScript API to interface with native OS functionality via JavaScript wrappers (http://phonegap.com/)
	* InAppBrowser - http://docs.phonegap.com/en/2.3.0/cordova_inappbrowser_inappbrowser.md.html
	* SoftKeyBoard - https://github.com/phonegap/phonegap-plugins/tree/master/Android/SoftKeyboard

FinalBuilder (finalbuilder2.knowledgelake.com)
	* pulls source from GitHub and pushes zipped source to TFS nightly
	* on-premise, web based build of the application
	* deploys web based build to http://cs5appsdemo.knowledgelake.com:3000/

JavaScript libraries:
	* jQuery
	* RequireJS
		* i18n
	* KnockoutJS
		* Knockout Mapping
	* Telerik Kendo Mobile
	* aes.js
	* jsUri.js
	* ntlm.js
	* QUnit.js

Folder Structure:
- Root:  index.html, test.html -- primary app entry points and OOTB cordova library	
	- App:  require configuration, initializer javascript
		- domain:  application domain object definitions
			- promiseResponse:  domain objects used in conjunction with async promise return calls
		- factory:  factory classes to create service instances based on certain input values
		- framework:  application agnostic libraries 
			- knockout:  custom KnockoutJS bindings 
		- images:  application images
		- lib:  3rd party libraries
		- mocks:  'mock' implementations of interfaces or 3rd party libraries that are used for unit testing
		- nls:  localizable resource scripts
		- services:  application level services
			- imaging:  wrappers around KnowledgeLake Imaging web services
			- sharepoint: wrappers around SharePoint base web services
			- soapTemplates:  XML templates used for generating the proper SOAP packets when issuing POST commands to SharePoint or Imaging web services
		- styles: all CSS stylesheets used in the application, conventionally, naned after the view/viewmodel (see Conventions)
		- unitTests:  all QUnit unit test modules
		- viewmodels:  all view model module definitions (see Conventions)
		- views:  all HTML views (see Conventions)

Conventions: 
- app agnostic code goes in 'framework'
- app specific service code goes in 'services'
- app modules are created as such:
	- <moduleName>ViewModel.js in the 'viewmodels' folder
	- <moduleName>View.html in the 'views' folder
	- <moduleName>Styles.css in the 'styles' folder
	- add a placeholder for the view in index.html as:
		<div data-bind="kendoView: { id: '<moduleName>' }, attr: { 'data-title': '<viewTitle>', 'data-role': 'view' }">            
    	</div>