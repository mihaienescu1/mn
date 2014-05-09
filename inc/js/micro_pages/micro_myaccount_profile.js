Micro.MyAccountProfile	=	{
		
		_pageName : 'MyAccountProfile',
	
		Init : function()
		{	
			Micro.USER.isLoggedWithSocialAPI('#profile', function(data){
				if(data.id) {
					Micro.MyAccountProfile.uid	=	data.id;
					Micro.MyAccountProfile.postInit();
				}
			});	
		},
		
		postInit	:	function()
		{
			Micro.setNotebookView(false);
			Micro.MyAccountProfile.setMainContent();
			
			var Client =  new AjaxFramework.Client();
				Client.setAjaxMethod('users.getUserById');
				Client.setData({ uid : Micro.MyAccountProfile.uid });
				Client.setOkCallBack(Micro.MyAccountProfile.setUserInfo);
				Client.Run();
				delete Client;
				
			
			$('.radios').click(function(){
				if( !$(this).hasClass('checked') )
				{
					$('.radios').removeClass('checked');
					$(this).addClass('checked');
				}
			});
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
						html += '<li class="nav-profile on"><a href="#profile">Profile</a></li>';
						html += '<li class="nav-messages"><a href="#mymessages">Messages</a></li>';
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

				/* Avatar */
				html += '<section class="avatar">';
					html += '<h3 class="title">My Avatar</h3>';
					html +=	'<div class="box first">';
								html += '<div class="img male"></div>';
								html += '<div class="title">Male</div>';
					html += '</div>';
					html +=	'<div class="box middle">';
								html += '<div class="img female"></div>';
								html += '<div class="title">Female</div>';
					html += '</div>';
					html +=	'<div class="box last">';
								html += '<div class="thumb_wrapper"><div class="thumb"><span>Customize</span></div></div>';
								html += '<button class="default"><a href="#">Upload a Photo</a></button>';
					html += '</div>';
				html += '</section>';
				
				/* Contact Info */
				html += '<section class="contact_info">';
					html += '<h3 class="title">My Contact Info</h3>';
					html += '<div class="contact_line">';
						html += '<div class="icon"></div>';
						html += '<div class="label">Email</div>';
						html += '<div class="value">username@provider.com</div>';
					html += '</div>';
					
					html += '<div style="clear:both; height:2px;"></div>';
					
					html += '<div class="contact_line">';
						html += '<div class="icon"></div>';
						html += '<div class="label">Phone</div>';
						html += '<div class="value">1.808.555.1234</div>';
					html += '</div>';
					
					html += '<div style="clear:both; height:2px;"></div>';
					
					html += '<div class="contact_line">';
						html += '<div class="icon add"></div>';
						html += '<div class="label">Add</div>';
						html += '<div class="value">New Contact</div>';
					html += '</div>';
				html += '</section>';
				
				/* Location */
				html += '<section class="user_location">';
					html += '<h3 class="title">My Location</h3>';
					html += "<div class=\"map edit\">";
						html += "<div class=\"container\" id=\"account_profile_map\"><\/div>";
							html += "<input type=\"text\" id=\"account_profile_address\" class=\"address address_suggestion_input\" value=\"\" default=\"Type in the delivery address. The system will attempt to find a match and display the location...\" \/>";
							html += "<input type=\"hidden\" id=\"acp_geo\" \/>";
							html += "<input type=\"hidden\" id=\"acp_state\" \/>";
							html += "<input type=\"hidden\" id=\"acp_city\" \/>";
						html += "<\/div>";
					html += "<\/div>";
					
					html += '<div class="display_location_options">';
						html += '<span>Display My Location</span> <div style="height:10px; clear:both;"></div>';
							html += '<div class="opt">';
								html+= '<div class="radios" id="level_state"></div>';
								html+= '<div class="label"><label for="level_state">State Level</label></div>';
							html += '</div>';
							html += '<div class="opt">';
								html+= '<div class="radios" id="level_city"></div>';
								html+= '<div class="label"><label for="level_city">City Level</label></div>';
							html += '</div>';
							html += '<div class="opt">';
								html+= '<div class="radios" id="level_street"></div>';
								html+= '<div class="label"><label for="level_street">Street Level</label></div>';
							html += '</div>';
					html += '</div>';
					
				html += '</section>';
			
				/* Timezone */
				html += '<section class="timezone">';
					html += '<h3 class="title">My Timezone</h3>';
					html += "<div class=\"styled-select\">";
						html += "<div class=\"left\"></div>";
							html += "<div class=\"center\">";
							html += "<select id=\"timezone_box\">";
								html += "<option value=\"\">Select your timezone...<\/option>";
								html += "<option value=\"\">PST Los Angeles, CA - 4:20 PM Friday, March 30th 2012<\/option>";
							html += "<\/select>";
						html += "<\/div>";
							html += "<div class=\"right\">";
						html += "<\/div>";
					html += "<\/div>";	
				html += '</section>';
			
				Micro.populateMainContent(html);
		}
};