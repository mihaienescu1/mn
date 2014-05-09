Micro.UserEngagement	=	{
		
	_pageName : 'UserEngagement',
		
	Init : function()
	{
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod('users.getUser');
		Client.setData({id : 1});
		Client.setRequestMethod('GET');
		Client.setOkCallBack(this.getUserSuccess, this);
		Client.Run();
	},
		
	Abandon	: function(){
		console.log('abandon ' + this._pageName);
	},
	
	getUserSuccess : function(json){
		this.setNoteBookContent(json);
		this.setSideBarContent(json);
		this.setMainContent(json);
		
		Micro.setNotebookView(true);
	},
		
	setNoteBookContent : function(json){
		var html = '';
		html += '<div class="thumbnail">';
		html += '	<div class="picture"> <a href="" title="View user profile." class="active"><img src="img/default-user.png" alt="" title="View user profile." class="imagecache imagecache-user_profile_photo" width="136" height="136"></a></div>';
		html += '	<h4>Joined ' + json.joined + '</h4>';
		html += '</div>';
		
		html += '<div class="details">';
		html += '	<h2><a href="">' + json.first_name + ' ' + json.last_name + '</a></h2>';
		html += '	<div class="location"><span class="icon"></span>' + json.location + '</div>';
		html += '	<nav id="nav-user">';
		html += '		<h4>' + json.first_name + '\'s Activity</h4>';
		html += '		<ul>';
		html += '			<li class="nav-engagement on"><a>Engagement</a></li>';
		html += '			<li class="nav-timeline"><a href="#timeline" data-rel="#load" data-tagtohide="#user-profile-detail" data-load="user-profile/timeline/4">Timeline</a></li>';
		html += '			<li class="nav-provided"><a href="#userprov" data-rel="#load" data-tagtohide="#user-profile-detail" data-load="user-profile/provided/4">Provided</a></li>';
		html += '			<li class="nav-delivered"><a href="#userdeliv" data-rel="#load" data-tagtohide="#user-profile-detail" data-load="user-profile/delivered/4">Delivered</a></li>';
		html += '			<li class="nav-teams"><a href="#uteams" data-rel="#load" data-tagtohide="#user-profile-detail" data-load="user-profile/teams/4">Teams</a></li>';
		html += '		</ul>';
		html += '	</nav>';
		html += '</div>';
		html += '<a href="" class="icon label message"><span></span>Message ' + json.first_name + '</a> <a href="" class="icon label follow"><span></span>Follow ' + json.first_name + '</a>';
				
		Micro.populateNotebookView( html );
	},
		
	setSideBarContent : function(json){
		var html = '';
		html += '<div class="badge type-2">';
		html += '	<h2>Progress</h2>';
		html += '	<h4>' + json.points + '<span>pts</span></h4>';
		html += '	<h3>' + json.level + '</h3>';
		html += '</div>';
				
		Micro.populateSideBar( html );
	},
		
	setMainContent : function(){
		var html = '';
		html += '<section class="description">';
			html += '<h3 class="title">Credentials Earned</h3>';

			html += '<ul class="credentials">';
				html += '<li><img src="img/credentials/spectator.png" /></li>';
				html += '<li><img src="img/credentials/groupie.png" /></li>';
				html += '<li><img src="img/credentials/zealot.png" /></li>';
				html += '<li><img src="img/credentials/operative.png" /></li>';
				html += '<li><img src="img/credentials/patron.png" /></li>';
				html += '<li><img src="img/credentials/ringleader.png" /></li>';
				html += '<li><img src="img/credentials/wayfarer.png" /></li>';
				html += '<li><img src="img/credentials/transporter.png" /></li>';
				html += '<li><img src="img/credentials/ambassador.png" /></li>';
				html += '<li>Name</li>';
			html += '</ul>';
		html += '</section>';
				
		Micro.populateMainContent( html );
	}
};