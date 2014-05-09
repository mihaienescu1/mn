Micro.NeedReport = {
	_pageName : 'NeedReport',
	
	Init : function()
	{
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod('needs.getNeed');
		Client.setData({id : 1});
		Client.setRequestMethod('GET');
		Client.setOkCallBack(this.getNeedSuccess, this);
		Client.Run();
	},
	
	Abandon : function(){
		console.log('abandon ' + this._pageName);
	},
	
	getNeedSuccess : function(json){
		this.populateTopPart(json);
		this.populateSidebar(json);
		this.populateMainContent(json);
	},
	
	populateTopPart : function(json){
		var html = '<div class="thumbnail need">';
		html += '<span class="photo type-2"> <img src="img/spc_red.gif" alt="" title="" width="240" height="240"> </span>';
		html += '<div class="status deliver">';
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
			html += '<h2>Interested in this need? It\'s pretty much covered but we\'ve got more.</h2>';
			html += '<button class="default">Show Similar Needs</button>';
			html += '<div class="needs-status-message">Show me other needs from this originator.</div>';
		html += '</aside>';

		html += '<section id="section-report-specs">';
			html += '<h3 class="title">Specs';
				html += '<button type="button" class="thin">Original Report</button>';
				html += '<button type="button" class="thin on">Fulfillment Report</button>';
			html += '</h3>';

			html += '<ul class="report">';
				html += '<li>Solution Origination: <strong>Big Bear Lake, CA</strong></li>';
				html += '<li>Deliverer: <strong>Johnny Appleseed</strong></li>';
				html += '<li>Delivery Location: <strong>' + json.location + '</strong></li>';
				html += '<li>Originator: <strong>' + json.owner.username + '</strong></li>';
				html += '<li>Time to Completion: <strong>9 days</strong></li>';
			html += '</ul>';
		html += '</section>';

		html += '<section id="section-report-activity" class="clearfix">';
			html += '<h3 class="title">Activity</h3>';
			html += '<dl class="report-circle">';
				html += '<dt>' + json.summary.likes + '</dt><dd>Like</dd>';
			html += '</dl>';
			html += '<dl class="report-circle">';
				html += '<dt>' + json.summary.shares + '</dt><dd>Share</dd>';
			html += '</dl>';

			html += '<div class="report-participation">';
				html += '<ul>';
					var full = json.summary.participants / 10;
					var rest = json.summary.participants % 10;

					for(var i=0; i<22; i++){
						var attr = '';
						if(full > 0){
							attr = 'class="full"';
							full--;
						}
						else if(rest > 0){
							//ToDo: not only 3/4. More steps.
							attr = 'class="three-fourths"';
							rest = 0;
						}

						html += '<li ' + attr + '></li>';
					}
				html += '</ul>';
				html += '<strong>' + json.summary.participants + '</strong>';
				html += '<span>Participation</span>';
			html += '</div>';
		html += '</section>';

		html += '<section id="section-report-fulfillment-photos" class="clearfix">';
			html += '<h3 class="title">Fulfillment Photos</h3>';
			//html += '<div class="picture size-212x122"><a href="#" title="View user profile."></a></div>';
			html += '<div class="picture upload size-212x122"><a href="#" title="Upload a Photo">Upload a Photo</a></div>';
		html += '</section>';

		html += '<section class="description">';
			html += '<h3 class="title">Report Notes</h3>';
			html += '<div class="content"><p>Divit dolet gomenish fidder domino nonummy elur. Gamet elitolk idium sensium sedom divit lorem ipsum dolet gomenish fidder domino. Sid amet elitolk ore everit anen idium sensium sedom divit lorem ipsum dolet gomenish fidder domino nonummy elur. Sedom divitsum dolesid amet elitolk or everit.</p></div>';
		html += '</section>';
		
		Micro.populateMainContent(html);
	}
};