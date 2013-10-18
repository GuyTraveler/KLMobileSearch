define(["domain/Constants"], function (Constants) {
    var dateTimeConverter = function() {
        var self = this;
       
        self.dateTimeToLocaleString = function (dateTime) {
            var date = kendo.parseDate(dateTime) !== null ? kendo.parseDate(dateTime) : new Date();
            
            return kendo.toString(date, "g");        
        };
        
        self.toDateString = function (dateTime) {
            if(dateTime && dateTime !== "")
            {
                var date = self.getUTCDate(dateTime);
                
                return kendo.toString(date, "d");
            }
            
            return dateTime;
        }
        
        self.toKlamlDateString = function (dateObject) {
            return self.formatDate(dateObject, "MM/dd/yyyy HH:mm:ss");
        }
        
        self.convertToKlamlDateTime = function (date) {
            var klamlDate = self.getUTCDate(date);
            
            return  self.toKlamlDateString(klamlDate);
        } 
        
        self.convertToKlamlDateTimeRange = function (start, end) {
            var startDate = self.getUTCDate(start),
                endDate = self.getUTCDate(end, true);
            
            return {
                startDate: self.toKlamlDateString(startDate),
                endDate: self.toKlamlDateString(endDate)
            };
        } 
        
        self.convertToKlamlDateTimeEqual = function (date) {
            var startDate = self.getUTCDate(date),
                endDate = self.getUTCDate(date, true);
            
            return {
                startDate: self.toKlamlDateString(startDate),
                endDate: self.toKlamlDateString(endDate)
            };
        } 
        
        self.convertToKlamlDateTimeDayEnd = function (date) {
            var endDate = self.getUTCDate(date, true);
            
            return self.toKlamlDateString(endDate);
        } 
        
        self.convertToKlamlDateTimePreviousDay = function (date) {
            var previousDate = self.adjustDateTime(date, 1000, "-");
            
            return self.toKlamlDateString(previousDate);
        }
        
        self.getUTCDate = function (date, endOfDay) {
            var gmtDate = date ? new Date(date) : new Date();
            var dayEnd = endOfDay ? 86399999 : 0; 
            var offset = self.determineOffset(gmtDate) ? 1 : 0;
            
            return (new Date(gmtDate.valueOf() + offset * gmtDate.getTimezoneOffset() * 60000 + dayEnd));
        }
        
        self.determineOffset = function (dateObject) {
            return (dateObject.getHours() !== 0 && (dateObject.getMinutes() === 0 || dateObject.getMilliseconds === 0));
        }
        
        self.isDateEqual = function (date, duplicateDate) {
            return self.toDateString(date) === self.toDateString(duplicateDate);
        }
        
        self.adjustDateTime = function (date, increment, operation) {
            var dateObject = self.getUTCDate(date),
                adjustedDateTime;
            
            if(operation === Constants.plusOperator)
                adjustedDateTime = new Date(dateObject.valueOf() + increment);
            else             
                adjustedDateTime = new Date(dateObject.valueOf() - increment);
            
            return adjustedDateTime;
        }
        
        self.formatStringParser = function (formatString) {
            var formatArray = [],
                separatorArray = ["/", " ", ":", ".", "-", "T", "Z"],
                part = "";
            
            if(formatString)
            {            
                var formatStringLength = formatString.length;
                
                for(var i = 0; i < formatStringLength; i++)
                {
                    if (separatorArray.indexOf(formatString[i]) === -1)                
                        part = part + formatString[i];
                    
                    else
                    {
                        if(part !== "")
                            formatArray.push(part);
                        
                        formatArray.push(formatString[i]);
                        
                        part = "";
                    }
                }
            }
            
            if(part !== "")
                formatArray.push(part);
            
            return formatArray;
        }
        
        self.formatDate = function (dateTime, formatString) {
            var formatArray = self.formatStringParser(formatString),
                formattedDate = "",
                char,
                periodIndex = 1;
            
            if(dateTime)
            {
                var month = dateTime.getMonth() + 1; // 0-11 (+1)
                var date = dateTime.getDate(); // 1-31
                var year = dateTime.getFullYear(); // xxxx
                
                var hour = dateTime.getHours(); // 0-23 (if greater than 12 do -12 and pm)
                var minute = dateTime.getMinutes(); // 0-59       
                var second = dateTime.getSeconds();
                
                for(i = 0; i < formatArray.length; i++)
                {                
                    switch(formatArray[i])
                    {
                        case "d":
                            char = date;
                            break;
                        case "dd":
                            if(date < 10)
                                char = "0" + date.toString();
                            else
                                char = date;
                            break;                    
                        case "h":
                            if(hour > 12)
                                char = hour - 12;
                            else
                                char = hour;
                            break;
                        case "HH": 
                            if(hour < 10)
                                char = "0" + hour.toString();
                            else
                                char = hour;
                            break;
                        case "mm":
    						if(minute < 10)
                                char = "0" + minute.toString();
                            else
                                char = minute;
                            break;
                        case "M":
                            char = month;
                            break;
                        case "MM":
                            if(month < 10)
                                char = "0" + month.toString();
                            else
                                char = month;
                            break;
                        case "yy":
                            char = year.toString().substr((year.toString().length) - 2);
                            break;
                        case "yyyy":
                            char = year;
                            break;
                        case "t":
                            char = self.calculatePeriod(hour, periodIndex);
                            periodIndex++;
                            break;
                        case "tt":
                            char = self.calculatePeriod(hour);
                            break;
                        case "ss":
                            if(second < 10)
                                char = "0" + second.toString();
                            else
                                char = second;
                            break;
                        default:
                            char = formatArray[i];                    
                    }
                    
                    formattedDate = formattedDate + char.toString();
                }
            }
            
            return formattedDate;
        };
        
        self.calculatePeriod = function (hour, periodIndex) {
            if(periodIndex)
            {
                if(periodIndex === 1)
                {
                    if(hour > 11)
                        return "P";
                    else
                        return "A";
                }
                else
                    return "M";
            }
            else
            {
                if(hour > 11)
                    return "PM";
                else
                    return "AM";
            }
        }
       
        return self;
    };
    
    return new dateTimeConverter();
});