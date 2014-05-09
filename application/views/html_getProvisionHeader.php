<?php if($is_involved) : ?>

	<?php if(in_array('provided', $status_actions)) : ?>
		<aside class="header">
			<h2>Want to deliver this need?</h2>
			<button class="default deliverer_nomination" id="<?php echo $need_id; ?>">
				<a href="javascript:void(0);" class="provide_need_current_user">I&#8217;ll Deliver This!</a>
			</button>
			<div class="needs-status-message">No thanks, but I&#8217;d like to <a href="javascript:void(0);" class="more_needs">see more Needs</a> like this.</div>
			<div class="fb_btn pv">
				<fb:like href="<?php echo base_url(); ?>#aneed_admin?n=<?php echo $need_id; ?>"" send="false" layout="button_count" width="50" show_faces="false" font="arial"></fb:like>
			</div>
		</aside>
	<?php elseif(in_array('delivered', $status_actions)) : ?>
		<aside class="header">
			<h2>Interested in this need? It\'s pretty much covered but we\'ve got more..</h2>
			<button class="default show_sim_needs" id="<?php echo $need_id; ?>">
				<a href="javascript:void(0);" class="provide_need_current_user">Show Similar Needs!</a>
			</button>
			<div class="needs-status-message">Show me <a href="javascript:void(0);" class="more_needs">other Needs</a> from this originator.</div>
			<div class="fb_btn pv">
				<fb:like href="<?php echo base_url(); ?>#aneed_admin?n=<?php echo $need_id; ?>"" send="false" layout="button_count" width="50" show_faces="false" font="arial"></fb:like>
			</div>
		</aside>
	<?php else : ?>
		<aside class="header">
			<h2>Want to provide solution for this need?</h2>
			<button class="default provider_nomination" id="<?php echo $need_id; ?>">
				<a href="javascript:void(0);" class="provide_need_current_user">I&#8217;ll Provide This!</a>
			</button>
			<div class="needs-status-message">No thanks, but I&#8217;d like to <a href="javascript:void(0);" class="more_needs">see more Needs</a> like this.</div>
			<div class="fb_btn pv">
				<fb:like href="<?php echo base_url(); ?>#aneed_admin?n=<?php echo $need_id; ?>"" send="false" layout="button_count" width="50" show_faces="false" font="arial"></fb:like>
			</div>
		</aside>
	<?php endif; ?>
	
	<div class="thread_comment_list">
		<div class="box need_steps_cbox">
			<input class="comment-input-pad" type="text" id="conversation_comment" default="Join the conversation around this need..." />
		</div>
		<button class="default need-thread-post" id="add_post">Post</button>
		<div class="pv_photo"></div>
	</div>
	<section class="activity_view"></section>
	<div class="ap_wrapper"><a href="javascript:void(0);" class="a_paging activity">show next <span class="act_number"></span> posts...</a></div>

<?php else : ?>
	<aside class="header" id="need_thread_header_no_acc">
		<h2>You are not yet a member of this need team.</h2>
		<div class="needs-status-message no-access">
		<a href="javascript:void(0);" url="<?php echo base_url(); ?>#aneed_admin?n=<?php echo $need_id; ?>" content="ShareTest" class="a_share_dv" onClick="javascript:Micro.NeedProvision.handleFBPublish();">Share this need</a>, or nominate yourself for provision or delivery to gain access to this thread.
		</div>
	</aside>
<?php endif; ?>