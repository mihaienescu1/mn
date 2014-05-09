<section class="needs-list">
	<?php
	foreach($needs as $need ) :

	$checkLiked			=	'';
	$checkShared		=	'';
	$checkProvided		=	'';
	$checkDelivered		=	'';
	

		if( in_array('liked', $need['status_actions']) ) 	$checkLiked		=	'on';

		if( in_array('provide_pending', $need['status_actions']) ) 	$checkProvided	=	'pending';

		if( in_array('provided', $need['status_actions']) ) 	$checkProvided	=	'on';

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
	?>
		<article class="need">
		<div class="thumbnail"><span class="photo type-2">
			<a href="javascript:Micro.LoadPage('#aneed_admin?n=<?php echo $need['id']; ?>');">
				<img src="<?php echo base_url(); ?>photos/needs/<?php echo $need['photo']; ?>" width="121" />
			</a>
		</span>
		<div class="need_status_graph" id="<?php echo $need['id']; ?>">
			<div class="check liked <?php echo $checkLiked; ?>"></div>
			<div class="check shared <?php echo $checkShared; ?>"></div>
			<div class="check provided <?php echo $checkProvided; ?>"></div>
			<div class="check delivered <?php echo $checkDelivered; ?>"></div>
		</div>
		</div>
		<div class="details">
			<h2><a href="javascript:Micro.LoadPage('#aneed_admin?n=<?php echo $need['id']; ?>');"><?php echo $need['need_title']; ?></a></h2>
			<div class="location"><span class="icon"></span><?php echo $need['location']; ?></div>
		</div>
		<a href="javascript:Micro.LoadPage('#aneed_admin?n=<?php echo $need['id']; ?>');" class="view-details-arrow" id="<?php echo $need['id']; ?>">View Need Details</a>

		<div class="fb_btn_extended">
			<fb:like href="http://qa.microneeds.com/#aneed_admin?n=<?php echo $need['id']; ?>" send="false" layout="button_count" width="450" show_faces="false"></fb:like>
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
					<div class="recent-activity-message"><?php echo $need['last_status_message']; ?></div>
					<div class="recent-activity-timestamp"><?php echo $need['last_activity_time_ago']; ?> ago</div>
				</div>
			</div>
		</div>
		</article>
	<?php endforeach; ?>
</section>