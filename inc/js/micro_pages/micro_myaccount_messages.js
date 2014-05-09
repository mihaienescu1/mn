Micro.MyAccountMessages = {
		
	_pageName : 'MyAccountMessages',
	
	Init : function()
	{	
		if( Micro._currentUser ) this.postInit();
	},
	
	postInit	:	function()
	{
		Micro.setNotebookView(false);
		Micro.MyAccountMessages.setMainContent();
		Micro.MyAccountMessages.setPageBar();
		
		var Client =  new AjaxFramework.Client();
			Client.setAjaxMethod(A.USERS.GET_BY_ID);
			Client.setData({ uid : Micro._currentUser });
			Client.setOkCallBack(Micro.MyAccountMessages.setUserInfo);
			Client.Run();
			delete Client;
	},

	Abandon	: function()
	{
		$('.sidebar').removeClass('profile');
	},
	
	setUserInfo	:	function(u)
	{
		var joined		=	u.joined.split(" ");
		var dateJoined	=	new Date(joined[1]);
		var displayDate	=	{
			month	:	Micro.Utils.strMonth(dateJoined.getMonth()),
			day		:	parseInt(joined[1].substr(-2)),
			year	:	dateJoined.getFullYear()
		};

		$('.sidebar').addClass('profile');
		
		var html = '';
			html += '<h3>My Account</h3>';
			html += '<section class="me">';
				html += '<div class="profile-icon default-man"></div>';
				html += '<h3 class="fullname">'+u.firstname + ', ' + u.lastname+'</h3>';
				html += '<a class="profile" href="#">Edit my account</a>';
			html += '</section>';
			html += '<nav>';
				html += '<ul>';
					html += '<li class="nav-profile"><a href="#profile">Profile</a></li>';
					html += '<li class="nav-messages on"><a href="#mymessages">Messages</a></li>';
					html += '<li class="nav-notifications"><a href="#notifications">Notifications</a></li>';
					html += '<li class="nav-settings"><a href="#settings">Settings</a></li>';
					html += '<li class="nav-friends"><a href="#myfriends">Friends</a></li>';
				html += '</ul>';
			html += '</nav>';
			html += '<section class="date">';
				html += '<h2 class="month">'+displayDate.month+'</h2>';
				html += '<h3 class="day">'+displayDate.day+'</h3>';
				html += '<h4 class="year">'+displayDate.year+'</h4>';
				html += 'Member Since';
			html += '</section>';
			html += '<button class="thin">Delete Account</button>';
			html += '<span class="bottom"></span>';
			
		Micro.populateSideBar(html);
		
	},
	
	
	setMainContent	:	function()
	{
		var html = '';
		
			html += '<aside class="header">';
				html += '<span class="icon exclamation"></span>';
				html += '<h2><strong>Want to earn an easy 50 points?</strong> Update your "Sharing Settings" now!!</h2>';
				html += '<button class="default">';
					html += '<a href="#">Update Sharing</a>';
				html += '</button>';
			html += '</aside>';
			
			html += '<section class="messages">';
				html += '<h3 class="title">Conversations</h3>';
			html += '</section>';
			
			Micro.populateMainContent(html);
	},
	
	setPageBar	:	function() {
		var dynNav = Micro.BreadCrumbs.generate();
		$('.section-breadcrumbs .left-side .title').html( dynNav );
	},
	
	
};