Micro.MyAccountNotifications = {
		
	_pageName : 'MyAccountNotifications',
	
	Init : function()
	{
		Micro.setNotebookView(false);
		
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod('users.getUser');
		Client.setData({id : 1});
		Client.setRequestMethod('GET');
		Client.setOkCallBack(this.setSideBarContent, this);
		Client.Run();
		
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod('users.getNotifications');
		Client.setData({id : 1});
		Client.setRequestMethod('GET');
		Client.setOkCallBack(this.setMainContent, this);
		Client.Run();
	},
	
	Abandon	: function(){
		$('.sidebar').removeClass('profile');
	},
	
	setSideBarContent : function(json){
		$('.sidebar').addClass('profile');
		
		var html = '';
		html += '<h3>My Account</h3>';
		html += '<section class="me">';
			html += '<div class="profile-icon default-man"></div>';
			html += '<h3>' + json.first_name + ' ' + json.last_name + '</h3>';
			html += '<a class="profile" href="#">Edit my account</a>';
		html += '</section>';

		html += '<nav>';
			html += '<ul>';
				html += '<li class="nav-profile"><a href="#profile">Profile</a></li>';
				html += '<li class="nav-messages"><a href="#mymessages">Messages</a></li>';
				html += '<li class="nav-notifications on"><a href="#notifications">Notifications</a></li>';
				html += '<li class="nav-settings"><a href="#settings">Settings</a></li>';
				html += '<li class="nav-friends"><a href="#myfriends">Friends</a></li>';
			html += '</ul>';
		html += '</nav>';

		html += '<section class="date">';
			html += '<h2>September</h2>';
			html += '<h3>28</h3>';
			html += '<h4>2011</h4>';
			html += 'Member Since';
		html += '</section>';

		html += '<button class="thin">Delete Account</button>';

		html += '<span class="bottom"></span>';
			
		Micro.populateSideBar(html);
	},
	
	setMainContent : function(json){
		var that = this;
		
		var html = '';
		html += '<aside class="header">';
			html += '<span class="icon exclamation"></span>';
			html += '<h2><strong>Want to earn an easy 50 points?</strong> Update your "Sharing Settings" now!</h2>';
			html += '<button class="default">';
				html += '<a href="#">Update Sharing</a>';
			html += '</button>';
		html += '</aside>';

		html += '<p class="intro">We send you notifications whenever actions are taken on MicroNeeds that involve you. You can change which notifications you receive in your <a href="#settings">Settings</a>.</p>';

		html += '<section class="notifications">';
			html += '<h3 class="title">Activity Notifications<span class="icon label archive"><span></span>Archive</span></h3>';
			html += '<dl>';
			
				$.each(json.activity, function(i, item){
					html += that.getNotificationHtml(item);
				});
				
			html += '</dl>';
		html += '</section>';

		html += '<section class="notifications">';
			html += '<h3 class="title">System Notifications<span class="icon archive"><span></span>Archive</span></h3>';
			html += '<dl>';
			
				$.each(json.system, function(i, item){
					html += that.getNotificationHtml(item);
				});
				
			html += '</dl>';
		html += '</section>';
		
		Micro.populateMainContent(html);
	},
	
	getNotificationHtml : function(item){
		var html = '';
		html += '<dt class="' + item.type + '"></dt>';
		html += '<dd>';
			if(item.url !== undefined){
				html += '<a href="' + item.url + '" class="view-details-arrow">View Need Details</a>';
			}
			
			html += '<h3>';
			
			if(item.username !== undefined){
				html += '<a href="">' + item.username + '</a> ';
			}
			
			html += item.description + '</h3>';
			html += '<span class="timestamp">' + item.time + '</span>';
		html += '</dd>';
		
		return html;
	}
	
};