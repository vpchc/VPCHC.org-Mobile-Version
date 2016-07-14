/*
//.......|.........|.........|.........|.........|.........|.........|.........| 
	Version 2
	Notes: This version of the bus tracker uses 2 arrays, 1 for the main 
	       schedule and 1 for the days that have two locations. This allows 
		   going to the current day without searching or loops. There were other 
		   optimizations such as combining the hours and mins when comparing
		   times to simplify the complex conditional statements.
	TODO:  Version numbers, call busTrackerMain in better way.
//.......|.........|.........|.........|.........|.........|.........|.........|  
*/
busTrackerMain();
function desktopViewSetup() {
  /*
	Arguments:   None
	Description: Sets the cookie for comparison and goes to main site.
	Returns:     Nothing
*/
  "use strict";
  document.cookie = "y; domain=vpchc.org";
  var x = document.cookie;
  window.location.href = 'http://vpchc.org/index.php';
}

function getCurrDay() {
/*
	Arguments:   None
	Description: Gets the current day of the year
	             (ex. Nov 11 is day 308 out of 365).
	Returns:     An index to the current day
*/
  "use strict";
  var today = new Date();
  var yearStart = new Date(today.getFullYear(), 0, 0);
  var diff = today - yearStart;
  var oneDay = 1000 * 60 * 60 * 24;
  var currDay = Math.floor(diff / oneDay);
  return (currDay - 1) * 5;
}

function busTrackerTimeCheck(busSchedule, index, twoLocationsFlag) {
/*
	Arguments:   busSchedule (An array of either location 1 or 2)
	             index (index of current day)
			     twolocationsFlag (0 - one location; 1 - two locations)
	Description: Looks at the start and end times of the bus and compares to
	             the current time.
	Returns:     0 - Closed, 1 - Open, 2 - Opening Soon, 3 - En route,
	             4 - Closing Soon	
*/
  "use strict";
//Add two to index to get to the location to the start time
  var times = index + 2;
  var splitStartTime = 0, busStartHour = 0, busStartMin = 0, busStartTime = 0,
      splitEndTime = 0, busEndHour = 0, busEndMin = 0, busEndTime = 0,
	  splitCurrentTime = 0, currentYear = 0, currentMonth = 0, currentDay = 0,
      currentHour = 0, currentMin = 0, currentTime = 0, compareStart = 0,
	  compareEnd = 0;
						
//Create a useable current time date method
  splitCurrentTime = new Date();
  currentYear = splitCurrentTime.getYear();
  currentMonth = splitCurrentTime.getMonth();
  currentDay = splitCurrentTime.getDay();
  currentHour = splitCurrentTime.getHours();
  currentMin = splitCurrentTime.getMinutes();
  currentTime = new Date(currentYear, currentMonth, currentDay, currentHour,
                         currentMin);
						 
//Split the start time and create a useable bus start time date method		 
  splitStartTime = busSchedule[times++].split(":");
  busStartHour = splitStartTime[0];
  busStartMin = splitStartTime[1];
  busStartTime = new Date(currentYear, currentMonth, currentDay, busStartHour,
                          busStartMin);
 
//Split the end time and create a useable bus end time date method	  
  splitEndTime = busSchedule[times].split(":");
  busEndHour = splitEndTime[0];
  busEndMin = splitEndTime[1];
  busEndTime = new Date(currentYear, currentMonth, currentDay, busEndHour,
  					    busEndMin);
						  
  compareStart = busStartTime - currentTime;
  compareEnd = busEndTime - currentTime;

//Where the comparing happens
  if(compareEnd <= 1.8e6 && compareEnd > 0){
	return 4;
  }else if(compareStart <= 1.8e6 && compareStart > 0){
  	if(twoLocationsFlag === 1){
	  return 3;
	}else{ 
      return 2;
	}
  }else if(compareStart <= 0 && compareEnd > 0){
    return 1;
  }else{
    return 0;
  }
}

