Micro.AddaNeed_Preview = {
	_pageName : 'AddaNeed_Preview',
	_interimMap : null,
	_selPIN : null,
	Init : function () {
		if (!Micro._getSessionData() || Micro._getSessionData().length == 0) {
			Micro.AddaNeed_Preview.Abandon();
			Micro.LoadPage('#home');
		} else {
			if (Micro._searchActivate) {
				Micro.mapDeactivateSearch();
				setTimeout(function () {
					Micro._searchActivate = true;
				}, 100);
			}
			Micro.AddaNeed_Preview.postInit();
		}
	},
	postInit : function () {
		try {
			this.setPageBar();
			this.setSideBarContent();
			this.setNoteBookContent();
			this.setMainContent();
			Micro.setNotebookView(true);
			$.each($('nav#nav-need').find('li'), function (i, v) {
				$(v).find('a').unbind().addClass('unuse');
			});
			var data = Micro._getSessionData();
			if (data.need_title) {
				$('#anp_need_title').html(data.need_title);	
			}
				
			if (data.need_description)
				$('#anp_need_description').html(data.need_description);
			if (data.need_photo_url)
				$('#anp_need_photo').attr('src', data.need_photo_url);
			if (data.need_situation)
				$('#anp_need_situation').html(data.need_situation);
			if (data.need_items && data.need_items.length > 0) {
				var htmItems = '';
				var n = 1;
				$.each(data.need_items, function (idx, item) {
					htmItems += '<p>' + n + '. ' + item + '</p>';
					n++;
				});
				$('#anp_need_items').html(htmItems);
			}
			if (data.need_type) {
				newClass = 'icon category ' + data.need_type;
				$('#section-content-sidebar .badge .icon').html("");
				$('#section-content-sidebar .badge .icon').attr('class', newClass);
				$('#anp_need_category_name').html(Micro.Utils.ucFirst(data.need_type));
			}
			if (data.need_user_fullname)
				$('#aneed_pv_user_fullname').html(data.need_user_fullname);
			if (data.need_user_about)
				$('#aneed_pv_user_about').html(data.need_user_about);
			if (data.need_user_joined)
				$('#aneed_pv_joined').html(data.need_user_joined);
			if (data.need_user_id)
				$('#aneed_pv_user_id').val(data.need_user_id);
			if (data.need_geo) {
				var cd = data.need_geo.split(",");
				var oCoords = new Microsoft.Maps.Location(cd[0], cd[1]);
				if (Micro.AddaNeed_Preview._interimMap instanceof Object) {
					Micro.AddaNeed_Preview._interimMap.dispose();
					Micro.AddaNeed_Preview._interimMap = null;
				}
				Micro.AddaNeed_Preview._interimMap = new Microsoft.Maps.Map(document.getElementById('aneed_prev_map'), {
						credentials : C.MICROSOFT_MAPS_KEY,
						zoom : 10,
						center : oCoords,
						labelOverlay : Microsoft.Maps.LabelOverlay.hidden,
						mapTypeId : Microsoft.Maps.MapTypeId.road,
						enableSearchLogo : false,
						enableClickableLogo : false,
						showDashboard : false,
						showBreadcrumb : false,
						disableBirdseye : true,
						disablePanning : true,
						disableZooming : true,
						width : 708,
						height : 145
					});
				Micro.AddaNeed_Preview._interimMap.entities.push(new Microsoft.Maps.Pushpin(oCoords));
			}
			if (data.need_state && data.need_city) {
				var cityStateTxt = data.need_state + ', ' + data.need_city;
				$('.city_state').html(cityStateTxt);
			}
			if (data.need_address) {
				$('#anp_address_text').val(data.need_address);
			}
			$('.submit_need').bind('click', function () {
				var strData = JSON.stringify(data);
				var Client = new AjaxFramework.Client();
				Client.setAjaxMethod(A.NEEDS.ADD_NEED);
				Client.setResponseGlue('JSON');
				Client.setData({
					my : strData
				});
				Client.setOkCallBack(function (d) {
					Micro.LoadPage('#aneed_admin?n=' + d.result);
				});
				Client.Run();
				delete Client;
			});
		} catch (ex) {
			Micro.LoadPage('#aneed');
		}

        if(Micro._lastPage) {
            $('.section-breadcrumbs .right-side .close').bind('click', Micro.aNeedClosePageHandler).show();
        }
	},
	Abandon : function () {
		$('.submit_need').unbind();
		$('.section-breadcrumbs .right-side .close').unbind().off().hide();
	},
	setPageBar	:	function() {
		var dynNav = Micro.BreadCrumbs.generate();
		$('.section-breadcrumbs .left-side .title').html(Micro.BreadCrumbs.generate());
		//$('.section-breadcrumbs .right-side').html(C.PAGE_CLOSE_BUTTON);
	},
	setSideBarContent : function () {
		var html = '';
		html += '<div class="badge type-2">';
		html += '<h2 id="anp_need_category_name"></h2>';
		html += '<div class="icon">?</div>';
		html += '<h3>Posted October 8</h3>';
		html += '</div>';
		Micro.populateSideBar(html);
	},
	setNoteBookContent : function () {
	
		var html = '<div class="thumbnail need">';
			html += '<span class="photo type-2"><img id="anp_need_photo" width="121" height="102"></span>';
			html += '<div class="need_status_graph" id="' + Micro.url.get().n + '">';
			html += '<div class="check liked"></div>';
			html += '<div class="check shared"></div>';
			html += '<div class="check provided"></div>';
			html += '<div class="check delivered"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="details">';
			html += '<h2><a href="#" id="anp_need_title">15 Used Cell Phones</a></h2>';
			html += '<div class="location"><span class="icon"></span><span class="city_state"></span></div>';
			html += '<nav id="nav-need">';
			html += '<h4>Need Activity</h4>';
			html += '<ul>';
			html += '<li class="nav-details"><a href="javascript:void(0);" rel="details">Details</a></li>';
			html += '<li class="nav-thread"><a href="javascript:void(0);" rel="thread">Thread</a></li>';
			html += '<li class="nav-provision"><a href="javascript:void(0);" rel="provision">Provision</a></li>';
			html += '<li class="nav-delivery"><a href="javascript:void(0);" rel="delivery">Delivery</a></li>';
			html += '<li class="nav-team"><a href="javascript:void(0);" rel="team">Team</a></li>';
			html += '</ul>';
			html += '</nav>';
			html += '</div>';
			
			Micro.populateNotebookView(html);
	},
	setMainContent : function () {
		var html = '<aside class="header anp">';
		html += '<h2>Did you dot all your i\'s and cross all your t\'s?</h2>';
		html += '<button class="overgreen submit_need">';
		html += 'Submit Need';
		html += '</button>';
		html += '<span class="need_edit">Whoops, I need to <a href="javascript:void(0);">edit something.</a></span>';
		html += '</aside>';
		html += '<section class="description">';
		html += '<h3 class="title">Description</h3>';
		html += '<div class="content anp" id="anp_need_description">';
		html += '<p>';
		html += "Since 1977, Sojourner Center has provided shelter and support services to thousands of ";
		html += "individuals affected by domestic violence. As the nation's largest domestic violence shelter, ";
		html += "Sojourner Center is a tireless advocate for domestic violence victims and survivors.</p>";
		html += "<p>With the continued support of the community, Sojourner Center can help women and children ";
		html += "overcome the impact of domestic violence, one life at a time.";
		html += '</p>';
		html += '</div>';
		html += '</section>';
		html += '<section class="description">';
		html += '<h3 class="title">Situation</h3>';
		html += '<div class="content anp" id="anp_need_situation">';
		html += '<p>';
		html += "When battered women arrive at our shelter, we provide them with basic needs and services to ";
		html += "help them get back on their feet. Cell phones provide a critical security service for the women ";
		html += "when they are riding the bus to work or picking their children up from school. With cell phones, ";
		html += "they are able to call Sojourner immediately if they find themselves in danger.";
		html += '</p>';
		html += '</div>';
		html += '</section>';
		html += '<section class="description">';
		html += '<h3 class="title">Itemization</h3>';
		html += '<div class="content anp" id="anp_need_items">';
		html += '</div>';
		html += '</section>';
		html += "<section class=\"location-map\">";
		html += "<h3>Destination<\/h3>";
		html += "<div class=\"map edit\">";
		html += "<div class=\"container\" id=\"aneed_prev_map\"><\/div>";
		html += '<input type="text" class="address address_suggestion_input non-editable" id="anp_address_text" readonly="readonly">';
		html += "<input type=\"hidden\" id=\"anp_need_geo\" \/>";
		html += "<\/div>";
		html += "<div class=\"address_suggestion_div\"><\/div>";
		html += "<\/div>";
		html += " <\/section>";
		html += '<section class="description profile-mini clearfix aneed_preview_bottom">';
		html += '<h3 class="title">Originator</h3>';
		html += '<div class="profile-icon default-man"></div>';
		html += '<div class="content info">';
		html += '<h3><a href="" id="aneed_pv_user_fullname">Jimmy Owner</a></h3>';
		html += '<p id="aneed_pv_user_about">';
		html += "I am the <b>Director of Volunteer Services</b> for <b>Sojourner Center.</b>";
		html += "Since starting in this role 10 years ago - I have seen the dramatic transformation in the lives of the women and children we serve. We appreciate your help in fulfilling current needs.";
		html += '</p>';
		html += '<div class="clear"></div>';
		html += '<span class="date" id="aneed_pv_joined">Joined 3 months ago</span>';
		html += '<input type="hidden" id="aneed_pv_user_id">';
		html += '</div>';
		html += '<button class="overgreen submit_need">';
		html += 'Submit Need';
		html += '</button>';
		html += '</section>';
		Micro.populateMainContent(html);
	}
};
