<!DOCTYPE html>
<html>
<!--.....|.........|.........|.........|.........|.........|.........|.........|.........|.........|.........|.......-->
<head>
  <title>Valley Professionals Community Health Center</title>
  <link rel="stylesheet" type="text/css" href="../../css/msite.css">
</head>
<body>
  <div id="banner">
    <?php include("../../includes/banner.php"); ?>	
    <div id="guide">
      <p id="guidetext">Mobile Bus Location</p>
    </div>
  </div>
  <div id="content">
      <div id="textbox">
        <div id="bustext">
          <div id="bustitle"><p id="btitle"><b>Where is the Bus?</b/p></div>
          <p id="buslocation"><b>Location:</b></p>
          <p id="bustimes"><b>Times:</b></p>
          <p id="busstatus"><b>Status:</b> Loading...</p>
        </div>
      </div>
      <div id="busschedule">
        <p></p>
        <img onclick="window.location.href='http://vpchc.org/msite/files/MSBHC_2015_Aug_Dec.pdf'"
          src="../../images/busschedule_tab.png" alt="desktopview" width: "100" height: "100">
      </div>
  </div>
  <div id="footer">
    <?php include("../../includes/footer.php"); ?>	
  </div>
</body>
<script src="../../scripts/navigation.js"></script>
<script>
  var today = new Date();
  document.getElementById('btitle').innerHTML = '<b>Where is the Bus?<br\> ' + (today.getMonth() + 1) + '/' + today.getDate() + '/' + 
  today.getFullYear() + '</b>';
</script>
</html>