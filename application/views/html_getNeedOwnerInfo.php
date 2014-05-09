<aside class="header">
	<div class="need-status-message">
		<div class="attn_icon"></div>
		<div class="attn_text">
			<strong>No Co-Owner Selected!</strong> You may want to select a Co-Owner for this Need from the list of current team members, to assist you if needed.
		</div>
	</div>
</aside>
<section id="section-need-teams-owner" class="user-list owner">
	<article>
		<div class="profile-icon">
			<div class="picture_frame">
			<img src="<?php echo $userData['photo'] . '?width=90&height=75'; ?>" alt="" id="ntm_owner_pic" title="View user profile." width="90" height="75">
			</div>
		</div>
		<div class="info">
			<h5><a href="javascript:void(0);" id="ntm_owner_name"><?php echo $userData['firstname'] . ' ' . $userData['lastname']; ?></a></h5>
			<h4><a href="javascript:void(0);">Owner of this Need</a></h4>
			<span class="date">
				<strong>Joined : </strong> 
				<span id="ntm_owner_created_need"><?php echo date('H:i A F j, Y', strtotime($userData['created'])); ?></span>
			</span> 
		</div>
	</article>
	<article>
		<div class="profile-icon">
			<div class="picture_frame">
			<img src="" alt="" title="View user profile." width="90" height="75">
			</div>
		</div>
		<div class="info">
			<h5><a href="javascript:void(0);">Unnasigned</a></h5>
			<h4><a href="javascript:void(0);">Co-Owner of this need</a></h4>
			<span class="date">
				<strong class="need-team-owner-selection">Selected : </strong> 
				<?php if($viewData['is_need_owner']) : ?>
					<span class="need-team-owner-selection-date">You can select a Co-Owner</span>
				<?php endif; ?>
			</span> 
		</div>
		<?php if($viewData['is_need_owner']) : ?>
			<button class="default co-owner-select-btn" type="button" id="co-owner-select">Select a Co-Owner</button>
		<?php endif; ?>
	</article>
</section>