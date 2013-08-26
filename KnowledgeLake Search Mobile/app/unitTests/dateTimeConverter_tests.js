/*global QUnit*/
define(['services/dateTimeConverter'],
    function (DateTimeConverter) {
        QUnit.module("Testing services/dateTimeConverter");

        QUnit.test("test dateTimeConverter formatStringParser null", function () {
            //arrange
            var formatString;
            
            //act            
            var result = DateTimeConverter.formatStringParser(formatString);
                        
            //assert
            QUnit.deepEqual(result, []);
        });  
        
        QUnit.test("test dateTimeConverter formatStringParser", function () {
            //arrange
            var formatString = "d/M/yy h:mm t. t.";
            
            //act            
            var result = DateTimeConverter.formatStringParser(formatString);
                        
            //assert
            QUnit.deepEqual(result, ["d", "/", "M", "/", "yy", " ", "h", ":", "mm", " ", "t", ".", " ", "t", "."]);
        }); 
        
        QUnit.test("test dateTimeConverter formatStringParser", function () {
            //arrange
            var formatString = "dd.MM.yyyy HH:mm";
            
            //act            
            var result = DateTimeConverter.formatStringParser(formatString);
                        
            //assert
            QUnit.deepEqual(result, ["dd", ".", "MM", ".", "yyyy", " ", "HH", ":", "mm"]);
        }); 
        
        QUnit.test("test dateTimeConverter calculatePeriod period 2", function () {
            //arrange
            var hour = 11,
                period = 2;
            
            //act            
            var result = DateTimeConverter.calculatePeriod(hour, period);
                        
            //assert
            QUnit.deepEqual(result, "M");
        });
    
        QUnit.test("test dateTimeConverter calculatePeriod hour 11 period 1", function () {
            //arrange
            var hour = 11,
                period = 1;
            
            //act            
            var result = DateTimeConverter.calculatePeriod(hour, period);
                        
            //assert
            QUnit.deepEqual(result, "A");
        });
        
        QUnit.test("test dateTimeConverter calculatePeriod hour 20 period 1", function () {
            //arrange
            var hour = 20,
                period = 1;
            
            //act            
            var result = DateTimeConverter.calculatePeriod(hour, period);
                        
            //assert
            QUnit.deepEqual(result, "P");
        });
        
        QUnit.test("test dateTimeConverter calculatePeriod hour 11 period null", function () {
            //arrange
            var hour = 11;
            
            //act            
            var result = DateTimeConverter.calculatePeriod(hour);
                        
            //assert
            QUnit.deepEqual(result, "AM");
        });
        
        QUnit.test("test dateTimeConverter calculatePeriod hour 20 period null", function () {
            //arrange
            var hour = 20;
            
            //act            
            var result = DateTimeConverter.calculatePeriod(hour);
                        
            //assert
            QUnit.deepEqual(result, "PM");
        });
        
        QUnit.test("test dateTimeConverter formatDate date (2012, 5, 9, 14, 15) formatString d/M/yy h:mm t. t.", function () {
            //arrange
            var date = new Date(2012, 5, 9, 14, 15), 
                formatString = "d/M/yy h:mm t. t.";
            
            //act            
            var result = DateTimeConverter.formatDate(date, formatString);
                        
            //assert
            QUnit.equal(result, "9/6/12 2:15 P. M.");
        });
        
        QUnit.test("test dateTimeConverter formatDate date (2012, 5, 9, 11, 15) formatString d/M/yy h:mm t. t.", function () {
            //arrange
            var date = new Date(2012, 5, 9, 11, 15), 
                formatString = "d/M/yy h:mm t. t.";
            
            //act            
            var result = DateTimeConverter.formatDate(date, formatString);
                        
            //assert
            QUnit.equal(result, "9/6/12 11:15 A. M.");
        });
        
        QUnit.test("test dateTimeConverter formatDate date (1988, 11, 30, 14, 15) formatString dd.MM.yyyy HH:mm", function () {
            //arrange
            var date = new Date(1988, 11, 30, 14, 15), 
                formatString = "dd.MM.yyyy HH:mm";
            
            //act            
            var result = DateTimeConverter.formatDate(date, formatString);
                        
            //assert
            QUnit.equal(result, "30.12.1988 14:15");
        });
        
        QUnit.test("test dateTimeConverter formatDate date (1988, 11, 30, 8, 15) formatString dd.MM.yyyy HH:mm", function () {
            //arrange
            var date = new Date(1988, 11, 30, 8, 15), 
                formatString = "dd.MM.yyyy HH:mm";
            
            //act            
            var result = DateTimeConverter.formatDate(date, formatString);
                        
            //assert
            QUnit.equal(result, "30.12.1988 08:15");
        });
           
        QUnit.test("test dateTimeConverter formatDate date (1988, 11, 30, 8, 8) formatString dd.MM.yyyy HH:mm", function () {
            //arrange
            var date = new Date(1988, 11, 30, 8, 8), 
                formatString = "dd.MM.yyyy HH:mm";
            
            //act            
            var result = DateTimeConverter.formatDate(date, formatString);
                        
            //assert
            QUnit.equal(result, "30.12.1988 08:08");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale null date null", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString();
                        
            //assert
            QUnit.ok(result);
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale zh date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "zh";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "2012/10/30 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale zh-SG date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "zh-SG";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale nl date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "nl";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30-10-2012 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale nl-BE date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "nl-BE";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale en date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "en";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "10/30/2012 3:47 PM");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale en-AU date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "en-AU";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 3:47 PM");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale en-029 date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "en-029";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale en-NZ date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "en-NZ";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 3:47 P.M.");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale en-CA date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "en-CA";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "2012-10-30 3:47 PM");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale en-IN date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "en-IN";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30-10-2012 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale en-MY date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "en-MY";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 3:47 PM");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale fr-BE date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "fr-BE";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30-10-12 15:47");
        }); 
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale fr-CA date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "fr-CA";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "2012-10-30 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale fr-CH date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "fr-CH";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30.10.2012 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale it date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "it";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 15.47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale ja date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "ja";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "2012/10/30 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale ru date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "ru";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30.10.2012 15:47");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale es-AR date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "es-AR";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 3:47 P.M.");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale es-VE date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "es-VE";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30-10-2012 3:47 P.M.");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale es-CO date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "es-CO";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/2012 3:47 P. M.");
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale es-DO date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "es-DO";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "30/10/12 3:47 P. M.");
        });
        
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString locale banana date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            var date = "2012-10-30T15:47:52-05:00", 
                locale = "banana";
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(locale, date);
                        
            //assert
            QUnit.equal(result, "10/30/2012 3:47 PM");
        });
    });