function busTrackerMain(){
/*
	Arguments: None
	Description: Main function for the bus tracker.
	Returns: Nothing
*/
  "use strict";
  var today = 0;
  var ret = 0;
  var twoAreas = 0;
  var tempChange = [ ];
  var busSchedule = 0;
  var busSubSchedule = 0;
  
// Check the times for current day location 1
  busSchedule = busTrackerSchedules(0);
  today = getCurrDay();
  ret = busTrackerTimeCheck(busSchedule, today , 0);
  
// If there are two locations and location 1 is closed,
// check times for location 2
  if(ret === 0 && typeof(busSchedule[today + 4]) === "number") {
    busSubSchedule = busTrackerSchedules(1);
    ret = busTrackerTimeCheck(busSubSchedule, busSchedule[today + 4], 1);
    twoAreas = 1;
  }
  
// Display the location and times
  if(twoAreas === 0){
     document.getElementById("buslocation").innerHTML = 
       "<b>Location:</b> " + busSchedule[today++];
     document.getElementById("bustimes").innerHTML = 
       "<b>Times:</b> " + busSchedule[today];
  }else{
     document.getElementById("buslocation").innerHTML = 
	 		"<b>Location:</b> "	+ busSubSchedule[busSchedule[today + 4]++];
     document.getElementById("bustimes").innerHTML = 
	 		"<b>Times:</b> " + busSubSchedule[busSchedule[today + 4]];
  }
 
// Display the status
  if(ret === 1){
	 document.getElementById("busstatus").innerHTML = "<b>Status:</b> Open";
	 tempChange = document.getElementsByClassName("type1");
	 tempChange[0].style.backgroundColor = "green";
  }else if(ret === 2){
	 document.getElementById("busstatus").innerHTML = "<b>Status:</b> Opening Soon";
	 tempChange = document.getElementsByClassName("type1");
	 tempChange[0].style.backgroundColor = "yellow";
  }else if(ret === 3){
	 document.getElementById("busstatus").innerHTML = "<b>Status:</b> En Route";
	 tempChange = document.getElementsByClassName("type1");
	 tempChange[0].style.backgroundColor = "yellow";
  }else if(ret === 4){
	 document.getElementById("busstatus").innerHTML = "<b>Status:</b> Closing Soon";
	 tempChange = document.getElementsByClassName("type1");
	 tempChange[0].style.backgroundColor = "yellow";
  }else{
	 document.getElementById("busstatus").innerHTML = "<b>Status:</b> Closed";
	 tempChange = document.getElementsByClassName("type1");
	 tempChange[0].style.backgroundColor = "red";
  }
}

