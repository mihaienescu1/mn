Micro.MyAccountSettings = {
		
	_pageName : 'MyAccountSettings',
	
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
		Client.setAjaxMethod(A.USERS.GET_SETTINGS);
		Client.setData({id : 1});
		Client.setRequestMethod('GET');
		Client.setOkCallBack(this.setMainContent, this);
		Client.Run();
	},
	
	Abandon	: function()
	{
		$('.sidebar').removeClass('profile');
	},
	
	setSideBarContent : function(json)
	{
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
				html += '<li class="nav-settings on"><a href="#settings">Settings</a></li>';
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
	
	setMainContent : function(json)
	{
		var html = '';
		html += '<aside class="header">';
			html += '<span class="icon exclamation"></span>';
			html += '<h2><strong>Want to earn an easy 50 points?</strong> Update your "Sharing Settings" now!!</h2>';
			html += '<button class="default">';
				html += '<a href="#">Update Sharing</a>';
			html += '</button>';
		html += '</aside>';

		html += '<p class="intro">Use this page to manage the settings of your MicroNeeds account. To change any personal infomation, use your <a href="">Profile</a> page. Changes to your profile on linked accounts (Facebook, Twitter, etc.) must be made on each site directly.</p>';

		html += '<section class="notifications">';
			html += '<h3 class="title">Sharing Settings<span class="icon label add"><span></span>Add a Network</span></h3>';
			html += '<dl> ';
				html += '<dt class="facebook"></dt><dd><button class="thin">Revoke Access</button><h3>Facebook</h3>You are currently authorizing access to <a href="">username1</a> on MicroNeeds.</dd>';
				html += '<dt class="twitter"></dt><dd><button class="thin">Revoke Access</button><h3>Twitter</h3>You are currently authorizing access to <a href="">username1</a> on MicroNeeds.</dd>';
			html += '</dl>';
		html += '</section>';

		html += '<section class="notifications">';
			html += '<h3 class="title">Subscription Settings</h3>';
			html += '<ul>';
				html += '<li>';
					html += '<div class="styled-select short">';
						html += '<div class="left"></div>';
						html += '<div class="center"><select><option value="">Web</option></select></div>';
						html += '<div class="right"></div>';
					html += '</div>';
					html += '<label>Delivery</label>This is the method in which you will receive communications from us.';
				html += '</li>';
				html += '<li>';
					html += '<div class="styled-select short">';
						html += '<div class="left"></div>';
						html += '<div class="center"><select><option value="">Web</option></select></div>';
						html += '<div class="right"></div>';
					html += '</div>';
					html += '<label>Frequency</label>This is the method in which you will receive communications from us.';
				html += '</li>';
			html += '</ul>';
		html += '</section>';

		html += '<section class="notifications">';
			html += '<h3 class="title">Notification Settings</h3>';
			html += '<ul>';
				html += '<li class="styled-checkbox"><input type="checkbox" /><label>Groups</label>This is the method in which you will receive communications from us.</li>';
				html += '<li class="styled-checkbox"><input type="checkbox" /><label>Threads</label>This is the method in which you will receive communications from us.</li>';
				html += '<li class="styled-checkbox"><input type="checkbox" /><label>Timeline</label>This is the method in which you will receive communications from us.</li>';
			html += '</ul>';
		html += '</section>';

		html += '<section class="notifications">';
			html += '<h3 class="title">Privacy Settings</h3>';
			html += '<ul>';
				html += '<li class="styled-checkbox"><input type="checkbox" /><label>Search Engines</label>This is the method in which you will receive communications from us.</li>';
			html += '</ul>';
		html += '</section>';
		
		Micro.populateMainContent(html);
	},
	
	getNotificationHtml : function(item)
	{
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