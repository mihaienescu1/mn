<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<meta name="description" content="">
<meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="<?php echo base_url(); ?>inc/css/main.css">
<script type="text/javascript"> var url = "<?php echo base_url(); ?>"; </script>
<base href="<?php echo base_url(); ?>">
</head>
<body>
<a href="javascript:void(0);" onclick="Micro.setNotebookView(true)">Set Notebook</a> | 
<a href="javascript:void(0);" onclick="Micro.setNotebookView(false)">Un-Set Notebook</a><br/>

<div id="fb-root"></div>
<script>
</script>
<div id="page">
  <header id="header-main"> <a href="#" title="Home" class="logo">MicroNeeds</a>
    <button id="search-activate">Open Search</button>
    <nav id="nav-main">
      <ul>
        <li class="nav-connect"><a href="javascript:">Join! Connect with Facebook or Twitter</a></li>
        <li class="nav-login"><a href="javascript:">Login</a></li>
      </ul>
    </nav>
  </header>
  <!-- end #header-main -->
   
  <section id="section-search" style="display: none;">
    <form>
      <ul>
        <li>
          <label for="search-keywords">Search Needs</label>
          <input type="text" id="search-keywords">
        </li>
        <li>
          <label for="search-map">Map Needs</label>
          <button type="button" id="search-map">Map Needs</button>
        </li>
        <li>
          <label for="search-filter">Filter Needs</label>
          <select id="search-filter">
            <option value="">Display Needs By...</option>
          </select>
        </li>
        <li>
          <button type="button" id="search-close">Close View</button>
        </li>
      </ul>
    </form>
  </section>
  <!-- end #section-search -->
  
  <div id="content" class="content_normal">
    <div class="container">
    
      <section id="section-login-panel" style="display: none;">
        <div class="faq">
          <h2>What is a Microneed...</h2>
          <p>A MicroNeed is a lorem ipsum sensium sedom divit
            dolet overitle gomenish fidder domino nonummy
            elur. Gamet ore everit anen sensium.</p>
          <a href="#" class="next">Next FAQ <span></span></a></div>
        <div class="connect">
          <h2>Make an Impact! Join the MicroNeeds Community.</h2>
          <p>It's quick &amp; easy when you connect using your preferred network:</p>
          <button class="facebook">Facebook</button>
          <button class="twitter">Twitter</button>
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
      </section>
      <!-- end #section-login-panel -->
            
      <div id="handle">22 Worldwide Needs <span class="drag"></span></div>

      <!-- notebook header container -->
       
        <section id="section-content-top" class="notebook" style="display: none;">
        <div class="thumbnail"> <span class="photo type-2"> <img src="img/spc_red.gif" alt="" title="" width="240" height="240"> </span> <div class="status provide_pending">
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
        <section class="needs-list">
        
          
          
        
        </section>
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
    <div class="container">
      <nav id="nav-footer-links">
        <ul>
          <li class="what"><a href="#" title="" class="active">What Is A Microneed?</a></li>
          <li class="contact"><a href="#" title="" class="active">Contact Us</a></li>
          <li class="faqs"><a href="#" title="" class="active">Frequently Asked Questions</a></li>
        </ul>
      </nav>
      <!-- end #nav-footer-links --> 
      
      <span class="copyright">&copy;2012 Microneeds, llc. dfasdfafdsafdfAll Rights Reserved.</span>
      <nav id="nav-legal"><a href="#">Terms</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;<a href="#">Privacy</a></nav>
      <a class="footer-logo" href="#">Microneeds</a></div>
  </footer>
</div>
<!-- end #page --> 

		<script type="text/javascript" src="<?php echo base_url('inc/js/backbone-min.js'); ?>"></script>
		<script type="text/javascript" src="<?php echo base_url('inc/js/jquery-min.js'); ?>"></script>
		<script type="text/javascript" src="<?php echo base_url('inc/js/script.js'); ?>"></script>
		<script type="text/javascript" src="<?php echo base_url('inc/js/microneeds_ajax.js'); ?>"></script>
		<script type="text/javascript" src="<?php echo base_url('inc/js/microneeds.js'); ?>"></script>
		<script type="text/javascript">
			$(document).ready(function(){
				try{
					Micro.Init();
				} catch(ex) {
					console.log(ex);
				}
			});
		</script>
		<?php
		foreach (directory_map('./inc/js/micro_pages/', false, true) as $script)
			echo '<script type="text/javascript" src="' . base_url() . 'inc/js/micro_pages/' . $script .'"></script>' . "\n\t";
		?>
</body>
</html>