function busTrackerSchedules(choice){
/*
	Arguments:   Choice (0 - Main Schedule, 1 - Sub Schedule)
	Description: This is just a way to get the long array out of the
				 main function to clean things up.
	Returns:     Main Schedule or Sub Schedule
*/
	"use strict";
//subSchedule array is used for days where the bus visits two sites.
  var subSchedule = [
	  /*01/12*/"SVMS/SVHS","11:30a - 2:00p","11:30","14:00","0",
	  /*01/18*/"Van Duyn","10:30a - 2:00p","10:30","14:00","0",
	  /*01/21*/"Rosedale Elem","11:30a - 2:00p","11:30","14:00","0",
	  /*02/01*/"Van Duyn","10:30a - 2:00p","10:30","14:00","0",
	  /*02/02*/"SVMS/SVHS","10:30a - 2:45p","10:30","14:45","0",
	  /*02/04*/"Rosedale Elem","11:30a - 2:00p","11:30","14:00","0",
      /*02/18*/"Rosedale Elem","11:30a - 2:00 p","11:30","14:00","0",
      /*03/01*/"SVMS/SVHS","10:30a - 2:45p","10:30","14:45","0",
      /*03/03*/"Rosedale Elem","11:30a - 2:00p","11:30","14:00","0",
      /*03/14*/"Van Duyn","10:30a - 2:00p","10:30","14:00","0",
      /*03/17*/"Rosedale Elem","11:30a - 2:00p","11:30","14:00","0",
      /*04/05*/"SVMS/SVHS","10:30a - 2:45p","10:30","14:45","0",
      /*04/11*/"Van Duyn","10:30a - 2:00p","10:30","14:00","0",
      /*04/14*/"Rosedale Elem","11:30a - 2:00p","11:30","14:00","0",
      /*04/28*/"Rosedale Elem","11:30a - 2:00p","11:30","14:00","0",
      /*05/07*/"SVMS/SVHS","10:30a - 2:45p","10:30","14:45","0",
      /*05/09*/"Van Duyn","10:30a - 2:00p","10:30","14:00","0",
      /*05/12*/"Rosedale Elem","11:30a - 2:00p","11:30","14:00","0"
  ];
  
//mainSchedule format: starting from 0, every 5th index is a new date. 
//					1st index: location
//					2nd index: time in a easy to read format
//				    3rd index: bus start time
//					4th index: bus end time
//					5th index: two locations indicator/index
  var mainSchedule = [
      /*01/01*/"No Bus Today","----","0:0","0:0","0",
    /*01/02*/"Weekend","----","0:0","0:0","0",
    /*01/03*/"Weekend","----","0:0","0:0","0",
    /*01/04*/"No Bus Today","----","0:0","0:0","0",
    /*01/05*/"No Bus Today","----","0:0","0:0","0",
    /*01/06*/"No Bus Today","----","0:0","0:0","0",
    /*01/07*/"No Bus Today","----","0:0","0:0","0",
    /*01/08*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*01/09*/"Weekend","----","0:0","0:0","0",
    /*01/10*/"Weekend","----","0:0","0:0","0",
    /*01/11*/"Turkey Run Schools","8:30a - 2:45a","8:30","14:45","0",
    /*01/12*/"Central Elem","8:30a - 10:00a","8:30","10:00",0,
    /*01/13*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*01/14*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*01/15*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*01/16*/"Weekend","----","0:0","0:0","0",
    /*01/17*/"Weekend","----","0:0","0:0","0",
    /*01/18*/"Ernie Pyle","8:30a - 10:00a","8:30","10:00",5,
    /*01/19*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*01/20*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*01/21*/"Riverton Parke","8:30a - 11:00a","8:30","11:00",10,
    /*01/22*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*01/23*/"Weekend","----","0:0","0:0","0",
    /*01/24*/"Weekend","----","0:0","0:0","0",
    /*01/25*/"Turkey Run Schools","8:30a - 2:45p","8:30","14:45","0",
    /*01/26*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*01/27*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*01/28*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*01/29*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*01/30*/"Weekend","----","0:0","0:0","0",
    /*01/31*/"Weekend","----","0:0","0:0","0",
 	  /*02/01*/"Ernie Pyle","8:30a - 10:00a","8:30","10:00",15,
    /*02/02*/"Central Elem","8:30a - 10:00a","8:30","10:00",20,
    /*02/03*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*02/04*/"Riverton Parke","8:30a - 11:00a","8:30","11:00",25,
    /*02/05*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*02/06*/"Weekend","----","0:0","0:0","0",
    /*02/07*/"Weekend","----","0:0","0:0","0",
    /*02/08*/"Turkey Run Schools","8:30a - 2:45a","8:30","14:45","0",
    /*02/09*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*02/10*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*02/11*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*02/12*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*02/13*/"Weekend","----","0:0","0:0","0",
    /*02/14*/"Weekend","<3","0:0","0:0","0",
    /*02/15*/"Presidents Day","4:-)","0:0","0:0","0",
    /*02/16*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*02/17*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*02/18*/"Riverton Parke","8:30a - 11:00a","8:30","11:00",30,
    /*02/19*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*02/20*/"Weekend","----","0:0","0:0","0",
    /*02/21*/"Weekend","----","0:0","0:0","0",
    /*02/22*/"Turkey Run Schools","8:30a - 2:45a","8:30","14:45","0",
    /*02/23*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*02/24*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*02/25*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*02/26*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*02/27*/"Weekend","----","0:0","0:0","0",
    /*02/28*/"Weekend","----","0:0","0:0","0",
      /*03/01*/"Central Elem","8:30a - 10:00a","8:30","10:00",35,
    /*03/02*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*03/03*/"Riverton Parke","8:30a - 11:00a","8:30","11:00",40,
    /*03/04*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*03/05*/"Weekend","----","0:0","0:0","0",
    /*03/06*/"Weekend","----","0:0","0:0","0",
    /*03/07*/"Turkey Run Schools","8:30a - 2:45a","8:30","14:45","0",
    /*03/08*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*03/09*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*03/10*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*03/11*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*03/12*/"Weekend","----","0:0","0:0","0",
    /*03/13*/"Weekend","----","0:0","0:0","0",
    /*03/14*/"Ernie Pyle","8:30a - 10:00a","8:30","10:00",45,
    /*03/15*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*03/16*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*03/17*/"Riverton Parke","8:30a - 11:00a","8:30","11:00",50,
    /*03/18*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*03/19*/"Weekend","----","0:0","0:0","0",
    /*03/20*/"Weekend","----","0:0","0:0","0",
    /*03/21*/"Wal-Mart","8:30a - 3:00p","8:30","15:00","0",
    /*03/22*/"Wal-Mart","8:30a - 3:00p","8:30","15:00","0",
    /*03/23*/"Wal-Mart","8:30a - 3:00p","8:30","15:00","0",
    /*03/24*/"Wal-Mart","8:30a - 3:00p","8:30","15:00","0",
    /*03/25*/"No Bus Today","✝","0:0","0:0","0",
    /*03/26*/"Weekend","----","0:0","0:0","0",
    /*03/27*/"Weekend",":D","0:0","0:0","0",
    /*03/28*/"Spring Break","B-)","0:0","0:0","0",
    /*03/29*/"Spring Break","B-)","0:0","0:0","0",
    /*03/30*/"Spring Break","B-)","0:0","0:0","0",
    /*03/31*/"Spring Break","B-)","0:0","0:0","0",
      /*04/01*/"Spring Break","B-)","0:0","0:0","0",
    /*04/02*/"Weekend","----","0:0","0:0","0",
    /*04/03*/"Weekend","----","0:0","0:0","0",
    /*04/04*/"Turkey Run Schools","8:30a - 2:45a","8:30","14:45","0",
    /*04/05*/"Central Elem","8:30a - 10:00a","8:30","10:00",55,
    /*04/06*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*04/07*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*04/08*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/09*/"Weekend","----","0:0","0:0","0",
    /*04/10*/"Weekend","----","0:0","0:0","0",
    /*04/11*/"Ernie Pyle","8:30a - 10:00a","8:30","10:00",60,
    /*04/12*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/13*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*04/14*/"Riverton Parke","8:30a - 11:00a","8:30","11:00",65,
    /*04/15*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/16*/"Weekend","----","0:0","0:0","0",
    /*04/17*/"Weekend","----","0:0","0:0","0",
    /*04/18*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/19*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/20*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*04/21*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*04/22*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/23*/"Weekend","----","0:0","0:0","0",
    /*04/24*/"Weekend","----","0:0","0:0","0",
    /*04/25*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/26*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/27*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*04/28*/"Riverton Parke","8:30a - 11:00a","8:30","11:00",70,
    /*04/29*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*04/30*/"Weekend","----","0:0","0:0","0",
      /*05/01*/"Weekend","----","0:0","0:0","0",
    /*05/02*/"Turkey Run Schools","8:30a - 2:45a","8:30","14:45","0",
    /*05/03*/"Central Elem","8:30a - 10:00a","8:30","10:00",75,
    /*05/04*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*05/05*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*05/06*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*05/07*/"Weekend","----","0:0","0:0","0",
    /*05/08*/"Weekend","----","0:0","0:0","0",
    /*05/09*/"Ernie Pyle","8:30a - 10:00a","8:30","10:00",80,
    /*05/10*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*05/11*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*05/12*/"Riverton Parke","8:30a - 11:00a","8:30","11:00",85,
    /*05/13*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*05/14*/"Weekend","----","0:0","0:0","0",
    /*05/15*/"Weekend","----","0:0","0:0","0",
    /*05/16*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*05/17*/"SVMS/SVHS","8:30a - 2:45p","8:30","14:45","0",
    /*05/18*/"Rockville Schools","8:30a - 2:45p","8:30","14:45","0",
    /*05/19*/"Montezuma Elem","8:30a - 2:00p","8:30","14:00","0",
    /*05/20*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*05/21*/"Weekend","----","0:0","0:0","0",
    /*05/22*/"Weekend","----","0:0","0:0","0",
    /*05/23*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*05/24*/"NVMS/NVHS","8:30a - 2:45p","8:30","14:45","0",
    /*05/25*/"Summer Break","☼","0:0","0:0","0",
    /*05/26*/"Summer Break","☼","0:0","0:0","0",
    /*05/27*/"Summer Break","☼","0:0","0:0","0",
    /*05/28*/"Summer Break","☼","0:0","0:0","0",
    /*05/29*/"Summer Break","☼","0:0","0:0","0",
    /*05/30*/"Summer Break","☼","0:0","0:0","0",
    /*05/31*/"Summer Break","☼","0:0","0:0","0",
  	  /*06/01*/"Summer Break","☼","0:0","0:0","0",
    /*06/02*/"Summer Break","☼","0:0","0:0","0",
    /*06/03*/"Summer Break","☼","0:0","0:0","0",
    /*06/04*/"Summer Break","☼","0:0","0:0","0",
    /*06/05*/"Summer Break","☼","0:0","0:0","0",
    /*06/06*/"Summer Break","☼","0:0","0:0","0",
    /*06/07*/"Summer Break","☼","0:0","0:0","0",
    /*06/08*/"Summer Break","☼","0:0","0:0","0",
    /*06/09*/"Summer Break","☼","0:0","0:0","0",
    /*06/10*/"Summer Break",":-D","0:0","0:0","0",
    /*06/11*/"Summer Break",":-D","0:0","0:0","0",
    /*06/12*/"Summer Break",":-D","0:0","0:0","0",
    /*06/13*/"Summer Break",":-D","0:0","0:0","0",
    /*06/14*/"Summer Break",":-D","0:0","0:0","0",
    /*06/15*/"Summer Break",":-D","0:0","0:0","0",
    /*06/16*/"Summer Break",":-D","0:0","0:0","0",
    /*06/17*/"Summer Break",":-D","0:0","0:0","0",
    /*06/18*/"Summer Break",":-D","0:0","0:0","0",
    /*06/19*/"Summer Break",":-D","0:0","0:0","0",
    /*06/20*/"Summer Break",":-D","0:0","0:0","0",
    /*06/21*/"Summer Break",":-D","0:0","0:0","0",
    /*06/22*/"Summer Break",":-D","0:0","0:0","0",
    /*06/23*/"Summer Break",":-D","0:0","0:0","0",
    /*06/24*/"Summer Break",":-D","0:0","0:0","0",
    /*06/25*/"Summer Break",":-D","0:0","0:0","0",
    /*06/26*/"Summer Break",":-D","0:0","0:0","0",
    /*06/27*/"Summer Break",":-D","0:0","0:0","0",
    /*06/28*/"Summer Break",":-D","0:0","0:0","0",
    /*06/29*/"Summer Break",":-D","0:0","0:0","0",
    /*06/30*/"Summer Break",":-D","0:0","0:0","0",
	  /*07/01*/"Summer Break",":-D","0:0","0:0","0",
    /*07/02*/"Summer Break",":-D","0:0","0:0","0",
    /*07/03*/"Summer Break",":-D","0:0","0:0","0",
    /*07/04*/"Summer Break",":-D","0:0","0:0","0",
    /*07/05*/"Summer Break",":-D","0:0","0:0","0",
    /*07/06*/"Summer Break",":-D","0:0","0:0","0",
    /*07/07*/"Summer Break",":-D","0:0","0:0","0",
    /*07/08*/"Summer Break",":-D","0:0","0:0","0",
    /*07/09*/"Summer Break",":-D","0:0","0:0","0",
    /*07/10*/"Summer Break",":-D","0:0","0:0","0",
    /*07/11*/"Summer Break",":-D","0:0","0:0","0",
    /*07/12*/"Summer Break",":-D","0:0","0:0","0",
    /*07/13*/"Summer Break",":-D","0:0","0:0","0",
    /*07/14*/"Summer Break",":-D","0:0","0:0","0",
    /*07/15*/"Summer Break",":-D","0:0","0:0","0",
    /*07/16*/"Summer Break",":-D","0:0","0:0","0",
    /*07/17*/"Summer Break",":-D","0:0","0:0","0",
    /*07/18*/"Summer Break",":-D","0:0","0:0","0",
    /*07/19*/"Summer Break",":-D","0:0","0:0","0",
    /*07/20*/"Summer Break",":-D","0:0","0:0","0",
    /*07/21*/"Summer Break",":-D","0:0","0:0","0",
    /*07/22*/"Summer Break",":-D","0:0","0:0","0",
    /*07/23*/"Summer Break",":-D","0:0","0:0","0",
    /*07/24*/"Summer Break",":-D","0:0","0:0","0",
    /*07/25*/"Summer Break",":-D","0:0","0:0","0",
    /*07/26*/"Summer Break",":-D","0:0","0:0","0",
    /*07/27*/"Summer Break",":-D","0:0","0:0","0",
    /*07/28*/"Summer Break",":-D","0:0","0:0","0",
    /*07/29*/"Summer Break",":-D","0:0","0:0","0",
    /*07/30*/"Summer Break",":-D","0:0","0:0","0",
    /*07/31*/"Summer Break",":-D","0:0","0:0","0",
	  /*08/01*/" "," "," "," "," ",
    /*08/02*/" "," "," "," "," ",
    /*08/03*/" "," "," "," "," ",
    /*08/04*/" "," "," "," "," ",
    /*08/05*/" "," "," "," "," ",
    /*08/06*/" "," "," "," "," ",
    /*08/07*/" "," "," "," "," ",
    /*08/08*/" "," "," "," "," ",
    /*08/09*/" "," "," "," "," ",
    /*08/10*/" "," "," "," "," ",
    /*08/11*/" "," "," "," "," ",
    /*08/12*/" "," "," "," "," ",
    /*08/13*/" "," "," "," "," ",
    /*08/14*/" "," "," "," "," ",
    /*08/15*/" "," "," "," "," ",
    /*08/16*/" "," "," "," "," ",
    /*08/17*/" "," "," "," "," ",
    /*08/18*/" "," "," "," "," ",
    /*08/19*/" "," "," "," "," ",
    /*08/20*/" "," "," "," "," ",
    /*08/21*/" "," "," "," "," ",
    /*08/22*/" "," "," "," "," ",
    /*08/23*/" "," "," "," "," ",
    /*08/24*/" "," "," "," "," ",
    /*08/25*/" "," "," "," "," ",
    /*08/26*/" "," "," "," "," ",
    /*08/27*/" "," "," "," "," ",
    /*08/28*/" "," "," "," "," ",
    /*08/29*/" "," "," "," "," ",
    /*08/30*/" "," "," "," "," ",
    /*08/31*/" "," "," "," "," ",
	  /*09/01*/" "," "," "," "," ",
    /*09/02*/" "," "," "," "," ",
    /*09/03*/" "," "," "," "," ",
    /*09/04*/" "," "," "," "," ",
    /*09/05*/" "," "," "," "," ",
    /*09/06*/" "," "," "," "," ",
    /*09/07*/" "," "," "," "," ",
    /*09/08*/" "," "," "," "," ",
    /*09/09*/" "," "," "," "," ",
    /*09/10*/" "," "," "," "," ",
    /*09/11*/" "," "," "," "," ",
    /*09/12*/" "," "," "," "," ",
    /*09/13*/" "," "," "," "," ",
    /*09/14*/" "," "," "," "," ",
    /*09/15*/" "," "," "," "," ",
    /*09/16*/" "," "," "," "," ",
    /*09/17*/" "," "," "," "," ",
    /*09/18*/" "," "," "," "," ",
    /*09/19*/" "," "," "," "," ",
    /*09/20*/" "," "," "," "," ",
    /*09/21*/" "," "," "," "," ",
    /*09/22*/" "," "," "," "," ",
    /*09/23*/" "," "," "," "," ",
    /*09/24*/" "," "," "," "," ",
    /*09/25*/" "," "," "," "," ",
    /*09/26*/" "," "," "," "," ",
    /*09/27*/" "," "," "," "," ",
    /*09/28*/" "," "," "," "," ",
    /*09/29*/" "," "," "," "," ",
    /*09/30*/" "," "," "," "," ",
      /*10/01*/" "," "," "," "," ",
    /*10/02*/" "," "," "," "," ",
    /*10/03*/" "," "," "," "," ",
    /*10/04*/" "," "," "," "," ",
    /*10/05*/" "," "," "," "," ",
    /*10/06*/" "," "," "," "," ",
    /*10/07*/" "," "," "," "," ",
    /*10/08*/" "," "," "," "," ",
    /*10/09*/" "," "," "," "," ",
    /*10/10*/" "," "," "," "," ",
    /*10/11*/" "," "," "," "," ",
    /*10/12*/" "," "," "," "," ",
    /*10/13*/" "," "," "," "," ",
    /*10/14*/" "," "," "," "," ",
    /*10/15*/" "," "," "," "," ",
    /*10/16*/" "," "," "," "," ",
    /*10/17*/" "," "," "," "," ",
    /*10/18*/" "," "," "," "," ",
    /*10/19*/" "," "," "," "," ",
    /*10/20*/" "," "," "," "," ",
    /*10/21*/" "," "," "," "," ",
    /*10/22*/" "," "," "," "," ",
    /*10/23*/" "," "," "," "," ",
    /*10/24*/" "," "," "," "," ",
    /*10/25*/" "," "," "," "," ",
    /*10/26*/" "," "," "," "," ",
    /*10/27*/" "," "," "," "," ",
    /*10/28*/" "," "," "," "," ",
    /*10/29*/" "," "," "," "," ",
    /*10/30*/" "," "," "," "," ",
    /*10/31*/" "," "," "," "," ",
      /*11/01*/" "," "," "," "," ",
    /*11/02*/" "," "," "," "," ",
    /*11/03*/" "," "," "," "," ",
    /*11/04*/" "," "," "," "," ",
    /*11/05*/" "," "," "," "," ",
    /*11/06*/" "," "," "," "," ",
    /*11/07*/" "," "," "," "," ",
    /*11/08*/" "," "," "," "," ",
    /*11/09*/" "," "," "," "," ",
    /*11/10*/" "," "," "," "," ",
    /*11/11*/" "," "," "," "," ",
    /*11/12*/" "," "," "," "," ",
    /*11/13*/" "," "," "," "," ",
    /*11/14*/" "," "," "," "," ",
    /*11/15*/" "," "," "," "," ",
    /*11/16*/" "," "," "," "," ",
    /*11/17*/" "," "," "," "," ",
    /*11/18*/" "," "," "," "," ",
    /*11/19*/" "," "," "," "," ",
    /*11/20*/" "," "," "," "," ",
    /*11/21*/" "," "," "," "," ",
    /*11/22*/" "," "," "," "," ",
    /*11/23*/" "," "," "," "," ",
    /*11/24*/" ","<:>=="," "," "," ",
    /*11/25*/" "," "," "," "," ",
    /*11/26*/" "," "," "," "," ",
    /*11/27*/" "," "," "," "," ",
    /*11/28*/" "," "," "," "," ",
    /*11/29*/" "," "," "," "," ",
    /*11/30*/" "," "," "," "," ",
      /*12/01*/" "," "," "," "," ",
    /*12/02*/" "," "," "," "," ",
    /*12/03*/" "," "," "," "," ",
    /*12/04*/" "," "," "," "," ",
    /*12/05*/" "," "," "," "," ",
    /*12/06*/" "," "," "," "," ",
    /*12/07*/" "," "," "," "," ",
    /*12/08*/" "," "," "," "," ",
    /*12/09*/" "," "," "," "," ",
    /*12/10*/" "," "," "," "," ",
    /*12/11*/" "," "," "," "," ",
    /*12/12*/" "," "," "," "," ",
    /*12/13*/" "," "," "," "," ",
    /*12/14*/" "," "," "," "," ",
    /*12/15*/" "," "," "," "," ",
    /*12/16*/" "," "," "," "," ",
    /*12/17*/" "," "," "," "," ",
    /*12/18*/" "," "," "," "," ",
    /*12/19*/" "," "," "," "," ",
    /*12/20*/" "," "," "," "," ",
    /*12/21*/" "," "," "," "," ",
    /*12/22*/" "," "," "," "," ",
    /*12/23*/" "," "," "," "," ",
    /*12/24*/" "," "," "," "," ",
    /*12/25*/" "," "," "," "," ",
    /*12/26*/" "," "," "," "," ",
    /*12/27*/" "," "," "," "," ",
    /*12/28*/" "," "," "," "," ",
    /*12/29*/" "," "," "," "," ",
    /*12/30*/" "," "," "," "," ",
    /*12/31*/" "," "," "," "," "
  ];
	if(choice === 0){
		return mainSchedule;
	}else{
		return subSchedule;
	}
}