Micro.NeedProvision = {

	_pageName 		: 	'NeedProvision',
	_currentNeed	:	false,
	_pagingActivity : 0,
	_pagingComments : 0,
	_defaultActivityToShow : 3,
	_defaultCommentsToShow : 4,
	
	_history		:	false,
	_reloadInterval	:	8000,
	_reloadTimer	:	null,
	
	Init : function()
	{	
		if (Micro.url.get().n) {
			if (!Micro._currentUser) {
				Micro.USER.isLoggedWithSocialAPI('#profile', function (data) {
					if (data.id) {
						Micro._currentUser = data.id;
						Micro.NeedProvision.postInit();
					}
				});
			} else {
				Micro.NeedProvision.postInit();
			}
		}
		else{
			Micro.NeedProvision.Abandon();
		}
	},
	
	postInit	:	function()
	{
		this.setNoteBookContent();
		this.setMainContent();
		this.setSideBarContent();
		
		Micro.clearText();
		
		Micro.NeedProvision._currentNeed = Micro.url.get().n;
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod('needs.getNeedById');
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedProvision._currentNeed
			});
			Client.setOkCallBack(Micro.NeedProvision.handleGetNeed);
			Client.Run();
		delete Client;
		
		$('#section-content-main').delegate('.provide_nomination','click', Micro.handleProvisionNomination);
		$('#section-content-main').delegate('#pv_show_history','click', Micro.NeedProvision.handleHistoryView);
		$('#section-content-main').delegate('.provider_nomination', 'click', Micro.handleProvisionNomination);
		$('#section-content-main').delegate('.deliverer_nomination', 'click', Micro.handleDeliveryNomination);
	},
	
	
	Abandon : function()
	{
		$('#section-content-main').undelegate('.provide_nomination','click');
		$('#section-content-main').undelegate('#pv_show_history','click');
		$('#section-content-main').undelegate('.provider_nomination', 'click');
		$('#section-content-main').undelegate('.deliverer_nomination', 'click' );
		
		clearInterval(Micro.NeedProvision._reloadTimer);
		Micro.NeedProvision._reloadTimer	=	null;
	},
	
	loadDeliveryInfo	:	function()
	{
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod('activities.getNeedProvisionInfo');
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedProvision._currentNeed
			});
			Client.setOkCallBack(Micro.NeedProvision.handleGetProvisionInfo);
			Client.Run();
		delete Client;
	},
	
	resetHeader		:	function(d)
	{
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod('needs.getNeedById');
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedProvision._currentNeed
			});
			Client.setOkCallBack(function(d){
				
					var	question	=	"Want to provide solution for this need?";
					var	buttonText	=	"I&#8217;ll Provide This!";
					var	buttonClass	=	"provider_nomination";
					var msg			=	'No thanks, but I&#8217;d like to <a href="javascript:void(0);" class="more_needs">see more Needs</a> like this.';
					var	isProvision	=	"";
					
					if( d.need.status_actions.in_array("provided") )
					{
						
						question	=	"Want to deliver this need?";
					 	buttonText	=	"I&#8217;ll Deliver This!";
					 	buttonClass	=	"deliverer_nomination";
						msg			=	'No thanks, but I&#8217;d like to <a href="javascript:void(0);" class="more_needs">see more Needs</a> like this.';
						
						if(d.need.pv_accepted[0].pv_id) isProvision	=	"provision_id"+d.need.pv_accepted[0].pv_id;
					}
					
					if( d.need.status_actions.in_array("delivered") )
					{
						question	=	"Interested in this need? It\'s pretty much covered but we\'ve got more..";
						buttonText	=	"Show Similar Needs!";
						buttonClass	=	"show_sim_needs";
						msg			=	'Show me <a href="javascript:void(0);" class="more_needs">other Needs</a> from this originator.';
						
						isProvision	=	"";
					}
							
					var asideHeader	="";
						asideHeader += '<h2>'+question+'</h2>';
						asideHeader += '<button class="default '+buttonClass+'" id="' + Micro.NeedProvision._currentNeed + '">';
						asideHeader += '<a href="javascript:void(0);" class="provide_need_current_user">'+buttonText+'</a>';
						asideHeader += '</button>';
						asideHeader += '<div class="needs-status-message">';
						asideHeader += msg;
						asideHeader += '</div>';
						asideHeader += '<div class="fb_btn nth">';
						asideHeader += '<fb:like href="http://dev.microneeds.com/#aneed_admin?n=' + Micro.NeedProvision._currentNeed + '" send="false" layout="button_count" width="50" show_faces="false" font="arial"></fb:like>';
						asideHeader += '</div>'
				
					$('#need_provision_header').html( asideHeader );
					FB.XFBML.parse(document.getElementById('section-content-main'));
			});
			Client.Run();
			delete Client;
	},
	
	handleGetNeed	:	function(d)
	{
		$('#pv_need_title').html(d.need.title || "");
		$('#pv_need_cat_title').html(d.need.type_label || "");
		$('#pv_icon_type').attr('class', 'icon category ' + d.need.type_label.replace(" ", "").toLowerCase());
		$('#pv_need_photo').attr('src', url + 'photos/needs/' + d.need.photo);
		$('.need_status_graph').attr('id', d.need.id);
		Micro.geo.getAddressArrayByAddressString(d.need.location, function (oAddr) {
			var cityStateStr = oAddr.locality + ', ' + oAddr.administrative_area_level_1;
			$('#pv_location_text').html(cityStateStr || "");
		});
		var oDate = new Date(d.need.created.split(" ")[0]);
		var strPosted = 'Posted ' + Micro.Utils.strMonth(oDate.getMonth()) + ' ' + oDate.getDay();
		$('#pv_need_creation_date').html(strPosted);
		delete oDate;
		delete strPosted;
		
		Micro.NeedProvision.loadDeliveryInfo();
		Micro.NeedProvision.resetHeader(d);
		Micro.handleNeedUpdateResponseOK(d);
		
		Micro.NeedProvision._reloadTimer	=	setInterval(function(){
					Micro.NeedProvision.loadDeliveryInfo();
					Micro.NeedProvision.resetHeader();
		}, Micro.NeedProvision._reloadInterval);
		
	},
	
	handleHistoryView	:	function(e)
	{		
		
		if( !Micro.NeedProvision._history ){
			$('.history_lines').fadeIn();
			$(this).html("Hide History");
			Micro.NeedProvision._history	=	true;
		}
		else{
			$('.history_lines').fadeOut();
			$(this).html("Show History");
			Micro.NeedProvision._history	=	false;
		}
	},
	
	handleGetProvisionInfo	:	function(d)
	{
		if("OK"	===	d.status)
		{
			$('#section-need-teams-owner').html(d.markup);
			
				if( Micro.NeedProvision._history ){
					$('.history_lines').show();
					$('#pv_show_history').html('Hide History');
				}
		}
	},
	
	setNoteBookContent : function ()
	{
		var html = '<div class="thumbnail need">';
			html += '<span class="photo type-2">';
			html += '<img src="" alt="" title="" width="240" height="240" id="pv_need_photo">';
			html += '</span>';
			html += '<div class="need_status_graph" id="">';
				html += '<div class="check liked"></div>';
				html += '<div class="check shared"></div>';
				html += '<div class="check provided"></div>';
				html += '<div class="check delivered"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="details">';
			html += '<h2><a href="javascript:void(0);" id="pv_need_title"></a></h2>';
			html += '<div class="location"><span class="icon"></span><span id="pv_location_text"></span></div>';
			html += '<nav id="nav-need">';
			html += '<h4>Need Activity</h4>';
				html += '<ul>';
					html += '<li class="nav-details"><a href="javascript:Micro.LoadPage(\'#aneed_admin?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-thread"><a href="javascript:Micro.LoadPage(\'#need_thread?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-provision on"><a href="javascript:void(0);"></a></li>';
					html += '<li class="nav-delivery"><a href="javascript:Micro.LoadPage(\'#need_delivery?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-team"><a href="javascript:Micro.LoadPage(\'#need_team?n=' + Micro.url.get().n + '\');"></a></li>';
				html += '</ul>';
			html += '</nav>';
			html += '</div>';
		
		Micro.populateNotebookView(html);
		Micro.setNotebookView(true);
	},
	
	setMainContent : function()
	{
		var html = '<aside class="header" id="need_provision_header">';
			
			html += '</aside>';
			
			html += '<section id="section-need-teams-owner" class="user-list owner">';
			
			html += '</section>';
			/*
			html += '<section id="section-need-teams-owner" class="user-list owner">';
	            html += '<article id="owner_info">';
	                html += '<div class="profile-icon">';
	                    html += '<div class="picture_frame">';
						html += '<img id="pv_user_photo" src="" alt="" title="View user profile." width="50" height="50">';
						html += '</div>';
	                html += '</div>';
	                html += '<div class="info">';
	                    html += '<h5><a href="javascript:void(0);" id="pv_user_fullname">Larry Layover</a></h5>';
	                    html += '<h4><a href="javascript:void(0);">Provider of this Need</a></h4>';
	                    html += '<span class="date">';
							html += '<strong>Accepted:</strong>';
							html += '<span id="pv_user_accepted">8:22 PM November 30, 2011</span>';
						html += '</span>';
	                html += '</div>';
	                html += '<button class="default" type="button">Message Provider</button> ';
	            html += '</article>';
				
	            html += '<article id="status_info">';
	                html += '<div class="status large">';
	                    html += '<ul>';
	                        html += '<li class="check-new">New</li>';
	                        html += '<li class="check-share">Share</li>';
	                        html += '<li class="check-provide">Provide</li>';
	                        html += '<li class="check-deliver">Deliver</li>';
	                    html += '</ul>';
	                html += '</div>';
					
					html += '<div class="info main history">';
	                    html += '<h5>Status : Ready for Delivery</h5>';
	                    html += '<span class="date">4 minutes ago</span>';
	                html += '</div>';
					
					html += '<section class="history_lines">';
					
						html += '<div class="info_history">';
							html += '<div class="line">';
								html += '<div class="icon_state three"></div>';
								html += '<h5>Provision Confirmed</h5>';
								html += '<span class="date">4 minutes ago</span>';
							html += '</div>';
						html += '</div>';
						
						html += '<div class="info_history">';
							html += '<div class="line">';
								html += '<div class="icon_state two"></div>';
								html += '<h5>Need Solutin Acquired</h5>';
								html += '<span class="date">4 minutes ago</span>';
							html += '</div>';
						html += '</div>';
						
						html += '<div class="info_history">';
							html += '<div class="line">';
								html += '<div class="icon_state one"></div>';
								html += '<h5>Provision Commenced</h5>';
								html += '<span class="date">4 minutes ago</span>';
							html += '</div>';
						html += '</div>';
					html += '</section>';
					
	                html += '<button class="default" type="button">Show History</button>';
	            html += '</article>';
			html += '</section>';
			
			html += '<div class="box need_steps_cbox provision_page">';
				html += '<input id="pv_conversation_comment" type="text" default="Join the conversation around the provisioning of this need..." value="">';
			html += '</div>';
		
			html += '<section id=\"section-need-comments-6\" class=\"comments-list\"><article><div class=\"profile-icon\"><div class=\"picture_frame\"><img src=\"https:\/\/graph.facebook.com\/100000766901491\/picture?width=90&height=80\" width=\"90\" height=\"80\" class=\"user_pic\"><\/div><\/div><div class=\"info\"><div class=\"content\"><h4><a href=\"\">Mihai Enescu<\/a> commented<\/h4><p>cmd<\/p><div class=\"actions\"><span class=\"posted\">a few seconds ago<\/span><a href=\"javascript:void(0);\" class=\"add_action unlike first\" id=\"6\">UnLike<\/a><a href=\"javascript:void(0);\" class=\"add_action comment\" id=\"6\">Comment<\/a><a href=\"javascript:void(0);\" class=\"add_action share\" id=\"6\">Share<\/a><a href=\"javascript:void(0);\" class=\"add_action delete\" id=\"6\">Delete<\/a><\/div><a class=\"icon comments like on unlinke_thumbs\" id=\"6\"><span><\/span>Like<\/a><a class=\"icon comments comment\" id=\"6\"><span><\/span>Comment<\/a><\/div><div style=\"clear:both; height:4px;\"><\/div><section class=\"comments-like\" id=\"6\"><div class=\"left\"><a href=\"javascript:void(0);\" class=\"icon view-like cm\" id=\"6\"><span><\/span><strong class=\"likes_count_6\">1 People<\/strong> <b>like this<\/b><\/a><a href=\"javascript:void(0);\" class=\"icon view-comments cm\" id=\"6\"><span><\/span><strong class=\"comments_count_6\">1 Comment<\/strong><\/a><\/div><div class=\"right\"><\/div><\/section><div class=\"activity_comments\" id=\"ac_6\"><a href=\"javascript:void(0);\" class=\"show_more_sub\" id=\"6\" limit=\"\">show previous comments...<\/a><\/div><div class=\"comments_add_wrapper\" id=\"cax_6\"><input type=\"text\" class=\"comments_add_box\" default=\"Add comment...\" value=\"\" id=\"6\"><\/div><\/div><\/article><div id=\"publish_info_6\"><input type=\"hidden\" class=\"share_data\" name=\"picture\" value=\"http:\/\/dev.microneeds.com\/img\/shared_photo_sample.jpg\"><input type=\"hidden\" class=\"share_data\" name=\"link\" value=\"\"><input type=\"hidden\" class=\"share_data\" name=\"description\" value=\"cmd\"><input type=\"hidden\" class=\"share_data\" name=\"name\" value=\"Mihai Enescu\"><input type=\"hidden\" class=\"share_data\" name=\"caption\" value=\"\"><input type=\"hidden\" class=\"share_data\" name=\"type\" value=\"COMMENT\"><input type=\"hidden\" class=\"share_data\" name=\"user_id\" value=\"2\"><\/div><\/section><section id=\"section-need-comments-5\" class=\"comments-list\"><article><div class=\"profile-icon\"><div class=\"picture_frame\"><img src=\"https:\/\/graph.facebook.com\/100000766901491\/picture?width=90&height=80\" width=\"90\" height=\"80\" class=\"user_pic\"><\/div><\/div><div class=\"info\"><div class=\"shared_photo\"><div class=\"img\" style=\"background-image:url(http:\/\/open.thumbshots.org\/image.aspx?url=http:\/\/www.facebook.com);\"><\/div><\/div><div class=\"content\"><h4><a href=\"\">Mihai Enescu<\/a> shared a <a href=\"http:\/\/www.facebook.com\">link<\/a><\/h4><p> ';
			html += '<a target=\"_blank\" class=\"autolinks\" href="http:\/\/www.facebook.com">http:\/\/www.facebook.com<\/a><\/p><div class=\"actions\"><span class=\"posted\">a few seconds ago<\/span><a href=\"javascript:void(0);\" class=\"add_action like first\" id=\"5\">Like<\/a><a href=\"javascript:void(0);\" class=\"add_action comment\" id=\"5\">Comment<\/a><a href=\"javascript:void(0);\" class=\"add_action share\" id=\"5\">Share<\/a><a href=\"javascript:void(0);\" class=\"add_action delete\" id=\"5\">Delete<\/a><\/div><a class=\"icon comments like\" id=\"5\"><span><\/span>Like<\/a><a class=\"icon comments comment\" id=\"5\"><span><\/span>Comment<\/a><\/div><div style=\"clear:both; height:4px;\"><\/div><section class=\"comments-like\" id=\"5\"><div class=\"left\"><a href=\"javascript:void(0);\" class=\"icon view-like cm dontShow\" id=\"5\"><span><\/span><strong class=\"likes_count_5\">0 People<\/strong> <b>like this<\/b><\/a><a href=\"javascript:void(0);\" class=\"icon view-comments cm\" id=\"5\"><span><\/span><strong class=\"comments_count_5\">1 Comment<\/strong><\/a><\/div><div class=\"right\"><\/div><\/section><div class=\"activity_comments\" id=\"ac_5\"><a href=\"javascript:void(0);\" class=\"show_more_sub\" id=\"5\" limit=\"\">show previous comments...<\/a><\/div><div class=\"comments_add_wrapper\" id=\"cax_5\"><input type=\"text\" class=\"comments_add_box\" default=\"Add comment...\" value=\"\" id=\"5\"><\/div><\/div><\/article><div id=\"publish_info_5\"><input type=\"hidden\" class=\"share_data\" name=\"picture\" value=\"http:\/\/dev.microneeds.com\/img\/shared_photo_sample.jpg\"><input type=\"hidden\" class=\"share_data\" name=\"link\" value=\"http:\/\/www.facebook.com\"><input type=\"hidden\" class=\"share_data\" name=\"description\" value=\"http:\/\/www.facebook.com\"><input type=\"hidden\" class=\"share_data\" name=\"name\" value=\"Mihai Enescu\"><input type=\"hidden\" class=\"share_data\" name=\"caption\" value=\"\"><input type=\"hidden\" class=\"share_data\" name=\"type\" value=\"SHARE_LINK\"><input type=\"hidden\" class=\"share_data\" name=\"user_id\" value=\"2\"><\/div><\/section><section id=\"section-need-comments-4\" class=\"comments-list\"><article><div class=\"profile-icon\"><div class=\"picture_frame\"><img src=\"https:\/\/graph.facebook.com\/100000766901491\/picture?width=90&height=80\" width=\"90\" height=\"80\" class=\"user_pic\"><\/div><\/div><div class=\"info\"><div class=\"content\"><h4><a href=\"\">Mihai Enescu<\/a> commented<\/h4><p>ax<\/p><div class=\"actions\"><span class=\"posted\">2 hours, 10 minutes ago<\/span><a href=\"javascript:void(0);\" class=\"add_action like first\" id=\"4\">Like<\/a><a href=\"javascript:void(0);\" class=\"add_action comment\" id=\"4\">Comment<\/a><a href=\"javascript:void(0);\" class=\"add_action share\" id=\"4\">Share<\/a><a href=\"javascript:void(0);\" class=\"add_action delete\" id=\"4\">Delete<\/a><\/div><a class=\"icon comments like\" id=\"4\"><span><\/span>Like<\/a><a class=\"icon comments comment\" id=\"4\"><span><\/span>Comment<\/a><\/div><div style=\"clear:both; height:4px;\"><\/div><section class=\"comments-like\" id=\"4\"><div class=\"left\"><a href=\"javascript:void(0);\" class=\"icon view-like cm dontShow\" id=\"4\"><span><\/span><strong class=\"likes_count_4\">0 People<\/strong> <b>like this<\/b><\/a><a href=\"javascript:void(0);\" class=\"icon view-comments cm\" id=\"4\"><span><\/span><strong class=\"comments_count_4\">1 Comment<\/strong><\/a><\/div><div class=\"right\"><\/div><\/section><div class=\"activity_comments\" id=\"ac_4\"><a href=\"javascript:void(0);\" class=\"show_more_sub\" id=\"4\" limit=\"\">show previous comments...<\/a><\/div><div class=\"comments_add_wrapper\" id=\"cax_4\"><input type=\"text\" class=\"comments_add_box\" default=\"Add comment...\" value=\"\" id=\"4\"><\/div><\/div><\/article><div id=\"publish_info_4\"><input type=\"hidden\" class=\"share_data\" name=\"picture\" value=\"http:\/\/dev.microneeds.com\/img\/shared_photo_sample.jpg\"><input type=\"hidden\" class=\"share_data\" name=\"link\" value=\"\"><input type=\"hidden\" class=\"share_data\" name=\"description\" value=\"ax\"><input type=\"hidden\" class=\"share_data\" name=\"name\" value=\"Mihai Enescu\"><input type=\"hidden\" class=\"share_data\" name=\"caption\" value=\"\"><input type=\"hidden\" class=\"share_data\" name=\"type\" value=\"COMMENT\"><input type=\"hidden\" class=\"share_data\" name=\"user_id\" value=\"2\"><\/div><\/section>';
			*/

		Micro.populateMainContent(html);
	},
	
	setSideBarContent : function () 
	{
		var html  = '<div class="badge type-2">';
			html += '<h2 id="pv_need_cat_title"></h2>';
			html += '<span class="icon" id="pv_icon_type"></span>';
			html += '<h3 id="pv_need_creation_date"></h3>';
			html += '</div>';
			
		Micro.populateSideBar(html);
	},
	
	
};