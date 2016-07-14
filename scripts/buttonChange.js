function btnUrlChg() {
	window.location.href = 'https://secure2.myunionportal.org/vpchc';
}
main();
function compareDate(curDate){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0
  var dateSplit;

  if(dd<10){
    dd='0'+dd;
  }
  if(mm<10){
    mm='0'+mm;
  } 
  dateSplit = curDate.split("/");
  if(dateSplit[0]=="0"){//This is the catch all in the function for times when bus is down or offline
	return(2);
  }else if(dateSplit[0]==mm){
    if(dateSplit[1]==dd){
      return(1);
	}else{return(0);}
  }else{
    return(0);
  }
  today = mm+'/'+dd;
}
function main(){
  var i=0,reader=0,currentDate=0,temp=0;busTime=0,busMinute=0,busHour=0,currentTime=0,timeCompareHour=0,timeCompareMinute=0;
  var text_array=[
  "10/08","Rosedale","11:30 a.m. - 2:00 p.m.","14:00","11:30","0",
  "10/09","North Vermillion","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "10/10","Weekend","------","0:0","0:0","0:0",
  "10/11","Weekend","------","0:0","0:0","0:0",
  "10/12","Walmart","8:00 a.m. - 3:00 p.m.","15:00","8:00","0",
  "10/13","No Bus Today","------","0:0","0:0","0:0",
  "10/14","No Bus Today","------","0:0","0:0","0:0",
  "10/15","Fall Break","------","0:0","0:0","0:0",
  "10/16","Fall Break","------","0:0","0:0","0:0",
  "10/17","Weekend","------","0:0","0:0","0:0",
  "10/18","Weekend","------","0:0","0:0","0:0",
  "10/19","Ernie Pyle","8:30 a.m. - 10:30 a.m.","10:30","8:30","1",
  "10/19","Van Duyn","11:00 a.m. - 2:00 p.m.","14:00","11:00","0",
  "10/20","SVMS/SVHS","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "10/21","Rockville","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "10/22","Montezuma","8:30 a.m. - 2:00 p.m.","14:00","8:30","0",
  "10/23","North Vermillion","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "10/24","Weekend","------","0:0","0:0","0:0",
  "10/25","Weekend","------","0:0","0:0","0:0",
  "10/26","Turkey Run","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "10/27","SVMS/SVHS","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "10/28","Rockville","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "10/29","Riverton Parke","8:30 a.m. - 11:00 a.m.","11:00","8:30","1",
  "10/29","Rosedale","11:30 a.m. - 2:00 p.m.","14:00","11:30","0",
  "10/30","North Vermillion","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "10/31","Weekend","------","0:0","0:0","0:0",
  "11/01","Weekend","------","0:0","0:0","0:0",
  "11/02","Ernie Pyle","8:30 a.m. - 10:30 a.m.","10:30","8:30","1",
  "11/02","Van Duyn","11:00 a.m. - 2:00 p.m.","14:00","11:00","0",
  "11/03","Central","8 a.m. - 10 a.m.","10:00","8:00","1",
  "11/03","SVMS/SVHS","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/04","Rockville","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/05","Montezuma","8:30 a.m. - 2:00 p.m.","14:00","8:30","0",
  "11/06","North Vermillion","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/07","Weekend","------","0:0","0:0","0:0",
  "11/08","Weekend","------","0:0","0:0","0:0",
  "11/09","Turkey Run","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/10","SVMS/SVHS","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/11","Rockville","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/12","Riverton Parke","8:30 a.m. - 11:00 a.m.","11:00","8:30","1",
  "11/12","Rosedale","11:30 a.m. - 2:00 p.m.","14:00","11:30","0",
  "11/13","North Vermillion","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/14","Weekend","------","0:0","0:0","0:0",
  "11/15","Weekend","------","0:0","0:0","0:0",
  "11/16","Ernie Pyle","8:30 a.m. - 10:30 a.m.","10:30","8:30","1",
  "11/16","Van Duyn","11:00 a.m. - 2:00 p.m.","14:00","11:00","0",
  "11/17","SVMS/SVHS","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/18","Rockville","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/19","Montezuma","8:30 a.m. - 2:00 p.m.","14:00","8:30","0",
  "11/20","North Vermillion","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "11/21","Weekend","------","0:0","0:0","0:0",
  "11/22","Weekend","------","0:0","0:0","0:0",
  "11/23","No Bus Today","------","0:0","0:0","0:0",
  "11/24","No Bus Today","------","0:0","0:0","0:0",
  "11/25","Thanksgiving Break","------","0","0","0",
  "11/26","Thanksgiving Break","------","0","0","0",
  "11/27","Thanksgiving Break","------","0","0","0",
  "11/28","Weekend","------","0:0","0:0","0:0",
  "11/29","Weekend","------","0:0","0:0","0:0",
  "11/30","Turkey Run","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/01","Central","8 a.m. - 10 a.m.","10:00","8:00","1",
  "12/01","SVMS/SVHS","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/02","Rockville","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/03","Riverton Parke","8:30 a.m. - 11:00 a.m.","11:00","8:30","1",
  "12/03","Rosedale","11:30 a.m. - 2:00 p.m.","14:00","11:30","0",
  "12/04","North Vermillion","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/05","Weekend","------","0:0","0:0","0:0",
  "12/06","Weekend","------","0:0","0:0","0:0",
  "12/07","Ernie Pyle","8:30 a.m. - 10:30 a.m.","10:30","8:30","1",
  "12/07","Van Duyn","11:00 a.m. - 2:00 p.m.","14:00","11:00","0",
  "12/08","SVMS/SVHS","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/09","Rockville","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/10","Montezuma","8:30 a.m. - 2:00 p.m.","14:00","8:30","0",
  "12/11","North Vermillion","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/12","Weekend","------","0:0","0:0","0:0",
  "12/13","Weekend","------","0:0","0:0","0:0",
  "12/14","No Bus Today","------","0:0","0:0","0:0",
  "12/15","SVMS/SVHS","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/16","Rockville","8:30 a.m. - 2:45 p.m.","14:45","8:30","0",
  "12/17","Riverton Parke","8:30 a.m. - 11:00 a.m.","11:00","8:30","1",
  "12/17","Rosedale","11:30 a.m. - 2:00 p.m.","14:00","11:30","0",
  "12/18","Christmas Break","------","0:0","0:0","0:0",
  "12/19","Weekend","------","0:0","0:0","0:0",
  "12/20","Weekend","------","0:0","0:0","0:0",
  "12/21","Christmas Break","------","0:0","0:0","0:0",
  "12/22","Christmas Break","------","0:0","0:0","0:0",
  "12/23","Christmas Break","------","0:0","0:0","0:0",
  "12/24","Christmas Break","------","0:0","0:0","0:0",
  "12/25","Christmas Break","------","0:0","0:0","0:0",
  "12/26","Weekend","------","0:0","0:0","0:0",
  "12/27","Weekend","------","0:0","0:0","0:0",
  "12/28","Christmas Break","------","0:0","0:0","0:0",
  "12/29","Christmas Break","------","0:0","0:0","0:0",
  "12/30","Christmas Break","------","0:0","0:0","0:0",
  "12/31","Christmas Break","------","0:0","0:0","0:0"
  ]
  while(i<text_array.length){
    if(reader==0){
      if(compareDate(text_array[i])==0){//this checks to see if it is on the current date, if not then skip to the next section
    	i+=6;
      }else{//On the current date to step forward to next index
	    i++;
	    reader++;
     }
    }else if(reader==1){//Location Section
      document.getElementById("locationtext").innerHTML=text_array[i];
      reader++;
      i++;
    }else if(reader==2){//Times Section
      document.getElementById("timestext").innerHTML=text_array[i];
      reader++;
      i++;
    }else if(reader==3){//End Time Section
	  temp=text_array[i].split(":");
	  busEndHour=parseInt(temp[0]);
	  busEndMinute=parseInt(temp[1]);
	  temp=text_array[i+1].split(":");
	  busStartHour=parseInt(temp[0]);
	  busStartMinute=parseInt(temp[1]);
      temp=new Date();
	  currentHour=temp.getHours();
	  currentMinute=temp.getMinutes();
	  if(currentHour<busStartHour || (currentHour==busStartHour && currentMinute<busStartMinute) || 
	  ((currentHour>busEndHour || (currentHour==busEndHour && currentMinute>busEndMinute)) && text_array[i+2]=="0" || busStartHour==0)){
		if((currentHour<busStartHour || (currentHour==busStartHour && currentMinute<busStartMinute)) && text_array[i-4]=="1" && i>=10){
			document.getElementById("statustext").innerHTML="En Route";
			var tempChange=document.getElementsByClassName("type1");
	        tempChange[0].style.backgroundColor="yellow";
		}else{
			document.getElementById("statustext").innerHTML="Closed";
			var tempChange=document.getElementsByClassName("type1");
	        tempChange[0].style.backgroundColor="red";
		}
		break;
	  }
	  if((busEndHour-currentHour)==0){
	    timeCompareMinute=busEndMinute-currentMinute;
	  }if((busEndHour-currentHour)>0){
	    timeCompareMinute=35;//this is just an easy way to set the status green when diff. of current and bus hour is >=1
	  }
      if(currentHour==busStartHour || timeCompareMinute > 30){
	   document.getElementById("statustext").innerHTML="Open";
	   var tempChange=document.getElementsByClassName("type1");
	   tempChange[0].style.backgroundColor="green";
      }else if(timeCompareMinute <= 30 && timeCompareMinute >=1){
	    document.getElementById("statustext").innerHTML="Closing Soon";
	    var tempChange=document.getElementsByClassName("type1");
	    tempChange[0].style.backgroundColor="yellow";
      }else{
	    if(text_array[i+2]=="1"){//This is when there are multiple locations for that day
	      i+=3;
	      reader=0;
          continue;
        }else{
	      document.getElementById("statustext").innerHTML="Closed";
	      var tempChange=document.getElementsByClassName("type1");
	      tempChange[0].style.backgroundColor="red";
        }
      }
      break;
    }
  }
}
