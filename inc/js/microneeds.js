Micro = {
	_sectionPrefix 				: 'Micro_',
	_currentUser 				: false,
	_coverMapControl 			: false,
	_overlayOn 					: false,
	_session 					: false,
	_userMenu 					: false,
	_currentCatFilter 			: "000",
	_clientLastSearchPlace		:	false,
	_clientLastSearchPlaceStr	:	{ clientString  : false, geoAddrString : false },
	_overlayCloseAction 		: false,
	_store 						: function (store) {
		Micro["sess"] = store;
	},
	_getSessionData 			: function () {
		return Micro.sess;
	},
	_currentPage 				: { name : 'AppHome' },
	_get 						: {},
	_pages : {
			'home' : { 
					name 	: 'AppHome', 
					file 	: 'micro_app_home.js',
					label	: 'Home'
			},
			'aneed' : { 
					name 	: 'AddaNeed', 
					file 	: 'micro_add_a_need.js',
					label 	: 'Add a Need'
			},
			'aneed_preview' : { 
			
					name 	: 'AddaNeed_Preview', 
					file 	: 'micro_add_a_need_preview.js',
					label 	: 'Review new need'
			},
			'aneed_admin' :  { 
			
					name 	: 'AddaNeed_Admin', 
					file 	: 'micro_add_a_need_admin.js',
					label	: 'Need details'
			},
			'user_engagement' : { 
			
					name 	: 'UserEngagement', 
					file 	: 'micro_user_engagement.js',
					label 	: 'n/a'
			},
			'userprov' : { 
					name 	: 'UserProvided', 
					file 	: 'micro_user_provided.js',
					label 	: 'n/a'
			},
			'userdeliv' : { 
					name : 'UserDelivered', 
					file : 'micro_user_delivered.js',
					label 	: 'n/a'
			},
			'uteams' : { 
					name : 'UserTeams', 
					file : 'micro_user_teams.js',
					label 	: 'n/a'
			},
			'timeline' : { 
					name : 'UserTimeline', 
					file : 'micro_user_timeline.js',
					label 	: 'n/a'
			},
			'myfriends' : { 
					name : 'MyAccountFriends', 
					file : 'micro_myaccount_friends.js',
					label 	: 'n/a'
			},
			'myactivity': { 
					name : 'MyActivity', 
					file : 'micro_myactivity.js',
					label 	: 'My Activity'
			},
			'notifications' : { 
					name : 'MyAccountNotifications' , 
					file : 'micro_myaccount_notifications.js',
					label 	: 'n/a'
			},
			'mymessages' : { 
					name : 'MyAccountMessages', 
					file : 'micro_myaccount_messages.js',
					label 	: 'My Account'+C.SUB_SECTION_SEPARATOR+'Messages'
			},
			'settings' : { 
					name : 'MyAccountSettings', 
					file : 'micro_myaccount_settings.js',
					label 	: 'My Account'+C.SUB_SECTION_SEPARATOR+'Settings'
			},
			'need_details' : { 
					name : 'NeedDetails', 
					file : 'micro_need_details.js',
					label 	: 'n/a'
			},
			'need_thread' : { 
					name : 'NeedThread', 
					file : 'micro_need_thread.js',
					label 	: 'n/a'
			},
			'need_provision' : { 
					name : 'NeedProvision', 
					file : 'micro_need_provision.js',
					label 	: 'n/a'
			},
			'need_delivery' : { 
					name : 'NeedDelivery', 
					file : 'micro_need_delivery.js',
					label 	: 'n/a'
			},
			'need_team' : { 
					name : 'NeedTeam', 
					file : 'micro_need_team.js',
					label 	: 'n/a'
			},
			'need_report' : { 
					name : 'NeedReport', 
					file : 'micro_need_report.js',
					label 	: 'n/a'
			},
			'profile' : { 
					name : 'MyAccountProfile', 
					file : 'micro_myaccount_profile.js',
					label 	: 'n/a'
			}
	},
	_map		:	{
		activateMapSearch 	: false,
		currentPlace 		: false,
		mapOptions  		: false,
		userCoords	 		: false,
		userMarker			: false,	
		mapRef 				: false,
		latLngList	 		: [],
		markers	 			: [],
		defaultZoom 		: 10,
		searchBox			: false,
		selectPlaceEvent	: false
	},
	
	Init : function () {
		Micro.HandleFacebook();
		Micro.postInit();
	},
	postInit : function () {
	
		Micro.setHeaderLoggedOutState();
		Micro.handleGetNeedTypes();
		
		$('#nav-logged .user_menu .icon').bind('click', Micro.HandleUserMenu);
		$('select#changePage').change(Micro.HandleTestSelector);
		$(window).load(function (e) {
			Micro.LoadPage(location.hash);
		});
		
		$('#search-activate').bind('click', function () {
			if (!Micro._searchActivate) {
				Micro.initGlobalMapArea();
			} else {
				Micro.disposeGlobalMapArea();
			}
		});
		$('#search-close').bind('click', function () {
			Micro.disposeGlobalMapArea();
		});
		$('.closeMapOverlay').live('click', function () {
			Micro.hideMapOverlay();
		});
		$('.map_overlay').delegate('#search-keywords', 'keyup', function () {
			Micro.filterNeeds($(this).val());
		});
		$('#need_filters_box').change(function () {
			var cat_id = $(this).find("option:selected").attr('id');
			
			Micro._currentCatFilter = cat_id;
			var Client = new AjaxFramework.Client();
			var currentBounds = Micro._map.mapRef.getBounds();
			
			Client.setAjaxMethod(A.NEEDS.GET_NEEDS_IN_MAP_VIEWPORT);
			Client.setData({
				
				west  : currentBounds.getWest(),
				east  : currentBounds.getEast(),
				north : currentBounds.getNorth(),
				south : currentBounds.getSouth(),
				cat   : Micro._currentCatFilter
			});
			Client.setOkCallBack(Micro.handleNearbyNeedsResult);
			Client.Run();
			delete Client;
		});
		$('#my_logout').bind('click', Micro.HandleFbUserLogOut);
		$('#fb_connect').bind('click', Micro.HandleFbLoginButton);
		$('#nav-addneed').bind('click', function () {
			FB.getLoginStatus(function (response) {
				if (response.status === "connected") {
					Micro._breadCrumb = {
						page : '#home',
						text : 'Home'
					};
					Micro.LoadPage('#aneed');
				} else
					Micro.ShowFBLoginScreen('#aneed');
			}, true);
		});
		$('#myActivityView').bind('click', Micro.handleMyActivityViewOpen);
		$('.section-breadcrumbs .right-side .close').bind('mousedown', Micro.handleMainClosePageButtonMouseDown).bind('mouseup', Micro.handleMainClosePageButtonMouseUp);
		FB.Event.subscribe('edge.create', Micro.captureFacebookLike);
		FB.Event.subscribe('edge.remove', Micro.captureFacebookUnLike);
		
		Micro.initMap_BING();
		Micro.initMapGlobalSearchBox_GOOGLE();
	},
	
	handleNearbyNeedsResult	:	function(data) {

		if("OK" == data.status) {
			Micro.handleViewPortNeedsDisplay(data);
		}
		
	},
	
	initMap_BING	:	function() {
	
		Micro._map.userCoords = new Microsoft.Maps.Location(user_location.latitude, user_location.longitude);
		
		Micro._map.mapRef 	  = new Microsoft.Maps.Map(document.getElementById('gmap_global'), {
										credentials 		: C.MICROSOFT_MAPS_KEY,
										zoom 				: Micro._map.defaultZoom,
										center 				: Micro._map.userCoords,
										labelOverlay 		: Microsoft.Maps.LabelOverlay.hidden,
										enableSearchLogo 	: false,
										enableClickableLogo : false,
										showMapTypeSelector	: false,
										showBreadcrumb 		: false,
										width 				: 976,
										height 				: 250
								});
		Micro._map.userMarker = new Microsoft.Maps.Pushpin(Micro._map.userCoords, {
										icon 	: C.USER_LOCATION_MAP_PIN,
										width  	: 30,
										height 	: 50
								});
		Micro._map.mapRef.entities.push(Micro._map.userMarker);
		
		var searchString = user_location.latitude + ',' + user_location.longitude;
		
		Micro.geo.getAddressArrayByAddressString(searchString, function(r) {

				Micro._clientLastSearchPlace	=	Micro._map.userCoords;
				Micro._clientLastSearchPlaceStr.geoAddrString 	= 	r.locality + ', ' + r.administrative_area_level_1;
				Micro._clientLastSearchPlaceStr.clientString  	= 	r.locality + ', ' + r.administrative_area_level_1;
				
		});
		
		Microsoft.Maps.Events.addHandler(Micro._map.mapRef, 'viewchangestart', Micro.handleMapViewChangeStart);
		Microsoft.Maps.Events.addHandler(Micro._map.mapRef, 'viewchangeend', Micro.handleMapViewChangeEnd);
		
		
		Micro._map.currentPlace = new Microsoft.Maps.Location(user_location.latitude, user_location.longitude);
	},
	
	initMapGlobalSearchBox_GOOGLE 	:	function() {
		
		var searchBoxOpts = {
			types : ['geocode'],
			componentRestrictions : { country : 'us' }
		};
		
		Micro._map.searchBox		=	new google.maps.places.Autocomplete(document.getElementById('search-address'), searchBoxOpts);
		Micro._map.selectPlaceEvent	=	google.maps.event.addListener(Micro._map.searchBox, C.GOOGLE_API_SEARCHBOX_PLACE_CHANGED_EVENT_NAME, Micro.handlePleaceSelection);
	},
	
	initGlobalMapArea	:	function() {
		Micro._searchActivate = true;
		$('#search-activate').addClass('on');
		$('#section-search').show();
		$('#section-map-panel').show();
	},
	
	disposeGlobalMapArea	:	function() {
		Micro._searchActivate = false;
		$('#search-activate').removeClass('on');
		$('#section-search').hide();
		$('#section-map-panel').hide();
	},
	
	handleMapViewChangeEnd	:	function() {
	
		if(Micro._currentPage.name != 'AppHome') {
			return;
		}
		
		var currentBounds = Micro._map.mapRef.getBounds();
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NEEDS.GET_NEEDS_IN_MAP_VIEWPORT);
			Client.setData({
				west  : currentBounds.getWest(),
				east  : currentBounds.getEast(),
				north : currentBounds.getNorth(),
				south : currentBounds.getSouth(),
				cat   : Micro._currentCatFilter
			});
			Client.setOkCallBack(Micro.handleViewPortNeedsDisplay);
			Client.Run();
			delete Client;
	},
	
	handlePleaceSelection	:	function() {
		var oPlace = new Microsoft.Maps.Location(
					Micro._map.searchBox.getPlace().geometry.location.lat(), 
					Micro._map.searchBox.getPlace().geometry.location.lng()					
		);
		
		Micro._map.currentPlace = oPlace;
		
		console.log('handlePleaceSelection');
		
		Micro._clientLastSearchPlace 					= 	oPlace;
		Micro._clientLastSearchPlaceStr.clientString  	= 	$('#search-address').val();
		Micro._clientLastSearchPlaceStr.geoAddrString 	= 	Micro._map.searchBox.getPlace().formatted_address;
		
		/* Calling function that sets View Including the Map Center */
		Micro.handleSetMapCenter(oPlace);
	},
	
	handleSetMapCenter	:	function(placeObject, needPin, needId, reload) {
		
		var placeObject = placeObject || false;
		var needPin		= needPin || false;
		var needId		= needId || false;
		var reload		= reload || false;
		
		if(!placeObject) {
			return false;
		}
		
		Micro._map.mapRef.entities.clear();
		
		Micro._map.userMarker = new Microsoft.Maps.Pushpin(placeObject, {
				icon : 'https://chart.googleapis.com/chart?chst=d_map_pin_icon_withshadow&chld=star|666666',
				width : 30,
				height : 50
		});
		
		var newCenter	=	{
			zoom 	: 	Micro._map.defaultZoom,
			center  : 	placeObject
		};
		
		Micro._map.mapRef.setView(newCenter);
		
		Micro._map.mapRef.entities.push(Micro._map.userMarker);
		if(needPin) {
			var needPushPinOptions = null;
			if(needId) {
				var needPushPinOptions = { id : needId };
			}
			
			var needPushPin		 = new Microsoft.Maps.Pushpin(placeObject, needPushPinOptions);
			var needPushPinClick = Microsoft.Maps.Events.addHandler(needPushPin, 'click', function(m) {
				Micro.LoadPage( '#aneed_admin?n=' + m.target.getId() );
			});  
			Micro._map.mapRef.entities.push(needPushPin);
		}
		
	},
	
	addSearchPlace	:	function ( placeObject, reload ) {
		/*
		var rMap = reload || false;
		Micro._map.mapRef.setView({
			center : placeObject
		});
		Micro._map.mapRef.userLocationMarker = new Microsoft.Maps.Pushpin(placeObject, {
				icon : 'https://chart.googleapis.com/chart?chst=d_map_pin_icon_withshadow&chld=star|666666',
				width : 30,
				height : 50
		});
		
		Micro._map.mapRef.entities.push(new Microsoft.Maps.Pushpin(placeObject, {
					draggable : false,
					icon : 'https://chart.googleapis.com/chart?chst=d_map_pin_icon_withshadow&chld=star|666666'
		}));
		
		if(rMap) Micro.handleMapViewChangeEnd();
		*/
	},
	
	populateMapWithBoundsNeeds : function (result) {
		
		Micro._map.mapRef.entities.clear();
		var limit = result.needs.length;
		var bounds = Micro._map.mapRef.getBounds();
		var pins = new Microsoft.Maps.EntityCollection();
		pins.push(Micro._map.userMarker);
		for (var i = 0; i < limit; i++) {
			var position = 	new Microsoft.Maps.Location(result.needs[i].latitude, result.needs[i].longitude);
			var need_id	 =	result.needs[i].id;
			var pin = new Microsoft.Maps.Pushpin(position, {
				id	:	need_id
			});
			pins.push(pin);
			Microsoft.Maps.Events.addHandler(pin, 'click', Micro.handlePinClick);
		}
		Micro._map.mapRef.entities.push(pins);
		Microsoft.Maps.Events.addHandler(Micro._map.userMarker, 'click', function () {
			Micro.ShowMapKeywordFilter();
		});
	},
	
	handleViewPortNeedsDisplay	:	function(d) {
		if("OK" == d.status) {
			Micro.populateNeedFeedList(d);
			Micro.populateMapWithBoundsNeeds(d);
		}
	},
	
	populateNeedFeedList : function (needs_data) {
		/*
		if ("AppHome" === Micro._currentPage.name) {
			var nearby_needs_number = needs_data.needs.length;
			var strText = '';
			if (nearby_needs_number == 0) {
				strText = 'No Nearby Needs';
			} else if (nearby_needs_number == 1) {
				strText = nearby_needs_number + ' Nearby Need';
			} else {
				strText = nearby_needs_number + ' Nearby Needs';
			}
			$('.section-breadcrumbs').html(strText);
		}
		Micro.populateMainContent(needs_data.markup);
		*/
		Micro.populateMainContent(needs_data.markup);
	},
	
	handlePinClick	:	function(m)
	{
		Micro.LoadPage( '#aneed_admin?n=' + m.target.getId() );
	},
	
	handleMainClosePageButtonMouseDown	:	function() {
		$(this).addClass('down');
	},
	
	handleMainClosePageButtonMouseUp 	:	function() {
		$(this).removeClass('down');
	},

	handleProvisionNomination	:	function() {
		var page_id		=	Micro._currentPage;
		var user_id		=	Micro._currentUser;
		var need_id		=	$(this).attr('id');
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NEEDS.NOMINATE_NEED_PROVIDER);
			Client.setData({
					page	:	page_id,
					user	:	user_id,
					need	:	need_id
			});
			Client.setOkCallBack(Micro.nominateNeedProviderOK);
			Client.Run();
		delete Client;
	},
	
	handleDeliveryNomination	:	function() {
	
		var page_id		=	Micro._currentPage;
		var user_id		=	Micro._currentUser;
		var need_id		=	$(this).attr('id');
		var	pv_id		=	$(this).attr('provision_id');
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NEEDS.NOMINATE_NEED_DELIVERER);
			Client.setData({
					page		:	page_id,
					user		:	user_id,
					need		:	need_id,
					provision	:	pv_id
			});
			Client.setOkCallBack(Micro.nominateNeedDelivererOK);
			Client.Run();
		delete Client;
	},
	
	nominateNeedDelivererOK	:	function(data)
	{
		Micro.handleNeedUpdate(data);
	},
	
	nominateNeedProviderOK	:	function(data)
	{
		Micro.handleNeedUpdate(data);	
	},
	
	handleMyActivityViewOpen	:	function()
	{
		Micro.LoadPage("#myactivity");
	},
	
	captureFacebookLike : function (href, widget) {

		var url = href;
		var user = Micro._currentUser;
		var need_id = parseInt( href.charAt( href.length-1 ) );
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.ADD);
		Client.setData({
			need_id : need_id,
			user_id : user,
			meta : url,
			activity_type : 'SOCIAL_LIKE',
			content : ''
		});
		Client.setOkCallBack(Micro.handleNeedUpdate);
		Client.Run();
		delete Client;
	},
	
	captureFacebookUnLike : function (href, widget) {
		
		var url = href;
		var user = Micro._currentUser;
		var need_id = parseInt( href.charAt( href.length-1 ) );
		var action = 'remove';
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.DELETE_ACTIVITY);
		Client.setData({
			need_id : need_id,
			uid : user,
			meta : url
		});
		Client.setOkCallBack(Micro.handleNeedUpdate);
		Client.Run();
		delete Client;
	},
	
	handleNeedUpdate : function (data) {
	
		if (data.need_id) {
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NEEDS.UPDATE_STATUS_ACTIONS);
			Client.setData({
				need_id : data.need_id
			});
			Client.setOkCallBack(Micro.handleNeedUpdateResponseOK);
			Client.Run();
			delete Client;
		}
		
		if ("POST_ADDED_OK" === data.status && "NeedThread" === Micro._currentPage) {
			var Client = new AjaxFramework.Client();
				Client.setAjaxMethod(A.ACTIVITIES.GET_BY_NEED);
				Client.setResponseGlue('JSON');
				Client.setData({
					need_id : Micro.NeedThread._currentNeed,
					user_id : Micro._currentUser,
					limit : 0,
					offset : 1
				});
				Client.setOkCallBack(Micro.NeedThread.handleAddPostResponseOK);
				Client.Run();
				delete Client;
		}
	},
	handleNeedUpdateResponseOK : function (data) {
		/* To complete */
		
		if ("OK" === data.status) {
			var nid = data.need.id;
			var statuses = data.need.status_actions;
			var checks            =    $('.need_status_graph[id=' + nid + '] .check');
			var checkLiked         =     $('.need_status_graph[id=' + nid + '] .check.liked');
			var checkShared     =     $('.need_status_graph[id=' + nid + '] .check.shared');
			var checkProvided     =     $('.need_status_graph[id=' + nid + '] .check.provided');
			var checkDelivered     =     $('.need_status_graph[id=' + nid + '] .check.delivered');
			if (statuses.in_array("liked")) {
				checkLiked.addClass('on');
			} else {
				checkLiked.removeClass('on');
			}
			if (statuses.in_array("shared")) {
				checkShared.addClass('on');
			} else {
				checkShared.removeClass('on');
			}

			switch( data.need.lsa ) {
				case 'liked':
					checkLiked.addClass('lastaction');
				break;
			   
				case 'shared':
					checkShared.addClass('lastaction');
				break;
				
				default:
					checks.removeClass('lastaction');
				break;
			}
		}

	},
	handleLikeActivityStoreOK : function (data) {
		console.log(data);
	},
	handleUnLikeActivityStoreOK : function (data) {
		console.log(data);
	},
	handleGetNeedTypes : function () {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NEEDS.GET_NEED_TYPES);
		Client.setData({});
		Client.setOkCallBack(Micro.handleGetNeedTypesOK);
		Client.Run();
		delete Client;
	},
	
	handleGetNeedTypesOK	:	function (t) 
	{
		$('#need_filters_box').empty().html("");
		$('#need_filters_box').append('<option value="" id="000">All Categories...</option>');
		$.each(t, function (idx, ty) {
			var value = ty.title.replace(" ", "").toLowerCase();
			var type_id = ty.id;
			var title = ty.title;
			$('#need_filters_box').append('<option value="' + value + '" id="' + type_id + '">' + title + '</option>');
		});
	},
	
	LoadPage : function (hash) {
		
		Micro.hn	=	'home';
		Micro.hash	=	hash;
		if(hash)
		{
			var hashName 	= 	hash.replace('#', '');
			var hashParts 	= 	hash.split("?");
			Micro.hn 		= 	hashParts[0].replace('#', '');
		}
		
		/*
		if(Micro._currentPage) {
			Preloader.showBlockPageOverlay();
		}*/
		
		var oScript=document.createElement('script');
			oScript.setAttribute("type", "text/javascript");
			oScript.setAttribute("src", url+"inc/js/micro_pages/"+Micro._pages[ Micro.hn ].file);
			oScript.setAttribute("id",	'scr-'+Micro._pages[ Micro.hn ].name);
			oScript.async	=	true;
			oScript.onload	=	Micro.handlePageLoadAfterScript;
		document.getElementsByTagName("head")[0].appendChild(oScript);
	},
	
	handlePageLoadAfterScript	:	function(s)
	{
		if(Micro._currentPage)
		{
            Micro._lastPage = Micro._currentPage;
			Micro[ Micro._currentPage.name ].Abandon();
			$('#scr-'+Micro._currentPage.name).remove();
		}
		
		window.location.hash = Micro.hash;
		Micro._currentPage = Micro._pages[ Micro.hn ];
		Micro._currentPage.rawName = Micro.hn;
		Micro.BreadCrumbs.setPage( Micro._currentPage );
		Micro[ Micro._pages[ Micro.hn ].name ].Init();
		Micro.clearText();
		$('.sidebar').removeClass('profile');
		if (Micro._searchActivate) Micro.initGlobalMapArea();
		
		/*
		setTimeout(Preloader.hideBlockPageOverlay, 2000);
		*/
	},
	
	setNotebookView : function (state) {
		if (state) {
			$('#section-content-top').show();
			$('#content').attr('class', 'content_notebook');
		} else {
			$('#section-content-top').hide();
			$('#content').attr('class', 'content_normal');
		}
	},
	populateNotebookView : function (html) {
		$('#section-content-top').html(html);
	},
	populateMainContent : function (html) {
		$('#section-content-main').html(html);
		FB.XFBML.parse(document.getElementById('section-content-main'));
		Micro.clearText();
	},
	appendToMainContent : function (html) {
		$('#section-content-main').append(html);
	},
	populateSideBar : function (html) {
		$('#section-content-sidebar').html(html);
	},
	populateSearchArea : function (html) {
		$('#section-search').html(html);
	},
	populateLoginPanel : function (html) {
		$('#section-login-panel').html(html);
	},
	populateFooterArea : function (html) {
		$('#section-footer').html(html);
	},
	populateGreyBar : function (html) {
		$('#handle').html(html);
	},
	clearPageAreas : function () {
		$('#section-content-main').empty().html("");
		$('#section-content-sidebar').empty().html("");
	},
	showOverlay : function (title, location, html, actionOnClose) {
		if (title)
			$('#overlay-title').html(title);
		if (location)
			$('#overlay-location').html(location);
		if (html)
			$('#overlay-content').html(html);
		this._overlayOn = true;
		this.positionOverlay();
		$("#section-overlay").show();
		if (!actionOnClose) {
			$('.hideOverlay').bind('click', function () {
				Micro.hideOverlay();
			});
		} else {
			$('.hideOverlay').bind('click', function () {
				actionOnClose();
			});
		}
	},
	hideOverlay : function () {
		var modal = $("#section-overlay");
		var tp = -1500;
		var lf = -1500;
		modal.css({
			'top' : tp,
			'left' : lf
		});
		modal.show();
		this._overlayOn = false;
	},
	showMapOverlay : function (content) {
		$('.map_overlay .inner').html(content);
		$('.map_overlay').show();
	},
	hideMapOverlay : function () {
		$('.map_overlay .inner').empty().html("");
		$('.map_overlay').hide();
	},
	positionOverlay : function () {
		var tp = 0;
		var lf = 0;
		if (Micro._overlayOn) {
			var modal = $("#section-overlay");
			tp = ($(window).height() / 2) - (modal.outerHeight() / 2) + $(window).scrollTop();
			lf = ($(window).width() / 2) - (modal.outerWidth() / 2) + $(window).scrollLeft();
			modal.css({
				'top' : tp,
				'left' : lf
			});
		}
	},
	handleResize : function () {
		Micro.positionOverlay();
	},
	handleScroll : function () {
		Micro.positionOverlay();
	},
	setHeaderLoggedInState : function () {
		$('#nav-main, #nav-logged').hide();
		$('#nav-main').hide();
		$('#nav-logged').show();
		$('#nav-addneed').show();
	},
	setHeaderLoggedOutState : function () {
		$('#nav-main, #nav-logged').hide();
		$('#nav-main').show();
		$('#nav-logged').hide();
		$('#nav-addneed').show();
	},
	testUserMenu : function () {
		if (!Micro._loggedIn) {
			$('#nav-main').show();
			$('#nav-logged').hide();
			Micro._loggedIn = true;
		} else {
			$('#nav-main').hide();
			$('#nav-logged').show();
			Micro._loggedIn = false;
		}
	},
	clearText : function () {
		$.each($('input, textarea'), function (i, v) {
			var a = $(this).attr('default');
			if (typeof a !== 'undefined' && a !== false) {
				$(this).val($(this).attr("default"));
				$(this).focus(function () {
					if ($(this).attr("default") === $(this).val()) {
						$(this).val("");
					}
				}).blur(function () {
					if (!$(this).val()) {
						$(this).val($(this).attr("default"));
					}
				});
			}
		});
	},
	voidAction : function () {
		console.log('No references');
		return;
	},
	geo : {
		getAddressArrayByAddressString : function (strAddress, callBack) {
			var GeoClient = new AjaxFramework.Client();
			GeoClient.setAjaxMethod(A.GEO.REVERSE_GEOCODE_BY_STR);
			GeoClient.setData({
				address : strAddress
			});
			GeoClient.setResponseGlue("JSON");
			GeoClient.setOkCallBack(function (Geo) {
				if ("OK" === Geo.status) {
					var o = {};
					$.each(Geo.results[0].address_components, function (i, v) {
						o[v.types[0]] = v.long_name;
					});
					callBack(o);
				}
			});
			GeoClient.Run();
			delete GeoClient;
		}
	},
	url : {
		get : function () {
			var url = document.location.href;
			var getVars = url.split('?');
			if (getVars[1]) {
				var vars = getVars[1].split("=");
				oGet = {};
				oGet[vars[0]] = vars[1];
				return oGet;
			} else {
				return false;
			}
		}
	},
	HandleFacebook : function (event, args) {
		FB.init({
			appId : C.FACEBOOK_APP_ID,
			channelUrl : '//qa.microneeds.com/channel.html',
			status : true,
			cookie : true,
			xfbml : true
		});
		FB.getLoginStatus(function (response) {
			switch (response.status) {
			case 'connected':
				Micro.HandleAppWhenFBConnected();
				break;
			case 'not_authorized':
				break;
			default:
				break;
			}
		}, true);
	},
	HandleAppWhenFBConnected : function () {
		Micro.setHeaderLoggedInState();
		Micro.handleLoggedFacebookUser();
	},
	ShowFBLoginScreen : function (go) {
		go = go || false;
		FB.login(function (response) {
			if ("connected" === response.status) {
				Micro.setHeaderLoggedInState();
				Micro.handleLoggedFacebookUser();
				if (go) {
					Micro.LoadPage(go);
				}
			}
		}, {
			scope : 'email,user_likes'
		});
	},
	HandleFbLoginButton : function () {
		Micro.ShowFBLoginScreen();
	},
	HandleFbUserLogOut : function () {
		FB.logout(function (response) {
			if ("unknown" === response.status || null === response.authResponse)
				Micro.setHeaderLoggedOutState();
		});
	},
	handleLoggedFacebookUser : function () {
		FB.api('/me', function (response) {
			send = response;
			send.photo = "https://graph.facebook.com/" + response.id + "/picture";
			send = JSON.stringify(send);
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.USERS.ADD_BY_FACEBOOK);
			Client.setData({
				userdata : send
			});
			Client.setOkCallBack(Micro.handleUserInfoOnDb);
			Client.Run();
			delete Client;
		});
	},
	handleUserInfoOnDb : function (data) {
		if (data.status === "OK") {
			if (data.uinfo) {
				if (data.uinfo.photo) {
					$('#my_photo_menu').html('<img src="' + data.uinfo.photo + '?width=37&height=35">');
				}
				$('#my_name').html(data.uinfo.firstname + ' ' + data.uinfo.lastname);
				Micro._currentUser = data.uinfo.id;
			}
		}
	},
	HandleUserMenu : function () {
		$('#my_menu').find('a').bind('click', function () {
			$('#my_menu').slideUp();
			$('#nav-logged .user_menu .icon').removeClass('active');
			$('body').unbind('click').off('click');
		});
		if (!Micro._userMenu) {
			$('#my_menu').slideDown();
			$(this).addClass('active');
			Micro._userMenu = true;
			$('body').bind('click', function (e) {
				var inside = $('#my_menu').find($(e.target));
				var isButton = $(e.target).hasClass('ib');
				if (inside.length == 0 && !isButton) {
					$('#my_menu').slideUp();
					$('#nav-logged .user_menu .icon').removeClass('active');
					$('body').unbind('click').off('click');
					delete inside;
					delete isButton;
					Micro._userMenu = false;
				}
			});
		} else {
			$('#my_menu').slideUp();
			$(this).removeClass('active');
			Micro._userMenu = false;
		}
	},
	HandleTestSelector : function () {
		if ($(this).val() == "#homeanon") {
			top.location.href = "home.php";
			return;
		}
		if ($(this).val() == "#------") {
			top.location.href = "index.php";
			return;
		}
		if ($(this).val().indexOf("#overlay") != -1) {
			switch ($(this).val()) {
			case '#overlay_like_join':
				Micro.Overlays.like_join_Init();
				break;
			case '#overlay_share':
				Micro.Overlays.share_Init();
				break;
			case '#overlay_message_user':
				Micro.Overlays.message_user_Init();
				break;
			case '#overlay_share_confirm':
				Micro.Overlays.share_confirm_Init();
				break;
			case '#overlay_share_upsell':
				Micro.Overlays.share_upsell_Init();
				break;
			case '#overlay_provide':
				Micro.Overlays.provide_Init();
				break;
			case '#overlay_provide_thanks':
				Micro.Overlays.provide_thanks_Init();
				break;
			case '#overlay_deliver_confirm':
				Micro.Overlays.deliver_confirm_Init();
				break;
			case '#overlay_deliver_upsell':
				Micro.Overlays.deliver_upsell_Init();
				break;
			case '#overlay_deliver_address':
				Micro.Overlays.deliver_address_Init();
				break;
			case '#overlay_deliver':
				Micro.Overlays.deliver_Init();
				break;
			case '#overlay_document_uploading':
				Micro.Overlays.document_uploading_Init();
				break;
			}
			return;
		}
		window.location.hash = $(this).val();
	},

    aNeedClosePageHandler : function() {

        if(Micro._lastPage) {
            Micro.AddaNeed.Abandon();
            Micro.LoadPage(Micro._lastPage.rawName);
        }
    },
	
	mapActivateSearch : function () {
		
		Micro._searchActivate = true;
		$(this).addClass('on');
		$('#section-search').slideDown();
		$('#section-map-panel').show();
		google.maps.event.trigger(Micro._map, 'resize');
	},
	
	mapDeactivateSearch : function () {
		Micro._searchActivate = false;
		$(this).removeClass('on');
		$('#section-search').slideUp();
		$('#section-map-panel').slideUp();
	},
	
	SESSION : {
		add : function (xKey, xVal) {
			var sessions = new AjaxFramework.Client();
			sessions.setAjaxMethod(A.SESSIONS.ADD);
			sessions.setData({
				key : xKey,
				val : xVal
			});
			sessions.setResponseGlue("JSON");
			sessions.setOkCallBack(function (data) {
				console.log(data);
			});
			sessions.Run();
			delete sessions;
		},
		get : function (xKey, callBack) {
			var sessions = new AjaxFramework.Client();
			sessions.setAjaxMethod(A.SESSIONS.GET);
			sessions.setData({
				key : xKey
			});
			sessions.setResponseGlue("JSON");
			sessions.setOkCallBack(function (d) {
				console.log(d);
			});
			sessions.Run();
			delete sessions;
		}
	},
	USER : {
		isLoggedWithSocialAPI : function (go_to, callBack) {
			FB.getLoginStatus(function (response) {
				if ('connected' === response.status) {
					FB.api('/me', function (me) {
						var Client = new AjaxFramework.Client();
						Client.setAjaxMethod(A.USERS.GET_BY_EMAIL);
						Client.setData({
							email : me.email
						});
						Client.setOkCallBack(callBack);
						Client.Run();
						delete Client;
					});
				} else {
					Micro.ShowFBLoginScreen(go_to);
				}
			}, true);
		},
		getLoggedUserWithFacebook : function (callBack) {
			FB.api('/me', function (me) {
				var Client = new AjaxFramework.Client();
				Client.setAjaxMethod(A.USERS.GET_BY_EMAIL);
				Client.setData({
					email : me.email
				});
				Client.setOkCallBack(callBack);
				Client.Run();
				delete Client;
			});
		}
	},
	BreadCrumbs	: {
			navSessions : [],
			cP			:	false,
			setPage : function (oPage) {
				Micro.BreadCrumbs.cP = oPage;
			},
			
			generate : function () {
			
				var strLink 		= 	'Home';
				var strSearch		=	'';
				var arrow_tpl		=	C.BREADCRUMB_TPL;
				var titleAttr		=	'';
				
				if( false !== Micro._clientLastSearchPlace ) {
				
					var strAddressStrip = Micro._clientLastSearchPlaceStr.clientString;
					
					if(strAddressStrip.length > C.MAX_BREADCRUB_STRIP) {
						strAddressStrip = strAddressStrip.substr(0 ,C.MAX_BREADCRUB_STRIP)+C.ELIPS_BREADCRUMB_CHARS;
					}
				
					titleAttr = "Search "+ Micro._clientLastSearchPlaceStr.clientString  + "\n";
					titleAttr+= "Found  "+ Micro._clientLastSearchPlaceStr.geoAddrString + "\n";
					titleAttr+= "Latitude "+ Micro._clientLastSearchPlace.latitude.toFixed(4) + "\n";
					titleAttr+= "Longitude"+ Micro._clientLastSearchPlace.longitude.toFixed(4);
					
					strSearch = '<a href="javascript:Micro.LoadPage(\'#home\');" class="bc_active" title="'+titleAttr+'">';
					strSearch+= strAddressStrip;
					strSearch+= '</a>';
					strSearch+= arrow_tpl;
				}
				
				switch(Micro._currentPage.rawName) {

					case 'home' : 
						strLink = 'Home';
					break;
					
					case 'aneed' : 
						strLink = 'Add a Need';
					break;
					
					case 'aneed_preview' : 
						strLink = 'Add a Need'+arrow_tpl+'Review new need';
					break;

                    case 'aneed_admin' :
                        strLink = '<a href="javascript:Micro.LoadPage(\'#home\');" class="bc_active">Home</a>'+arrow_tpl+strSearch+'<span class="brct"></span>';
                    break;

					default : 
						strLink = '<a href="javascript:Micro.LoadPage(\'#home\');" class="bc_active">Home</a>'+arrow_tpl+strSearch+Micro._currentPage.label;
					break;
				}
				
				if ('home' == Micro._currentPage.rawName) {
					if( 'object' === typeof(Micro._clientLastSearchPlace) ) {
						Micro.populateMainContent("");
						Micro.handleSetMapCenter(Micro._clientLastSearchPlace, true, false);
						Micro.handleMapViewChangeEnd();
					}
				}
				return  strLink;
			}
	}
};
window.onresize = Micro.handleResize;
window.onscroll = Micro.handleScroll;
Micro.Utils = {};
Micro.Utils.ucFirst = function (str) {
	str += '';
	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1);
};
Micro.Utils.strMonth = function (m) {
	var a = new Array();
	a[0] = "January";
	a[1] = "February";
	a[2] = "March";
	a[3] = "April";
	a[4] = "May";
	a[5] = "June";
	a[6] = "July";
	a[7] = "August";
	a[8] = "September";
	a[9] = "October";
	a[10] = "November";
	a[11] = "December";
	return a[m];
};
Array.prototype.in_array = function (p_val) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (this[i] == p_val) {
			return true;
		}
	}
	return false;
};
Microsoft.Maps.Location.prototype.distanceRadius = function (newLatLng) {
	var lat1 = this.latitude;
	var radianLat1 = lat1 * (Math.PI / 180);
	var lng1 = this.longitude;
	var radianLng1 = lng1 * (Math.PI / 180);
	var lat2 = newLatLng.latitude;
	var radianLat2 = lat2 * (Math.PI / 180);
	var lng2 = newLatLng.longitude;
	var radianLng2 = lng2 * (Math.PI / 180);
	var earth_radius = 3959;
	var diffLat = (radianLat1 - radianLat2);
	var diffLng = (radianLng1 - radianLng2);
	var sinLat = Math.sin(diffLat / 2);
	var sinLng = Math.sin(diffLng / 2);
	var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
	var distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
	return distance;
};

/* 

	The name of the need should show in the breadcrumbs if queryed. 
	Los Angeles, CA
*/