/*global QUnit*/
define(['services/dateTimeConverter', "unitTests/unitTestSettings"],
    function (DateTimeConverter, TestSettings) {
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
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString date null", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString();
                        
            //assert
            QUnit.ok(result);
        });
        
        QUnit.test("test dateTimeConverter dateTimeToLocaleString date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.dateTimeToLocaleString(TestSettings.testDateTime);
                        
            //assert
            QUnit.equal(result, TestSettings.testDateTimeToLocaleString);
        });  
        
        QUnit.test("test dateTimeConverter toDateString null", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.toDateString();
                        
            //assert
            QUnit.equal(result, null);
        });
        
        QUnit.test("test dateTimeConverter toDateString date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.toDateString(TestSettings.testDateTime);
                        
            //assert
            QUnit.equal(result, TestSettings.testDate);
        });       
        
        QUnit.test("test dateTimeConverter toKlamlDateString null", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.toKlamlDateString();
                        
            //assert
            QUnit.equal(result, "");
        });
        
        QUnit.test("test dateTimeConverter toKlamlDateString date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.toKlamlDateString(new Date(TestSettings.testDateTime));
                        
            //assert
            QUnit.equal(result, TestSettings.testKlamlDateString);
        });
        
        QUnit.test("test dateTimeConverter convertToKlamlDateTime date 2012-10-30T15:47:52-05:00", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.convertToKlamlDateTime(TestSettings.testDateTime);
                        
            //assert
            QUnit.equal(result, TestSettings.testKlamlDateString);
        });
        
        QUnit.test("test dateTimeConverter convertToKlamlDateTimeRange", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.convertToKlamlDateTimeRange(TestSettings.testDate, TestSettings.testSecondaryDate);
                        
            //assert
            QUnit.equal(result.startDate, TestSettings.testStartDateTime);
            QUnit.equal(result.endDate, TestSettings.testEndDateTime);
        });
        
        QUnit.test("test dateTimeConverter convertToKlamlDateTimeEqual", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.convertToKlamlDateTimeEqual(TestSettings.testDate);
                        
            //assert
            QUnit.equal(result.startDate, TestSettings.testStartDateTime);
            QUnit.equal(result.endDate, TestSettings.testEndDateTimeEqual);
        });
        
        QUnit.test("test dateTimeConverter convertToKlamlDateTimeDayEnd", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.convertToKlamlDateTimeDayEnd(TestSettings.testDate);
                        
            //assert
            QUnit.equal(result, TestSettings.testEndDateTimeEqual);
        });     
        
        QUnit.test("test dateTimeConverter convertToKlamlDateTimePreviousDay", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.convertToKlamlDateTimePreviousDay(TestSettings.testDate);
                        
            //assert
            QUnit.equal(result, TestSettings.testPreviousDateTime);
        });         
        
        QUnit.test("test dateTimeConverter getUTCDate", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.getUTCDate(TestSettings.testDate);
                        
            //assert
            QUnit.equal(result, TestSettings.testUTCDate);
        });         
        
        QUnit.test("test dateTimeConverter getUTCDate endOfDay", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.getUTCDate(TestSettings.testDate, true);
                        
            //assert
            QUnit.equal(result, TestSettings.testUTCDateDayEnd);
        });         
        
        QUnit.test("test dateTimeConverter determineOffset", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.determineOffset(new Date(TestSettings.testDate));
                        
            //assert
            QUnit.equal(result, false);
        });            
        
        QUnit.test("test dateTimeConverter isDateEqual true", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.isDateEqual(TestSettings.testDate, TestSettings.testDate);
                        
            //assert
            QUnit.equal(result, true);
        });      
        
        QUnit.test("test dateTimeConverter isDateEqual false", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.isDateEqual(TestSettings.testDate, TestSettings.testSecondaryDate);
                        
            //assert
            QUnit.equal(result, false);
        });      
        
        QUnit.test("test dateTimeConverter adjustDateTime +", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.adjustDateTime(TestSettings.testPreviousDateTime, 1000, "+");
                        
            //assert
            QUnit.equal(result, TestSettings.testUTCDate);
        });      
        
        QUnit.test("test dateTimeConverter adjustDateTime -", function () {
            //arrange
            
            //act            
            var result = DateTimeConverter.adjustDateTime(TestSettings.testDate, 1000, "-");
                        
            //assert
            QUnit.equal(result, TestSettings.testUTCDatePreviousDay);
        });       
    });