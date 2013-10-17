define(["framework/logLevel"], function(logLevel) {
	
    var isUnitTesting = true, 
	    loggingLevel = logLevel.Verbose;
	 
	var config = {           
	   baseUrl: 'app/',
	   paths: {
		   //lib
	       jquery: 'lib/jquery',
	       kendoMain: 'lib/kendo.all.min',
	       knockout: 'lib/knockout',
           knockoutMapping: 'lib/knockout.mapping',
	       ntlm: 'lib/ntlm',
	       i18n: 'lib/i18n',
		   jsUri: 'lib/jsUri',
           CryptoJS: 'lib/aes',
           moment: 'lib/moment',
           
           // kendo culture dependencies
           culture_de: 'lib/culture/kendo.culture.de.min',
           culture_deAT: 'lib/culture/kendo.culture.de-AT.min',
           culture_deCH: 'lib/culture/kendo.culture.de-CH.min',
           culture_deDE: 'lib/culture/kendo.culture.de-DE.min',
           culture_deLI: 'lib/culture/kendo.culture.de-LI.min',
           culture_deLU: 'lib/culture/kendo.culture.de-LU.min',
           culture_en: 'lib/culture/kendo.culture.en.min',
           culture_en029: 'lib/culture/kendo.culture.en-029.min',
           culture_enAU: 'lib/culture/kendo.culture.en-AU.min',
           culture_enBZ: 'lib/culture/kendo.culture.en-BZ.min',
           culture_enCA: 'lib/culture/kendo.culture.en-CA.min',
           culture_enGB: 'lib/culture/kendo.culture.en-GB.min',
           culture_enIE: 'lib/culture/kendo.culture.en-IE.min',
           culture_enIN: 'lib/culture/kendo.culture.en-IN.min',
           culture_enJM: 'lib/culture/kendo.culture.en-JM.min',
           culture_enMY: 'lib/culture/kendo.culture.en-MY.min',
           culture_enNZ: 'lib/culture/kendo.culture.en-NZ.min',
           culture_enPH: 'lib/culture/kendo.culture.en-PH.min',
           culture_enSG: 'lib/culture/kendo.culture.en-SG.min',
           culture_enTT: 'lib/culture/kendo.culture.en-TT.min',
           culture_enUS: 'lib/culture/kendo.culture.en-US.min',
           culture_enZA: 'lib/culture/kendo.culture.en-ZA.min',
           culture_enZW: 'lib/culture/kendo.culture.en-ZW.min',
           culture_es: 'lib/culture/kendo.culture.es.min',
           culture_esAR: 'lib/culture/kendo.culture.es-AR.min',
           culture_esBO: 'lib/culture/kendo.culture.es-BO.min',
           culture_esCL: 'lib/culture/kendo.culture.es-CL.min',
           culture_esCO: 'lib/culture/kendo.culture.es-CO.min',
           culture_esCR: 'lib/culture/kendo.culture.es-CR.min',
           culture_esDO: 'lib/culture/kendo.culture.es-DO.min',
           culture_esEC: 'lib/culture/kendo.culture.es-EC.min',
           culture_esES: 'lib/culture/kendo.culture.es-ES.min',
           culture_esGT: 'lib/culture/kendo.culture.es-GT.min',
           culture_esHN: 'lib/culture/kendo.culture.es-HN.min',
           culture_esMX: 'lib/culture/kendo.culture.es-MX.min',
           culture_esNI: 'lib/culture/kendo.culture.es-NI.min',
           culture_esPA: 'lib/culture/kendo.culture.es-PA.min',
           culture_esPE: 'lib/culture/kendo.culture.es-PE.min',
           culture_esPR: 'lib/culture/kendo.culture.es-PR.min',
           culture_esPY: 'lib/culture/kendo.culture.es-PY.min',
           culture_esSV: 'lib/culture/kendo.culture.es-SV.min',
           culture_esUS: 'lib/culture/kendo.culture.es-US.min',
           culture_esUY: 'lib/culture/kendo.culture.es-UY.min',
           culture_esVE: 'lib/culture/kendo.culture.es-VE.min',
           culture_fr: 'lib/culture/kendo.culture.fr.min',
           culture_frBE: 'lib/culture/kendo.culture.fr-BE.min',
           culture_frCA: 'lib/culture/kendo.culture.fr-CA.min',
           culture_frCH: 'lib/culture/kendo.culture.fr-CH.min',
           culture_frFR: 'lib/culture/kendo.culture.fr-FR.min',
           culture_frLU: 'lib/culture/kendo.culture.fr-LU.min',
           culture_frMC: 'lib/culture/kendo.culture.fr-MC.min',
           culture_it: 'lib/culture/kendo.culture.it.min',
           culture_itCH: 'lib/culture/kendo.culture.it-CH.min',
           culture_itIT: 'lib/culture/kendo.culture.it-IT.min',
           culture_ja: 'lib/culture/kendo.culture.ja.min',
           culture_jaJP: 'lib/culture/kendo.culture.ja-JP.min',
           culture_ko: 'lib/culture/kendo.culture.ko.min',
           culture_koKR: 'lib/culture/kendo.culture.ko-KR.min',
           culture_nl: 'lib/culture/kendo.culture.nl.min',
           culture_nlBE: 'lib/culture/kendo.culture.nl-BE.min',
           culture_nlNL: 'lib/culture/kendo.culture.nl-NL.min',
           culture_pt: 'lib/culture/kendo.culture.pt.min',
           culture_ptBR: 'lib/culture/kendo.culture.pt-BR.min',
           culture_ptPT: 'lib/culture/kendo.culture.pt-PT.min',
           culture_ru: 'lib/culture/kendo.culture.ru.min',
           culture_ruRU: 'lib/culture/kendo.culture.ru-RU.min',
           culture_ruAU: 'lib/culture/kendo.culture.ru-UA.min',
           culture_zh: 'lib/culture/kendo.culture.zh.min',
           culture_zhCHS: 'lib/culture/kendo.culture.zh-CHS.min',
           culture_zhCHT: 'lib/culture/kendo.culture.zh-CHT.min',
           culture_zhCN: 'lib/culture/kendo.culture.zh-CN.min',
           culture_zhHans: 'lib/culture/kendo.culture.zh-Hans.min',
           culture_zhHant: 'lib/culture/kendo.culture.zh-Hant.min',
           culture_zhHK: 'lib/culture/kendo.culture.zh-HK.min',
           culture_zhMO: 'lib/culture/kendo.culture.zh-MO.min',
           culture_zhSG: 'lib/culture/kendo.culture.zh-SG.min',
           culture_zhTW: 'lib/culture/kendo.culture.zh-TW.min'
       },
	   shim: {
	       jquery: {
	           exports: 'jquery'
	       },
	       knockout: {
	           exports: 'ko'  
	       },
	       kendoMain: {
	           deps: ['jquery'],
	           exports: 'kendoMain'               
	       },
		   jsUri: {
			   exports: 'jsUri'
           },
           CryptoJS: {
               exports: 'CryptoJS'
           },
           moment: {
			   exports: 'moment'
           }
	   },
	   map: {              
		   '*': {
			   //domain
			   'application': 'domain/application',
			   
               //factory
			   'kendo': 'factory/kendoFactory',
			   'FileManagement': 'factory/fileManagementFactory',
			   'emailComposer': 'factory/emailComposerFactory',
               
               //framework
			   'keyValuePair': 'framework/keyValuePair',
			   'logLevel': 'framework/logLevel',
			   'extensions': 'framework/extensions',
			   'logger': 'framework/logger',
               'guid': 'framework/guid',
			   'Uri': 'jsUri',
			   
               //service locations               
               //sharepoint wrappers
			   'IAuthenticationService': 'services/sharepoint/authenticationService',
			   'IWebsService': 'services/sharepoint/websService',
			   'ISiteDataService': 'services/sharepoint/siteDataService',
               'ISearchService': 'services/sharepoint/searchService',
			   'IListsService': 'services/sharepoint/listsService',
               
               //ours
			   'ISiteDataCachingService': 'services/siteDataCachingService',             
			   'INtlmLogonService': 'services/ntlmLogonService',
			   'IClaimsLogonService': 'services/claimsLogonService',
			   'IDocumentService': 'services/documentService',
			   'IUserNameParser': 'services/userNameParser'
	       }
	   },
	   logLevel: loggingLevel,
	   /******custom configuration*******/
	   /*       config: {
	       i18n: {
	           locale: 'es'
	       }  
	   },*/
	   isQunit: isUnitTesting
	};
	
	return config;
});