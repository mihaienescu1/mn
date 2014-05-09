Micro.NeedDetails = {
	_pageName : 'NeedDetails',
	
	Init : function()
	{
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NEEDS.GET_NEED);
		Client.setData({id : 1});
		Client.setRequestMethod('GET');
		Client.setOkCallBack(this.getNeedSuccess, this);
		Client.Run();
	},
	
	Abandon : function(){
		console.log('abandon ' + this._pageName);
	},
	
	getNeedSuccess : function(json)
	{
		this.populateTopPart(json);
		this.populateSidebar(json);
		this.populateMainContent(json);
	},
	
	populateTopPart : function(json){
		var html = '<div class="thumbnail need">';
		html += '<span class="photo type-2"> <img src="img/spc_red.gif" alt="" title="" width="240" height="240"> </span>';
		html += '<div class="status provide_pending">';
			html += '<ul>';
				html += '<li class="check-new">New</li>';
				html += '<li class="check-share">Share</li>';
				html += '<li class="check-provide">Provide</li>';
				html += '<li class="check-deliver">Deliver</li>';
			html += '</ul>';
		html += '</div></div>';
		html += '<div class="details">';
			html += '<h2><a href="#">' + json.title + '</a></h2>';
			html += '<div class="location"><span class="icon"></span>' + json.location + '</div>';
			html += '<nav id="nav-need">';
				html += '<h4>Need Activity</h4>';
				html += '<ul>';
					html += '<li class="nav-details on"><a href="#need_details" rel="details">Details</a></li>';
					html += '<li class="nav-thread"><a href="#need_thread" rel="thread">Thread</a></li>';
					html += '<li class="nav-provision"><a href="#need_provision" rel="provision">Provision</a></li>';
					html += '<li class="nav-delivery"><a href="#need_delivery" rel="delivery">Delivery</a></li>';
					html += '<li class="nav-team"><a href="#need_team" rel="team">Team</a></li>';
				html += '</ul>';
			html += '</nav>';
		html += '</div>';
		
		Micro.populateNotebookView(html);
		Micro.setNotebookView(true);
	},
	
	populateSidebar : function(json){
		var html = '<div class="badge type-2">';
			html += '<h2>' + json.category.title + '</h2>';
			html += '<span class="icon"><img src="' + json.category.image + '" /></span>';
			html += '<h3>Posted ' + json.created + '</h3>';
		html += '</div>';
		
		Micro.populateSideBar(html);
	},
	
	populateMainContent : function(json){
		var html = '<aside class="header">';
			html += '<h2>Want to deliver the solution for this need?</h2>';
			html += '<button class="default">';
			html += '<a href="/dyn/form/nojs/do_deliver/3" class="ctools-use-modal ctools-modal-microneeds-forms-style  ctools-use-modal-processed" data-need="3">I\'ll Deliver This!</a>';
			html += '</button>';
		html += '</aside>';

		html += '<div class="need-details">';
			html += '<section class="description">';
				html += '<h3 class="title">Description</h3>';
				html += '<div class="content">';
					html += '<p>' + json.description + '</p>';
				html += '</div>';
			html += '</section>';
	
			html += '<section class="description">';
				html += '<h3 class="title">Situation</h3>';
				html += '<div class="content">';
					html += '<p>' + json.situation + '</p>';
				html += '</div>';
			html += '</section>';
	
			html += '<section class="description">';
				html += '<h3 class="title">Itemization</h3>';
				html += '<div class="content">';
					html += '<p>' + json.itemization + '</p>';
				html += '</div>';
			html += '</section>';
	
			html += '<section class="description location-map">';
				html += '<h3 class="title">Destination</h3>';
				html += '<div class="content">';
					html += '<div class="map"></div>';
					html += '<div class="address">Lodi Rd, New Delhi, Delhi 110003, India</div>';
			
					html += '<div class="clear"></div>';
				html += '</div>';
			html += '</section>';
	
			html += '<section class="description profile-mini clearfix">';
				html += '<h3 class="title">Originator</h3>';
				html += '<div class="profile-icon default-man"></div>';
		
				html += '<div class="content info">';
					html += '<h3><a href="">Jimmy Owner</a></h3>';
					html += '<p>I am the Director of Needs at lorem Ipsum dolet sid amet elitolk ore everit anen idium sensium sedom divit lorem ipsum dolet gomenish fidder domino nonummy elur. Sedom divitsum dolet sid amet elitolk ore everit anen.</p>';
					html += '<span class="date">Joined 3 months ago</span>';
					html += '<button class="default">3 Other Open Needs</button>';
				html += '</div>';
			html += '</section>';
		html += '</div>';
		
		Micro.populateMainContent(html);
	}
};