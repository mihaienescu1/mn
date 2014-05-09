<section class="needs-list">
<?php
foreach($needs as $need) {

	$checkLiked			=	'';
	$checkShared		=	'';
	$checkProvided		=	'';
	$checkDelivered		=	'';
?>
<!--
	if( in_array('liked', $need['status_actions']) ) 	$checkLiked		=	'on';
	if( in_array('shared', $need['status_actions']) ) 	$checkShared	=	'on';
	
	if( in_array('provide_pending', $need['status_actions']) ) 	$checkProvided	=	'pending';
	if( in_array('deliver_pending', $need['status_actions']) ) 	$checkDelivered	=	'pending';
	
	if( in_array('provided', $need['status_actions']) ) 	$checkProvided	=	'on';
	if( in_array('delivered', $need['status_actions']) ) 	$checkDelivered	=	'on';
	
	if($need['lsa']){
		if( $need['lsa'] === "liked" ) 
				$checkLiked	.=	" lastaction";
		if( $need['lsa'] === "shared" ) 
				$checkShared	.=	" lastaction";
		if( $need['lsa'] === "provided" || $need['lsa'] === "provide_pending") 
				$checkProvided	.=	" lastaction";
		if( $need['lsa'] === "delivered" || $need['lsa'] === "deliver_pending") 
				$checkDelivered.=	" lastaction";
	}
-->
	<article class="need">
	<div class="thumbnail"><span class="photo type-2"><img src="<?php echo base_url().'photos/needs/'.$need['photo']; ?>" width="121" /></span>
	<div class="need_status_graph" id="<?php echo $need['id']; ?>">
		<div class="check liked <?php echo $checkLiked; ?>"></div>
		<div class="check shared <?php echo $checkShared; ?>"></div>
		<div class="check provided <?php echo $checkProvided; ?>"></div>
		<div class="check delivered <?php echo $checkDelivered; ?>"></div>
	</div>
	</div>
	<div class="details">
	<h2><a href="javascript:void(0);"><?php echo $need['need_title']; ?></a></h2>
	<div class="location"><span class="icon"></span><?php echo $need['location']; ?></div>
	</div>
	<a href="javascript:void(0);" class="view-details-arrow" id="<?php echo $need['id']; ?>">View Need Details</a>
	<div class="fb_btn_extended">
		<fb:like href="<?php echo base_url(); ?>#aneed_admin?n=<?php echo $need['id']; ?>" send="false" layout="standard" width="450" show_faces="false" font="verdana"></fb:like>
	</div>
	<div class="needs-actions">
	<div class="needs-status-actions" style="display: none;">
	<ul>
	<li class="action-label">Get Involved:</li>
	<li class="action-share"><a href="#" title="Share">Share</a></li>
	<li class="action-provide"><a href="#" title="Provide">Provide</a></li>
	<li class="action-deliver"><a href="#" title="Deliver">Deliver</a></li>
	</ul>
	</div>
	<div class="needs-status">
	<div class="recent-activity">
		<!--
		<span class="activity-timestamp"><?php echo $need['created']; ?></span>
		<span class="activity-message">
		<a href="#" class="user"><?php echo $need['user_info']['username']; ?></a> has offered to Provide <a href="#"><?php echo $need['title']; ?></a>
		</span>
		-->
	</div>
	</div>
	</div>
	</article>
<?php } ?>
</section>
