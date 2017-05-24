//global variables
//modify envGooCal to your calendar and api key
var envGooCal = 'https://www.googleapis.com/calendar/v3/calendars/*calendar ID*/events?key=*API Key*'



var today = new Date();
var pageURL = $(location).attr("href");
var newDate;
var newTime;
var eventTime;
var calList = [];

//Change date/times to string of numbers
//if option == 1: return date, if option == 2: return time
var normalizeDate = function(dateTime, option){
  if (option === 1){ //for transforming dates
  if(typeof(dateTime) == 'object' ) {
    newTime = JSON.stringify(dateTime);
    newTime = newTime.replace(/\D/g, '').substr(0,8);
  } else if (typeof(dateTime) == 'string' ){
    newTime = dateTime.replace(/\D/g, '').substr(0,8);
  }
  return newTime;
} if (option === 2){ //for transforming times
  if(typeof(dateTime) == 'object' ) {
    newTime = JSON.stringify(dateTime);
    newTime = newTime.replace(/\D/g, '').substr(8,4);
    console.log(newTime);
  } else if (typeof(dateTime) == 'string' ){
    newTime = dateTime.replace(/\D/g, '').substr(8,4);
  }
  return newTime;
}
};

var getCalendar = function(){
  today = normalizeDate(today, 1);

    $.ajax({
      url: envGooCal,
      data:{
        format: 'json'
      },
      success: function(result){

        result.items.forEach(function(data){
        var day;
        var month;
        var title;
        var excerpt;
        var location;
        if (data.start.dateTime){
          eventTime = data.start.dateTime;
          newDate = normalizeDate(eventTime, 1);
        } else if (data.start.date){
          eventTime = data.start.date;
          newDate = normalizeDate(eventTime, 1);
        }
        //check if date is later than today and add content to array
        if (newDate >= today ){
          data.index=newDate;
          calList.push(data);
        }
      });

      calList.sort(function(a,b){
        return parseFloat(a.index) - parseFloat(b.index);
      });
      var count = 0;
      for(var data of calList){
        //variables of parsed data
        year = data.index.substr(0,4);
        month = data.index.substr(4,2);
        day = data.index.substr(6,2);
        title = data.summary;
        excerpt = data.description;
        locations = data.location;

          //the following needs to be changed based on your design needs
          if( pageURL.indexOf('/locations') != -1){
            $(".future-events").append('<li class="col-md-6 clearfix"><div class="date"><a href=""><span class="binds"></span><span class="month">'+ month +'</span><span class="day">' + day + '</span></a></div><h2><a class="post-link" href="">' + title + '</a></h2><p>'+locations+'</p><p> ' + excerpt+ '</p></li>');
          } else {
          //format for homepage
            if (count <= 1) {
              var startTime = normalizeDate(data.start.dateTime, 2);
              var endTime = normalizeDate(data.end.dateTime, 2);
              $(".future-events").append('<li class="col-md-4 clearfix"><div class="date"><a href=""><span class="binds"></span><span class="month">' + month + '</span><span class="day">' + day + '</span></a></div><h3><a href="http://maps.google.com/?q='+ locations +'">' + title + '</a></h3></li>');
              count++;
            }
            else{
              break;
            }
          }
        }
    // Gets geocode of first and most recent location on the list of locations;

  }});
};


getCalendar();
