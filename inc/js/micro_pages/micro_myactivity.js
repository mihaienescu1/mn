Micro.MyActivity	=	{
		
		_pageName 		: 	'MyActivity',
		_checkUpdates	:	null,
		_defaultRefresh	:	8000,
		_loadsArray		:	{},
		
		Init : function(e)
		{
			Micro.USER.isLoggedWithSocialAPI('#profile', function(data){
				if(data.id) {
					Micro.MyActivity.uid	=	data.id;
					Micro.MyActivity.postInit();
				}
			});	
		},
		
		postInit	:	function()
		{
			Micro.setNotebookView(false);
			var Client =  new AjaxFramework.Client();
				Client.setAjaxMethod(A.NEEDS.GET_USER_BY_ID);
				Client.setData({ uid : Micro.MyActivity.uid });
				Client.setOkCallBack(Micro.MyActivity.setUserInfo);
				Client.Run();
			delete Client;
							
			Micro.MyActivity.initContentShell();
			Micro.MyActivity.setPageBar();
			
			$('#section-content-main').delegate('.pv_confirm','click', Micro.MyActivity.handleConfirmProvisionClick);
			$('#section-content-main').delegate('.dv_confirm','click', Micro.MyActivity.handleConfirmDeliveryClick);
			$('#section-content-main').delegate('.select_provider', 'click', Micro.MyActivity.handleConfirmProviderSelection);
			$('#section-content-main').delegate('.select_deliverer', 'click', Micro.MyActivity.handleConfirmDelivererSelection);
			$('.nominate_provider').live('click', Micro.MyActivity.handleProviderNomination);
			$('.nominate_deliverer').live('click', Micro.MyActivity.handleDelivererNomination);
	
			Micro.MyActivity._checkUpdates	=	setInterval(function(){
				Micro.MyActivity.handleGetActionRequiredNeeds({ id : Micro._currentUser});
				Micro.MyActivity.handleGetInvolvedNeeds({id: Micro._currentUser});
			}, Micro.MyActivity._defaultRefresh);
			
		},
		
		Abandon	: function()
		{
	
			clearInterval(Micro.MyActivity._checkUpdates);
			Micro.MyActivity._checkUpdates	=	null;
		
			$('#section-content-main').undelegate('.pv_confirm','click');
			$('#section-content-main').undelegate('.dv_confirm','click');
			$('#section-content-main').undelegate('.select_provider','click');
			$('#section-content-main').undelegate('.select_deliverer','click');
			$('.nominate_provider').unbind().off();
			$('.nominate_deliverer').unbind().off();
			$('.sidebar').removeClass('profile');
		},
		
		handleProviderNomination	:	function()
		{	
			var oRequest	=	{
				provision	:	$(this).attr('id'),
				need		:	$(this).attr('need_id'),
				user		:	Micro._currentUser
			}
		
			var Client =  new AjaxFramework.Client();
				Client.setAjaxMethod(A.NEEDS.SELECT_NEED_PROVIDER);
				Client.setData(oRequest);
				Client.setOkCallBack(Micro.MyActivity.handleConfirmProvisionOK);
				Client.Run();
			delete Client;
			delete oRequest;
		},
		
		handleDelivererNomination	:	function()
		{
			var oRequest	=	{
				delivery	:	$(this).attr('id'),
				need		:	$(this).attr('need_id'),
				user		:	Micro._currentUser
			}
		
			var Client =  new AjaxFramework.Client();
				Client.setAjaxMethod(A.NEEDS.SELECT_NEED_DELIVERER);
				Client.setData(oRequest);
				Client.setOkCallBack(Micro.MyActivity.handleConfirmDeliveryOK);
				Client.Run();
			delete Client;
			delete oRequest;
		},
		
		handleConfirmProviderSelection	:	function()
		{
			var need_id	=	$(this).attr('need');
			var Client =  new AjaxFramework.Client();
				Client.setAjaxMethod(A.ACTIVITIES.GET_PROVISION_OFFERS);
				Client.setData({ need : need_id });
				Client.setOkCallBack(Micro.MyActivity.handlegetProvisionsOffersOK);
				Client.Run();
			delete Client;
		},
		
		handleConfirmDelivererSelection	:	function()
		{
			var need_id	=	$(this).attr('need');
			var Client =  new AjaxFramework.Client();
				Client.setAjaxMethod(A.ACTIVITIES.GET_DELIVERY_OFFERS);
				Client.setData({ need : need_id });
				Client.setOkCallBack(Micro.MyActivity.handlegetDeliveryOffersOK);
				Client.Run();
			delete Client;
		},
		
		handlegetDeliveryOffersOK	:	function(d)
		{
			if (d.markup) {
				Micro.showOverlay('Users who offered to deliver this need', ' ', d.markup, false);
			}
		},
		
		handlegetProvisionsOffersOK	:	function(d)
		{
			if (d.markup) {
				Micro.showOverlay('Users who offered to provide this need', ' ', d.markup, false);
			}
		},
		
		handleConfirmProvisionOK	:	function(d)
		{
			Micro.hideOverlay();
			Micro.handleNeedUpdate(d);
			Micro.MyActivity.setNeedConfirmedState(d.need_id);
		},
		
		handleConfirmDeliveryOK		:	function(d)
		{
			Micro.hideOverlay();
			Micro.handleNeedUpdate(d);
			Micro.MyActivity.setNeedConfirmedState(d.need_id);
		},
		
		handleConfirmDeliveryClick	:	function()
		{
			var dv_id	=	$(this).attr('id');
			console.log(dv_id);
		},
		
		setNeedConfirmedState	:	function(id)
		{
			/*
			var status		=	$('.needs-activity-action[id='+id+'] dl dt.icon.warning');
			var btn			=	$('.needs-activity-action[id='+id+'] dl dd');
			var actDate		=	$('.recent-activity .activity-timestamp');
			var actMsg		=	$('.recent-activity .activity-message');
			
			status.empty().html('<span></span>Pending need delivery!');
			btn.empty().html('<button class="thin" need="'+id+'" disabled="disabled">Provider selected</button>');
			actDate.empty().html("");
			actMsg.empty().html("");
			*/
			Micro.MyActivity.handleGetActionRequiredNeeds({ id : Micro._currentUser});
			Micro.MyActivity.handleGetInvolvedNeeds({id: Micro._currentUser});
		},
		
		setUserInfo		:	function(u)
		{
			$('.sidebar').addClass('profile');
			
			var html = '';
				html += '<h3>My Needs</h3>';
				html += '<section class="me">';
					html += '<div class="profile-icon dyn" style="background:url('+u.photo+'?width=145&height=130) no-repeat center;">';
					html += '</div>';
					html += '<h3 class="fullname">'+u.firstname + ', ' + u.lastname+'</h3>';
					html += '<a class="profile" href="#">View my profile</a>';
				html += '</section>';
				html += '<nav>';
					html += '<ul>';
						html += '<li class="nav-active on" id="active_needs_n"><a href="javacript:void(0);">Active <span>2</span></a></li>';
						html += '<li class="nav-open" id="nearby_needs_n"><a href="javacript:void(0);">Nearby <span>10</span></a></li>';
						html += '<li class="nav-archive" id="archive_needs_n"><a href="javacript:void(0);">Archive <span>12</span></a></li>';
					html += '</ul>';
				html += '</nav>';
				
				html += '<dl class="points level">';
					html += '<dt>';
					html += '<strong>9</strong>';
					html += 'Delivered';
					html += '</dt>';
					html += '<dd>History</dd>';
				html += '</dl>';
				
				html += '<button class="thin">Add a need</button>';
				html += '<span class="bottom"></span>';
				
			Micro.populateSideBar(html);
			
			Micro.MyActivity.handleGetActionRequiredNeeds(u);
			Micro.MyActivity.handleGetInvolvedNeeds(u);
		},
		
		handleGetActionRequiredNeeds	:	function(user)
		{
			
			var Client =  new AjaxFramework.Client();
				Client.setAjaxMethod(A.NEEDS.GET_ACTION_REQUIRE_NEEDS);
				Client.setData({ user : user.id });
				Client.setOkCallBack(Micro.MyActivity.populateNeeds);
				Client.Run();
				delete Client;
		},
		
		handleGetInvolvedNeeds	:	function(user)
		{
			var Client =  new AjaxFramework.Client();
				Client.setAjaxMethod(A.NEEDS.GET_NEEDS_WHERE_CURRENT_USER_INVOLDED);
				Client.setData({ user : user.id });
				Client.setOkCallBack(Micro.MyActivity.populateInvolvedNeeds);
				Client.Run();
				delete Client;
		},
		
		initContentShell		:	function()
		{
			var html	=	"";
				html += '<section class="needs-list" id="need-action-needs">';
				html += '</section>';
				html += '<section class="needs-list" id="need-involved-needs">';
				html += '</section>';
				html += '<section class="needs-list" id="need-opened">';
				html += '</section>';	
			Micro.populateMainContent(html);
		},
		
		populateNeeds	:	function(d)
		{
			$('#need-action-needs').html(d.markup);
			FB.XFBML.parse(document.getElementById('need-action-needs'));
		},
		
		populateInvolvedNeeds	:	function(d)
		{
			$('#need-involved-needs').html(d.markup);
			FB.XFBML.parse(document.getElementById('need-involved-needs'));
		},
		
		setNoteBookContent	:	function()
		{
			Micro.populateNotebookView("-");
			Micro.setNotebookView(false);
		},
		
		setSideBarContent	:	function()
		{
			$('.sidebar').addClass('profile');
			
			var html	=	"";
				html+="<h3>My Account</h3>\n";
				html+="<section class=\"me\">\n";
				html+="<div class=\"profile-icon large male\"></div>\n";
				html+="<h3>John Appleseed</h3>\n";
				html+="<a class=\"profile\" href=\"#!/profile\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"profile\">View My Profile</a>\n";
				html+="</section>\n";
				html+="\n";
				html+="<nav>\n";
				html+="<ul>\n";
				html+="<li class=\"nav-active on\"><a href=\"\">Active<span>2</span></a></li>\n";
				html+="<li class=\"nav-open\"><a href=\"\">Open<span>27</span></a></li>\n";
				html+="<li class=\"nav-archive\"><a href=\"\">Archive<span>11</span></a></li>\n";
				html+="</ul>\n";
				html+="</nav>\n";
				html+="<dl class=\"points level\">\n";
				html+="<dt><strong>9</strong>Delivered</dt>\n";
				html+="<dd>History</dd>\n";
				html+="</dl>\n";
				html+="<button class=\"thin\">Add a Need</button>\n";
				html+="\n";
				html+="<span class=\"bottom\"></span>\n";

			Micro.populateSideBar(html);
		},
		
		setPageBar	:	function() {
			var dynNav = Micro.BreadCrumbs.generate();
			$('.section-breadcrumbs .left-side .title').html( dynNav );
		},
};