Micro.NeedTeam = {

	_pageName : 'NeedTeam',
	
	Init : function() {
		if (Micro.url.get().n) {
			if (!Micro._currentUser) {
				Micro.USER.isLoggedWithSocialAPI('#profile', function (data) {
					if (data.id) {
						Micro._currentUser = data.id;
						Micro.NeedTeam.postInit();
					}
				});
			} else {
				Micro.NeedTeam.postInit();
			}
		} else {
			Micro.NeedTeam.Abandon();
		}
	},
	
	postInit	:	function() {
	
		Micro.NeedTeam.setMainContent();
		Micro.NeedTeam.setSidebarContent();
		Micro.NeedTeam.setNotebookContent();
		Micro.NeedTeam._currentNeed = Micro.url.get().n;
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NEEDS.GET_BY_ID);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedTeam._currentNeed
			});
			Client.setOkCallBack(this.handleGetNeed);
			Client.Run();
		delete Client;
	},
	
	Abandon : function() {
		
	},
	
	handleGetNeed	:	function(d) {
	
		var formattedDate	=	d.need["created(team_page_format)"];
		
		$('#ntm_owner_created_need').html(formattedDate);
		$('#ntm_need_title').html(d.need.title || "");
		$('#ntm_need_cat_title').html(d.need.type_label || "");
		$('#ntm_icon_type').attr('class', 'icon category ' + d.need.type_label.replace(" ", "").toLowerCase());
		$('#ntm_need_photo').attr('src', url + 'photos/needs/' + d.need.photo);
		Micro.geo.getAddressArrayByAddressString(d.need.location, function (oAddr) {
			var cityStateStr = oAddr.locality + ', ' + oAddr.administrative_area_level_1;
			$('#ntm_location_text').html(cityStateStr || "");
		});
		var oDate = new Date(d.need.created.split(" ")[0]);
		var strPosted = 'Posted ' + Micro.Utils.strMonth(oDate.getMonth()) + ' ' + oDate.getDay();
		$('#ntm_need_cration_date').html(strPosted);
		delete oDate;
		delete strPosted;
		
		Micro.NeedTeam.getNeedOwnerInfo(d.need.id);
		Micro.handleNeedUpdate({ need_id : d.need.id });

		console.log( ' Micro need team page ');
		console.log( d );
		
	},
	
	handleCoOwnerSelection	:	function() {
		console.log('AxAx');
	},
	
	getNeedOwnerInfo	:	function(n) {
	
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NEEDS.GET_NEED_OWNER_INFO);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : n
			});
			Client.setOkCallBack(Micro.NeedTeam.handleGetNeedOwnerInfo);
			Client.Run();
		delete Client;
	},
	
	handleGetNeedOwnerInfo	:	function(d) {
	
		/*
		if( "OK" == d.status)
		{
			var us	=	d.result;
			var pic	=	us.photo + '?width=90&height=75';
			
			$('#ntm_owner_name').html( us.firstname + ' ' + us.lastname );
			$('#ntm_owner_pic').attr('src', pic);
		}*/
		
		/*
		if("OK" == d.status) {
			Micro.NeedTeam.setMainContent();
			console.log( d );
		}
		*/
		
		if("OK" == d.status) {
			Micro.NeedTeam.setMainContent(d.view);
			$('#co-owner-select').bind('click', Micro.NeedTeam.handleCoOwnerSelection);
		}
		
	},
	
	setMainContent	:	function(view) {
	

		var html = '<aside class="header">';
				html += '<div class="need-status-message">';
					html +=	'<div class="attn_icon"></div>';
					html += '<div class="attn_text">';
						html += '<strong>No Co-Owner Selected!</strong> You may want to select a Co-Owner for this Need from the list of current team members, to assist you if needed.';
					html += '</div>';
				html += '</div>';
			html += '</aside>';
			
			html += '<section id="section-need-teams-owner" class="user-list owner">';
			
				html += '<article>';
					html += '<div class="profile-icon">';
						html += '<div class="picture_frame">';
						html += '<img src="" alt="" id="ntm_owner_pic" title="View user profile." width="90" height="75">';
						html += '</div>';
					html += '</div>';
					html += '<div class="info">';
						html += '<h5><a href="javascript:void(0);" id="ntm_owner_name"></a></h5>';
						html += '<h4><a href="javascript:void(0);">Owner of this Need</a></h4>';
						html += '<span class="date">';
							html += '<strong>Need Created : </strong> ';
							html += '<span id="ntm_owner_created_need">8:22 PM November 30, 2011</span>';
						html += '</span> ';
					html += '</div>';
				html += '</article>';
				
				html += '<article>';
					html += '<div class="profile-icon">';
						html += '<div class="picture_frame">';
						html += '<img src="img/no-co-owner.png" alt="" title="View user profile." width="90" height="75">';
						html += '</div>';
					html += '</div>';
					html += '<div class="info">';
						html += '<h5><a href="javascript:void(0);">Unnasigned</a></h5>';
						html += '<h4><a href="javascript:void(0);">Co-Owner of this need</a></h4>';
						html += '<span class="date">';
							html += '<strong class="need-team-owner-selection">Selected : </strong> ';
							html += '<span class="need-team-owner-selection-date">You can select a Co-Owner</span>';
						html += '</span> ';
					html += '</div>';
					html += '<button class="default co-owner-select-btn" type="button">Select a Co-Owner</button> ';
				html += '</article>';
				
			html += '</section>';

			html += '<section id="need-team-members">';
				html += '<h4>Current Team Members</h4>';
				html += '<div class="member-line">';
					html += '<div class="profile-icon">';
						html += '<div class="picture_frame">';
						html += '<img src="" alt="" title="View user profile." width="90" height="75">';
						html += '</div>';
					html += '</div>';
					html += '<div class="team-member-name">Lady GoooGoo</div>';
					html += '<div class="location"><span class="icon"></span>My Address</div>';
					html += '<div class="user_date"><strong>Joined:</strong> November, 2011</div>';
					html += '<div class="message_box"><div class="inner">Message</div></div>';
					html += '<div class="follow_box"><div class="inner">Follow</div></div>';
					html += '<div class="details-view"></div>';
				html += '</div>';
					
					html += '<div style="clear:both; height:1px;"></div>';
					
				html += '<div class="member-line">';
					html += '<div class="profile-icon">';
						html += '<div class="picture_frame">';
						html += '<img src="" alt="" title="View user profile." width="90" height="75">';
						html += '</div>';
					html += '</div>';
					html += '<div class="team-member-name">Lady GoooGoo</div>';
					html += '<div class="location"><span class="icon"></span>My Address</div>';
					html += '<div class="user_date"><strong>Joined:</strong> November, 2011</div>';
					html += '<div class="message_box"><div class="inner">Message</div></div>';
					html += '<div class="follow_box"><div class="inner">Follow</div></div>';
					html += '<div class="details-view"></div>';
				html += '</div>';
				
			html += '</section>';
			
			
		Micro.populateMainContent(view);
		
	},
	
	setSidebarContent	:	function() {
	
		var html = '<div class="badge type-2">';
			html += '<h2 id="ntm_need_cat_title"></h2>';
			html += '<span class="icon" id="ntm_icon_type"></span>';
			html += '<h3 id="nth_need_cration_date"></h3>';
			html += '</div>';
		Micro.populateSideBar(html);
	},
	
	setNotebookContent	:	function() {
	
		var html = '<div class="thumbnail need">';
			html += '<span class="photo type-2">';
			html += '<img src="" alt="" title="" width="240" height="240" id="ntm_need_photo">';
			html += '</span>';
			html += '<div class="need_status_graph" id="' + Micro.url.get().n + '">';
			html += '<div class="check liked"></div>';
			html += '<div class="check shared"></div>';
			html += '<div class="check provided"></div>';
			html += '<div class="check delivered"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="details">';
			html += '<h2><a href="javascript:void(0);" id="ntm_need_title"></a></h2>';
			html += '<div class="location"><span class="icon"></span><span id="ntm_location_text"></span></div>';
			html += '<nav id="nav-need">';
			html += '<h4>Need Activity</h4>';
			html += '<ul>';
			html += '<li class="nav-details"><a href="javascript:Micro.LoadPage(\'#aneed_admin?n=' + Micro.url.get().n + '\');"></a></li>';
			html += '<li class="nav-thread"><a href="javascript:Micro.LoadPage(\'#need_thread?n=' + Micro.url.get().n + '\');"></a></li>';
			html += '<li class="nav-provision"><a href="javascript:Micro.LoadPage(\'#need_provision?n=' + Micro.url.get().n + '\');"></a></li>';
			html += '<li class="nav-delivery"><a href="javascript:Micro.LoadPage(\'#need_delivery?n=' + Micro.url.get().n + '\');"></a></li>';
			html += '<li class="nav-team on"><a href="javascript:void(0);"></a></li>';
			html += '</ul>';
			html += '</nav>';
			html += '</div>';
		
		Micro.populateNotebookView(html);
		Micro.setNotebookView(true);
	}
};