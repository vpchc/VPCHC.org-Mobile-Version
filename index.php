<!DOCTYPE html>
<html>
<!--.....|.........|.........|.........|.........|.........|.........|.........|.........|.........|.........|.......-->
<head>
  <title>Valley Professionals Community Health Center</title>
  <link rel="stylesheet" type="text/css" href="/css/msite.css">
</head>
<body>
  <div id="banner">
    <?php include("./includes/banner.php"); ?>	
    <div id="guide">
      <p id="guidetext">Welcome</p>
    </div>
  </div>
  <div id="content">
    <div id="hometabs">
      <img onclick="window.window.location.href = './php/locations/site_index.php'" 
        src="./images/locations_tab.png" alt="locations" width: "100" height: "100">
      <p></p>
      <img onclick="window.window.location.href = './php/bustracker/bustracker.php'" 
        src="./images/bustracker_tab.png" alt="bustracker" width: "100" height: "100">
      <p></p>
      <img onclick="window.window.location.href = 'http://facebook.com/vpchc'" 
        src="./images/facebook_tab.png" alt="facebookpage" width: "100" height: "100">
    </div>
  </div>
  <div id="footer">
    <?php include("./includes/footer.php"); ?>
  </div>
</body>
<script src="../../scripts/navigation.js"></script>
</html>