<!DOCTYPE html>
<html xmlns:fb="http://ogp.me/ns/fb#">
<head>
	<!-- meta facebook info -->
	<meta property="og:title" content="Microneeds" />
	<meta property="og:type" content="company" />
	<meta property="og:url" content="<?php echo base_url(); ?>" />
	<meta property="og:image"content="<?php echo base_url(); ?>img/home/MN_200.png" />
	<meta property="og:site_name" content="Microneeds" />
	<meta property="og:description" content="MicroNeeds is an online social-engine for people to identify and fulfill 'micro' global needs" />
	<meta property="fb:admins" content="100000825160835" />
	
	<title>microneeds.com</title>
    <style type="text/css">
		html { height: 100% }
		body { height: 100%; margin: 0; padding: 0 }
		#map_canvas { height: 100% }
    </style>
	
    <link rel="apple-touch-icon" href="<?php echo base_url(); ?>img/home/MN_200.png">
    <link rel="apple-touch-icon-precomposed" href="<?php echo base_url(); ?>img/home/MN_200.png"><!--prevents rendering--> 
	
	<link rel="stylesheet" href="inc/css/main.css">
	<link rel="stylesheet" href="inc/js/uploadify/uploadify.css">
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/jquery-migrate-1.1.0.min.js"></script>
	<!-- <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script> -->
    <script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script>	
	<script type="text/javascript">
		var url = "<?php echo base_url(); ?>";
		var user_location	=	{
				'latitude' 	:	 <?php echo $location['latitude']; ?>,
				'longitude'	:	 <?php echo $location['longitude']; ?>,
				'geoip'		:	"<?php echo $location['geoip']; ?>"
		};
    </script>
	<script type="text/javascript" src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0"></script>
	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=<?php echo $gmaps_api_key; ?>&sensor=true&libraries=places"></script>
</head>
<body>
<div id="fb-root"></div>
<script type="text/javascript">
  window.fbAsyncInit = function() {
    FB.init({
	      appId      : '<?php echo $facebook_information['api_key']?>',
	      status     : true,
	      cookie     : true,
	      xfbml      : true 
    });
    $('#fb_connect_or_join').bind('click', function(e) { Micro.HandleFacebook(); });
  };

  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js#appId=<?php echo $facebook_information['api_key']?>&xfbml=1";
     ref.parentNode.insertBefore(js, ref);
   }(document));
</script>
<div id="page" class="main_wrapper">
  <header id="header-main"> 
  <a href="javascript:Micro.LoadPage('#home');" title="Home" class="logo">MicroNeeds</a>
    <button id="search-activate">Open Search</button>
    <div id="nav-addneed"></div>
	<nav id="nav-main">
	      <ul>
	        <li class="nav-connect" id="fb_connect"><a href="javascript:void(0);">Join! Connect with Facebook</a></li>
	      </ul>
    </nav>
    <nav id="nav-logged">
    	<ul>
	    	<li class="points">
	    		<div class="icon">4225</div>
	    	</li>
	        <li class="check">
	        	<div class="icon auth" id="myActivityView"></div>
	        </li>
	        <li class="user_menu">
	        	<div class="icon ib"></div>
	        </li>
    	</ul>
    </nav>
    <!--<div class="user_notifications user">5</div>-->
    <div class="user_notifications check"><span>2</span></div>
    <div class="user_notifications user"><span>5</span></div>
    <div class="bubble" id="my_menu">
    	<div class="top"></div>
    	<div class="content">
    		<div class="top_content">
    			<div class="user_icon" id="my_photo_menu"></div>
    			<div class="user_name" id="my_name"></div>
    			<div class="user_title" id="my_profile"><a href="javascript:Micro.LoadPage('#profile');" id="profile_go">My Profile</a></div>
    		</div>
    		<div class="middle_content">
    			<ul class="menu">
    				<li><a href="javascript:Micro.LoadPage('#mymessages');" id="my_messages">My Messages <span class="noted" id="my_messages_number"></span></a></li>
    				<li><a href="javascript:Micro.LoadPage('#settings');" id="my_settings">My Settings</a></li>
    			</ul>
    		</div>
    		<div class="bottom_content">
    			<ul class="menu">
    				<li><a href="javascript:void(0);" class="logout" id="my_logout">Log Out</a></li>
    			</ul>
    		</div>
    	</div>
    </div>

  </header>
  <!-- end #header-main -->
  
  <!-- scheduled for delete -->
    <section id="section-login-panel" style="display: none;">
    <div class="faq">
      <h2>What is a Microneed...</h2>
      <p>A MicroNeed is a lorem ipsum sensium sedom divit
        dolet overitle gomenish fidder domino nonummy
        elur. Gamet ore everit anen sensium.</p>
      <a href="#" class="next">Next FAQ <span></span></a></div>
    <div class="connect">
      <h2>Make an Impact! Join the MicroNeeds Community.</h2>
      <p>It's quick &amp; easy when you connect using Facebook:</p>
      <div class="facebook" id="my_login">Login with Facebook</div>
    </div>
    <div class="stats">
      <dl>
        <dt>86</dt>
        <dd>Open Needs</dd>
        <dt>36</dt>
        <dd>Fulfilled to Date</dd>
        <dt>213</dt>
        <dd>Members</dd>
      </dl>
    </div>
  </section><!-- scheduled for delete ending -->
  <!-- end #section-login-panel -->
  
  <section id="section-search" class="hmapview">
      <ul>
        <li>
          <label for="search-address">Search Needs</label>
          <input type="text" id="search-address">
        </li>
        <li>
          <label for="search-filter">Filter By Category</label>
          <div class="styled-select">
			<div class="left"></div>
			<div class="center">
				<select id="need_filters_box">
					<option value="">Display Needs By...</option>
				</select>
			 </div>
			<div class="right"></div>
		 </div>
        </li>
        <li>
          <button type="button" id="search-close">Close View</button>
        </li>
      </ul>
  </section>
  <!-- end #section-search -->
  
  <section id="section-map-panel" class="hmapview">
	<div class="map_overlay" id="moverlay">
		<div class="inner" id="moverlay_content"></div>
	</div>
	<div id="gmap_global"></div>
  </section>
  <!-- end #section-map-panel -->

  <div id="content" class="content_normal">
    <div class="container">
    
