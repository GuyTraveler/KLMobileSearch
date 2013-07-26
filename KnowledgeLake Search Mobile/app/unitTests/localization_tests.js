/*global QUnit*/
define(['require',
        'i18n!nls/strings',
        'nls/root/strings',
        'nls/de/strings',
        'nls/es/strings'],
    function (require, localizedStrings, enStrings, deStrings, esStrings) {
        QUnit.module("Testing localization");
        
        
        QUnit.test("Test loading different locales works", function () {
            //arrange
            
            //act
            
            //assert
            QUnit.ok(localizedStrings.appTitle);
            QUnit.ok(enStrings.appTitle);
            QUnit.ok(deStrings.appTitle);
            QUnit.ok(esStrings.appTitle);
            
            QUnit.notEqual(enStrings.appTitle, deStrings.appTitle);
            QUnit.notEqual(enStrings.appTitle, esStrings.appTitle);
            QUnit.notEqual(esStrings.appTitle, deStrings.appTitle);
        });
        
        QUnit.test("Test proper locale strings loaded", function () {
            //arrange
            var testStrings,
                browserLang = navigator.language.substring(0, 2);
            
            //act
            if (browserLang == "de") {
                testStrings = deStrings;   
            }
            else if (browserLang == "es") {
                testStrings = esStrings;   
            }
            else {  //en
                testStrings = enStrings;
            }
            
            //assert
            QUnit.equal(testStrings.appTitle, localizedStrings.appTitle);
        });
    });
