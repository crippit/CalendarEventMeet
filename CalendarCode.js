function createCalendarEvent() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var calendarID = 'jdkbi72mum5qb12knbq0n75ik4@group.calendar.google.com'
  var calendar = CalendarApp.getCalendarById(calendarID);
  
  var startRow = 2;  // First row of data to process - 2 exempts my header row
  var numRows = sheet.getLastRow();   // Number of rows to process
  var numColumns = sheet.getLastColumn();
  
  var dataRange = sheet.getRange(startRow, 1, numRows-1, numColumns);
  var data = dataRange.getValues();
  
  var complete = "Done";
  
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    var name = row[0]; //Event Name
    var descriptions = row[1];  //Session Description
    var startDate = new Date(row[2]);  //Start Date
    var endDate = new Date(row[3]); //End Date
    var people = row[4]; //People to invite
    var eventIdent = row[5];//EventID
    var done = row[6]; //event marked Done
    
    
    if (done != complete) {
    var attendees = people.split(',').map((s)=>({email:s.trim()})); 
    var attendeesJSON = JSON.stringify(attendees);
    var currentCell = sheet.getRange(startRow + i, numColumns);
    var meetLink = sheet.getRange(startRow + i, numColumns+1);
    var conferenceData = {
      createRequest: {
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        },
        requestId: 'abc123'
      }
    }
    var resource = {summary: name, description: descriptions,start: {dateTime: startDate.toISOString()}, end: {dateTime: endDate.toISOString()}, attendees: attendees,conferenceData: conferenceData};
    Logger.log(resource);
    var event = CalendarAdv.Events.insert(resource,calendarID,{ "conferenceDataVersion": 1 });
    currentCell.setValue(complete);
    var eventID = event.getId();
    var eventInfo = CalendarAdv.Events.get(calendarID,eventID);
    
    //, {}, {'If-None-Match': event.etag}).conferenceData.conferenceID
    var hangoutLink = eventInfo.hangoutLink;
    meetLink.setValue(hangoutLink);
  }
}
}

//Setup of Google Sheet for correct templating
function setUpSheet(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var values = [['Event','Description','Start Date (MM DD, YEAR HR:MM:SS)','End Date (MM DD, YEAR HR:MM:SS)','People (CSV)','Written','Meet Link']];
  var range = sheet.getRange(1, 1, 1, 7);
  range.setBackground('#F0F8FF');
  range.setFontWeight(900);
  range.setValues(values);
}