<!-- login panel original place -->
           
      <div id="handle" class="section-breadcrumbs">
		<div class="left-side">
			<div class="title"></div>
		</div>
		<!--
		<div class="center-side">
			
		</div>
		-->
		<div class="right-side"></div>
	  </div>

      <!-- notebook header container -->
       
        <section id="section-content-top" class="notebook" style="display: none;">
        <div class="thumbnail">
        	<span class="photo type-2">
        		<img src="img/spc_red.gif" alt="" title="" width="240" height="240"> 
        	</span> 
        	<div class="status provide_pending">
          <ul>
            <li class="check-new">New</li>
            <li class="check-share">Share</li>
            <li class="check-provide">Provide</li>
            <li class="check-deliver">Deliver</li>
          </ul>
          </div> </div>
        <div class="details">
          <h2><a href="#">3 Boxes of Various Educational Supplies</a></h2>
          <div class="location"><span class="icon"></span>New Delhi, India</div>
          <nav id="nav-need">
            <h4>Need Activity</h4>
            <ul>
              <li class="nav-details on"><a href="#">Details</a></li>
              <li class="nav-thread"><a href="#">Thread</a></li>
              <li class="nav-provision"><a href="#">Provision</a></li>
              <li class="nav-delivery"><a href="#">Delivery</a></li>
              <li class="nav-team"><a href="#">Team</a></li>
            </ul>
          </nav>
        </div>
      </section>
      <!-- end .notebook -->     
      
      <aside id="section-content-sidebar" class="sidebar">
      </aside>
      <!-- end .sidebar -->
      
      <section id="section-content-main">
        <!-- end .needs-list --> 
      </section>
      <!-- end #section-content-main -->
      
      <div class="infinite-pager">
        <!--<button type="button" class="default infinite-pager">more</button>-->
      </div>

      <!-- end .infinite-pager --> 
      
    </div>
    <!-- end .container --> 
  </div>
  <!-- end .content -->
  
  <footer>
    <div id="section-footer" class="container">
      <nav id="nav-footer-links">
        <ul>
          <li class="what"><a href="#" title="" class="active">What Is A Microneed?</a></li>
          <li class="contact"><a href="#" title="" class="active">Contact Us</a></li>
          <li class="faqs"><a href="#" title="" class="active">Frequently Asked Questions</a></li>
        </ul>
      </nav>
      <!-- end #nav-footer-links --> 
      
      <span class="copyright">&copy;2012 Microneeds, llc. All Rights Reserved.</span>
      <nav id="nav-legal"><a href="#">Terms</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;<a href="#">Privacy</a></nav>
      <a class="footer-logo" href="#">Microneeds</a></div>
  </footer>
</div>

<!-- Overlay Container -->
<section id="section-overlay" class="overlay like">
	<div class="container">
		<header>
			<h2 id="overlay-title">1 Case of Sterile Surgical Gloves</h2>
			<h3 id="overlay-location">Jaco, Costa Rica</h3>
			<button title="Close" class="hideOverlay">Close</button>
		</header>
		<article id="overlay-content">
			<div class="intro">
				<span class="icon"></span>
				<h2>You and <em>13 others</em> like this.</h2>
				<p>Thanks for your support. You're off to a great start, but why not join the
MicroNeeds community now to become an even bigger contributor?</p>
			</div>
			
			<h2>Use your preferred social profile to join the MicroNeeds community!</h2>
			<button class="facebook">Connect with Facebook</button>
			<!--<button class="twitter">Connect with Twitter</button>-->
		</article>
	</div>
</section>
<!-- end Overlay Container -->

<!-- FB Overlay Container -->
<section id="section-login-overlay" class="overlay like">
	<div class="container">
		<header>
			<h2 id="overlay-title"></h2>
			<h3 id="overlay-location"></h3>
			<button title="Close" class="hideFacebookOverlay"></button>
		</header>
		<iframe id="facebook-overlay-content">
		</iframe>
	</div>
</section>
<input type="hidden" id="user_id" value="" />
<!-- end Overlay Container -->
<!-- end #page --> 
<script type="text/javascript" src="<?php echo base_url('inc/js/uploadify/jquery.uploadify-3.1.min.js'); ?>"></script>   
<script type="text/javascript" src="<?php echo base_url('inc/js/microneeds_ajax.js'); ?>"></script>
<script type="text/javascript" src="<?php echo base_url('inc/js/microneeds.js'); ?>"></script>
<script type="text/javascript">
	Micro.Init();
</script>
<input type="hidden" name="my_user_id" id="my_user_id" />
<div id="page_overlay_all"><div class="overlay_loading_indicator"></div></div>
</body>
</html>