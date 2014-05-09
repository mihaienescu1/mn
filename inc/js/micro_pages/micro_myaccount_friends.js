Micro.MyAccountFriends = {
		
	_pageName : 'MyAccountFriends',
	
	Init : function()
	{
		Micro.setNotebookView(false);
		
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.USERS.GET_USER);
		Client.setData({id : 1});
		Client.setRequestMethod('GET');
		Client.setOkCallBack(this.setSideBarContent, this);
		Client.Run();
		
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.USERS.GET_FRIENDS);
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
				html += '<li class="nav-notifications"><a href="#notifications">Notifications</a></li>';
				html += '<li class="nav-settings"><a href="#settings">Settings</a></li>';
				html += '<li class="nav-friends on"><a href="#myfriends">Friends</a></li>';
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
			html += '<h2>Want to earn an easy <strong>50 points</strong>? Update your "Sharing Settings" now!</h2>';
			html += '<button class="default">Update Sharing</button>';
		html += '</aside>';
		
		html += '<section id="section-myaccount-following" class="user-list">';
			html += '<h3>Following</h3>';
			
			$.each(json.following, function(i, user){
				html += that.getUserHtml(user);
			});
			
		html += '</section>';

		html += '<section id="section-myaccount-followers" class="user-list">';
			html += '<h3>Followers</h3>';
			
			$.each(json.followers, function(i, user){
				html += that.getUserHtml(user);
			});
			
		html += '</section>';
		
		Micro.populateMainContent(html);
	},
	
	getUserHtml : function(user){
		var html = '';
		html += '<article>';
			html += '<div class="profile-icon default-man">';
			html += '</div>';
			html += '<div class="info">';
				html += '<h4><a href="">' + user.username + '</a></h4>';
				html += '<div class="location"><span class="icon"></span>' + user.location + '</div>';
				html += '<span class="date"><strong>Joined:</strong> February, 2012</span>';
				html += '<a href="" class="icon label message"><span></span>Message</a>';
				html += '<a href="" class="icon label follow"><span></span>Follow</a>';
			html += '</div>';
			html += '<a class="view-details-arrow">View User Profile</a> ';
		html += '</article>';
		
		return html;
	}
	
};