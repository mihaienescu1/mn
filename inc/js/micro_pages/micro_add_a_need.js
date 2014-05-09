Micro.AddaNeed = {
	_pageName : 'AddaNeed',
	_itemCount : 0,
	_oData : null,
	_interimMap : null,
	_selPIN : null,
	Init : function () {
		Micro.USER.isLoggedWithSocialAPI('#profile', function (data) {
			if (data.id) {
				var Client = new AjaxFramework.Client();
				Client.setAjaxMethod(A.USERS.GET_BY_ID);
				Client.setData({
					uid : data.id
				});
				Client.setOkCallBack(Micro.AddaNeed.handleCurrentUser);
				Client.Run();
				delete Client;
				if (Micro._searchActivate) {
					Micro.mapDeactivateSearch();
					setTimeout(function () {
						Micro._searchActivate = true;
					}, 100);
				}
				Micro.AddaNeed.postInit();
			} else {
				Micro.AddaNeed.Abandon();
				Micro.LoadPage('#home');
			}
		});
	},
	postInit : function () {
		this.setNoteBookContent();
		this.setSideBarContent();
		this.setMainContent();
		this.setPageBar();
		Micro.setNotebookView(true);
		if (Micro.AddaNeed._interimMap instanceof Object) {
			Micro.AddaNeed._interimMap.dispose();
			Micro.AddaNeed._interimMap = null;
		}
		Micro.AddaNeed._interimMap = new Microsoft.Maps.Map(document.getElementById('aneed_map'), {
				credentials : C.MICROSOFT_MAPS_KEY,
				zoom : 3,
				center : new Microsoft.Maps.Location(37.09024, -95.712891),
				labelOverlay : Microsoft.Maps.LabelOverlay.hidden,
				mapTypeId : Microsoft.Maps.MapTypeId.road,
				enableSearchLogo : false,
				enableClickableLogo : false,
				showDashboard : false,
				showBreadcrumb : false,
				disableBirdseye : true,
				disablePanning : true,
				width : 708,
				height : 145
			});
		var aneedSearchBox = new google.maps.places.Autocomplete(document.getElementById('need_address'), {
				types : ['geocode'],
				componentRestrictions : {
					country : 'us'
				}
			});
		google.maps.event.addListener(aneedSearchBox, 'place_changed', function () {
			var strCity = null;
			var strState = null;
			var strCityState = null;
			var selPlace = aneedSearchBox.getPlace();
			var coords = selPlace.geometry.location.lat() + ',' + selPlace.geometry.location.lng();
			var oCoords = new Microsoft.Maps.Location(selPlace.geometry.location.lat(), selPlace.geometry.location.lng());
			var strAddress = selPlace.formatted_address;
			$.each(selPlace.address_components, function (i, v) {
				if (v.types.in_array("administrative_area_level_1")) {
					strState = v.long_name;
				}
				if (v.types.in_array("locality")) {
					strCity = v.long_name;
				}
			});
			strCityState = strCity + ', ' + strState;
			$('#need_geo').val(coords);
			$('#need_city').val(strCity);
			$('#need_state').val(strState);
			Micro.AddaNeed._selPIN = new Microsoft.Maps.Pushpin(oCoords, {
					title : strAddress,
					id : coords,
					text : 'N',
					draggable : true
				});
			Micro.AddaNeed._interimMap.setView({
				zoom : 10,
				center : oCoords
			});
			Micro.AddaNeed._interimMap.entities.push(Micro.AddaNeed._selPIN);
			Microsoft.Maps.Events.addHandler(Micro.AddaNeed._selPIN, 'dragend', Micro.AddaNeed.handlePinSelectionMove);

            if(Micro._lastPage) {
                $('.section-breadcrumbs .right-side .close').bind('click', Micro.handleAddNeedCloseWithPageBack).show();
            }
		});
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NEEDS.GET_NEED_TYPES);
		Client.setData({});
		Client.setOkCallBack(this.handleGetNeedTypes);
		Client.Run();
		delete Client;
		var needEditMode = false;
		$('#section-content-main textarea, .need_name').bind('focus', function (e) {
			$(this).parent().addClass('focus');
			needEditMode = true;
		}).bind('blur', function (e) {
			$(this).parent().removeClass('focus');
			needEditMode = false;
		}).bind('mouseenter', function () {
			$(this).parent().addClass('focus');
		}).bind('mouseleave', function () {
			if (!needEditMode)
				$(this).parent().removeClass('focus');
		});
		$('#need_types_box').bind('change', function () {
			if ($(this).val()) {
				newClass = 'icon category ' + $(this).val();
				categoryName = $('#need_types_box option:selected').text();
				$('.category_title').html(categoryName);
				$('#section-content-sidebar .badge .icon').html("");
				$('#section-content-sidebar .badge .icon').attr('class', newClass);
			} else {
				$('.category_title').html("Cateogry");
				$('#section-content-sidebar .badge .icon').html("?");
				$('#section-content-sidebar .badge .icon').attr('class', 'icon');
			}
		});
		$('#aneed_additem').bind('click', function () {
			var currentId = Micro.AddaNeed._itemCount++;
			var line = "";
			line += '<div class="item_line" id="il_' + currentId + '">';
			line += '<textarea default="Item text here..." class="itemized" name="items[]"><\/textarea>';
			line += '<div class="addremove remove remove_item" id="' + currentId + '"></div>';
			line += "<span class=\"description\">Edit\/Add your own text (1000 char max)<\/span>";
			line += "</div>";
			$('#itemized_list_aneed').append(line);
		});
		$('.remove_item').live('click', function () {
			var id_remove = $('#il_' + $(this).attr('id'));
			if (id_remove.remove())
				Micro.AddaNeed._itemCount--;
		});
		$('#addneedphoto').live('click', function () {

			var oHTML = '';
				oHTML += '<div class="addaneed_img_upload">';
				oHTML += '<div class="thumb_overlay">';
				oHTML += '<div class="img"><img src="img/addphoto.png\" class="preview_uploaded_img" width="121" height="102" /></div>';
				oHTML += '</div>';
				oHTML += '<div class="fields_overlay">';
				oHTML += '<span class="inner_title_overlay">Browse your computer and select an image.</span>';
				oHTML += '<br />';
				oHTML += '<span class="inner_subtitle_overlay">Only JPGs, PNGs or BMPs file formats please.</span>';
				oHTML += '<input type="file" id="image_file_aneed" name="image_file_aneed">';
				oHTML += '</div>';
				oHTML += '<div class="overlay_aneed_bottom">';
				oHTML += '<button class="default" id="submit_img_upload_aneed">Upload Image<\/button>';
				oHTML += '<input type="hidden" id="fname_tmp" name="fname_tmp">';
				oHTML += '<span class="overlay_aneed_itext">On second thought, skip this for now</span>';
				oHTML += '</div>';
				oHTML += '</div>';
				
			var CloseImgUploadDialog = function () {
				Micro.AddaNeed.handleDeleteTempImg($('#fname_tmp').val());
			};
			
			Micro.showOverlay('Upload a Photo', 'What is over 121 x 102 will be truncated.', oHTML, CloseImgUploadDialog);
			
			$('#image_file_aneed').uploadify({
				'swf' : 'inc/js/uploadify/uploadify.swf',
				'uploader' : 'index.php/images/upload',
				'buttonText' : 'Browse...',
				'buttonImage' : " ",
				'wmode' : 'transparent',
				'onInit' : function () {
					Micro.AddaNeed.displayUserFileSelectedMsg();
				},
				'onCancel' : function () {
					Micro.AddaNeed.displayUserFileSelectedMsg();
				},
				'onSelect' : function (file) {
					Micro.AddaNeed.clearUserFileSelectedMsg();
				},
				'onUploadComplete' : function (file) {},
				'onUploadSuccess' : function (file, data, response) {
					Micro.AddaNeed.handlePreviwUploadedImage(data);
				},
				'auto' : true
			});
			
			$('#submit_img_upload_aneed').click(function () {
				var imgn = $('#fname_tmp').val();
				if (imgn) {
					$('#aneed_photo').attr('src', url + 'photos/needs/' + imgn);
					$('#need_photo').val(imgn);
					Micro.hideOverlay();
				}
			});
		});
		$('#submit_preview_form').bind('click', Micro.AddaNeed.handlePreviewSubmission);
		$('#overlay-content').delegate('.close_err_dialog', 'click', function () {
			Micro.hideOverlay();
		});

        if(Micro._lastPage) {
            $('#close_add_a_need').live('click', Micro.aNeedClosePageHandler).show();
        }

	},
	Abandon : function () {
		$('.need_name').unbind().off();
		$('.remove_item').unbind().off();
		$('.address_suggestion_div p').unbind().off();
		$('#section-content-main textarea').unbind().off();
		$('#section-content-main textarea, .need_name').unbind().off();
		$('.section-breadcrumbs .right-side .close').hide().unbind().off().hide();
		$('#need_types_box').unbind().off();
		$('#overlay-content').unbind().off();
		$('#submit_preview_form').unbind().off();
		$('#submit_img_upload_aneed').unbind().off();
		$('#aneed_additem').unbind().off();
		$('#addneedphoto').unbind().off();
		$('#need_address').unbind().off();
        $('.close').unbind().off();

		this._itemCount = 0;
	},

	handlePinSelectionMove : function (m) {
		var mLoc = m.entity.getLocation();
		var mGeo = new google.maps.Geocoder();
		mGeo.geocode({
			location : new google.maps.LatLng(mLoc.latitude, mLoc.longitude)
		}, function (results, status) {
			var strCity = null;
			var strState = null;
			var strCityState = null;
			var strAddress = results[0].formatted_address;
			$.each(results[0].address_components, function (i, v) {
				if (v.types.in_array("administrative_area_level_1")) {
					strState = v.long_name;
				}
				if (v.types.in_array("locality")) {
					strCity = v.long_name;
				}
			});
			strCityState = strCity + ', ' + strState;
			$('#need_geo').val(results[0].geometry.location.lat() + "," + results[0].geometry.location.lng());
			$('#need_city').val(strCity);
			$('#need_state').val(strState);
			$('#need_address').val(strAddress);
		});
	},
	handlePreviewSubmission : function () {
		var items = [];
		var title = false;
		var description = false;
		var situation = false;
		var type = false;
		var type_id = false;
		var address = false;
		var geo = false;
		var photo = false;
		var currentUser = false;
		var joined = false;
		var user_fullname = false;
		var user_about = false;
		var state = false;
		var city = false;
		$.each($('.itemized'), function (idx, item) {
			if ($(this).val() !== $(this).attr('default'))
				items.push($(this).val());
		});
		if ($('#need_name').val() !== $('#need_name').attr('default'))
			title = $('#need_name').val();
		if ($('#need_description').val() !== $('#need_description').attr('default'))
			description = $('#need_description').val();
		if ($('#need_situation').val() !== $('#need_situation').attr('default'))
			situation = $('#need_situation').val();
		if ($('#need_types_box').val()) {
			type = $('#need_types_box').val();
			type_id = $('#need_types_box option:selected').attr('id');
		}
		if ($('#need_address').val() !== $('#need_address').attr('default'))
			address = $('#need_address').val();
		if ($('#need_geo').val())
			geo = $('#need_geo').val();
		if ($('#need_state').val())
			state = $('#need_state').val();
		if ($('#need_city').val())
			city = $('#need_city').val();
		if ($('#need_photo').val())
			photo = $('#need_photo').val();
		if ($('#aneed_uinfo_user_id').val())
			currentUser = $('#aneed_uinfo_user_id').val();
		if ($('#aneed_uinfo_joined').html())
			joined = $('#aneed_uinfo_joined').html();
		if ($('#aneed_uinfo_joined').html())
			joined = $('#aneed_uinfo_joined').html();
		if ($('#aneed_uinfo_uname').html())
			user_fullname = $('#aneed_uinfo_uname').html();
		if ($('#aneed_uinfo_about').html())
			user_about = $('#aneed_uinfo_about').html();
		else
			user_about	=	'&nbsp;';
			
		var oData = {
			need_items : items,
			need_title : title,
			need_description : description,
			need_situation : situation,
			need_type : type,
			need_type_id : type_id,
			need_address : address,
			need_state : state,
			need_city : city,
			need_geo : geo,
			need_photo : photo,
			need_photo_url : url + 'photos/needs/' + photo,
			need_user_id : currentUser,
			need_user_joined : joined,
			need_user_fullname : user_fullname,
			need_user_about : user_about
		};
		
		var errors = [];
		$.each(oData, function (key, value) {
			if ("need_items" !== key) {
				if (!value) {
					errors.push(key.replace('_', ' ') + ' cannot be blank.');
				}
			} else {
				if (0 == value) {
					errors.push('You must have minimum one item in the list.');
				}
			}
		});
		if (errors.length == 0) {
			Micro._store(oData);
			Micro.LoadPage('#aneed_preview');
		} else {
			var htmErr = '<div class="aneed_errors"><ul class="errors">';
			for (i in errors) {
				if (undefined !== errors[i] && 'function' !== typeof errors[i]) {
					htmErr += '<li>' + errors[i] + '</li>';
				}
			}
			htmErr += '</ul>';
			htmErr += "<button class=\"default close_err_dialog\">OK<\/button>";
			htmErr += '</div>';
			Micro.showOverlay('Warning', 'Please review the fields', htmErr, false);
		}
	},
	populateAddressList : function (d) {
		if ("OK" === d.status) {
			$('.address_suggestion_div').show();
			$('.address_suggestion_div').empty().html("");
			var addresses = '';
			$.each(d.results, function (idx, result) {
				var latlng = new String(result.geometry.location.lat + ',' + result.geometry.location.lng);
				var strAddress = new String(result.formatted_address);
				addresses += '<p class="' + latlng + '">';
				var strState = '';
				var strCity = '';
				$.each(result.address_components, function (i, v) {
					if (v.types.in_array("administrative_area_level_1")) {
						strState = v.long_name;
					}
					if (v.types.in_array("locality")) {
						strCity = v.long_name;
					}
				});
				strCityState = new String(strCity + ',' + strState);
				addresses += '<span class="addrStringText">' + strAddress + '</span>';
				addresses += '<span class="cityStateText" style="display:none;">' + strCityState + '</span>';
				addresses += '</p>';
			});
			$('.address_suggestion_div').html(addresses);
		}
	},
	handleCurrentUser : function (user) {
		if (user.firstname && user.lastname)
			$('#aneed_uinfo_uname').html(user.firstname + ' ' + user.lastname);
		if (user.about)
			$('#aneed_uinfo_about').html(user.about);
		if (user.joined)
			$('#aneed_uinfo_joined').html(user.joined);
		if (user.id)
			$('#aneed_uinfo_user_id').val(user.id);
	},
	handleDeleteTempImg : function (img) {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.IMAGES.DELETE);
		Client.setData({
			imgname : img
		});
		Client.setOkCallBack(function (data) {
			if ("IMAGE_DELETED" === data.result) {
				$('#fname_tmp').val("");
			}
		});
		Client.Run();
		delete Client;
		Micro.hideOverlay();
	},
	handlePreviwUploadedImage : function (imgData) {
		d = $.parseJSON(imgData);
		if ("UPLOAD_OK" === d.result) {
			p = url + 'photos/needs/' + d.info.file_name_stored;
			$('.preview_uploaded_img').attr('src', p);
			$('#fname_tmp').val(d.info.file_name_stored);
			Micro.AddaNeed.uploadDisplayMessage('Image ok, Click to upload.');
		} else if ("FILESIZE_EXCEEDED" === d.result) {
			Micro.AddaNeed.uploadClearQueue();
			Micro.AddaNeed.uploadDisplayMessage('The image file should have maximum 1MB.');
		}
	},
	uploadDisplayMessage : function (msg) {
		if (!msg)
			$('.overlay_aneed_itext').html("&nbsp;");
		else
			$('.overlay_aneed_itext').html(msg);
	},
	uploadClearQueue : function () {
		$('#image_file_aneed').uploadifive('clearQueue');
	},
	displayUserFileSelectedMsg : function () {
		$('.uploadifive-queue').html('<div class="no_file_alert">No file selected</div>');
	},
	clearUserFileSelectedMsg : function () {
		$('.no_file_alert').remove();
	},
	handleGetNeedTypes : function (types) {
		$('#need_types_box').empty().html("");
		$('#need_types_box').append('<option value="" id="000">Select a category...</option>');
		$.each(types, function (idx, type) {
			var value = type.title.replace(" ", "").toLowerCase();
			var type_id = type.id;
			var title = type.title;
			$('#need_types_box').append('<option value="' + value + '" id="' + type_id + '">' + title + '</option>');
		});
	},

	setPageBar	:	function() {
		var dynNav = Micro.BreadCrumbs.generate();
		$('.section-breadcrumbs .left-side .title').html(Micro.BreadCrumbs.generate());
		$('.section-breadcrumbs .right-side').html(C.PAGE_CLOSE_BUTTON);
		$('.section-breadcrumbs .right-side .close').live('click', function() {
			Micro.LoadPage( '#'+Micro._lastPage.rawName );
		});
	},
	
	setNoteBookContent : function () {
		var html = "";
		html += "<div class=\"thumbnail need\">";
		html += "<span class=\"photo type-2\" id=\"addneedphoto\">";
		html += "<img width=\"120\" height=\"102\" id=\"aneed_photo\" src=\"img\/addphoto.png\">";
		html += "<\/span>";
		html += '<div class="need_status_graph" id="' + Micro.url.get().n + '">';
		html += '<div class="check liked"></div>';
		html += '<div class="check shared"></div>';
		html += '<div class="check provided"></div>';
		html += '<div class="check delivered"></div>';
		html += '</div>';
		html += "<\/div>";
		html += "<input type=\"hidden\" name=\"need_photo\" id=\"need_photo\" \/>";
		html += "<div id=\"need_title\">";
		html += "<section>";
		html += "<h3>Title Your Need<\/h3>";
		html += "<section class=\"edit inline\">";
		html += "<span class=\"quote left\"><\/span>";
		html += "<span class=\"quote right\"><\/span>";
		html += "<div class=\"container\" id=\"need_name_container\">";
		html += '<input type="text" class="need_name" name="need_name" id="need_name" value="" default="Need title here..." />';
		html += "<span class=\"description\">Edit\/Add your own text (100 char max)<\/span>";
		html += "<\/div>";
		html += "<\/section>";
		html += "<\/section>";
		html += "<div class=\"us_based_alert\">";
		html += "<div class=\"alert_img\"><\/div>";
		html += "<div class=\"alert_text\">Only U.S. based needs at this time please<\/div>";
		html += "<\/div>";
		html += "<\/div>";
		Micro.populateNotebookView(html);
	},
	setSideBarContent : function () {
		var html = '';
		html += '<div class="badge type-2">';
		html += '<h2 class="category_title">Category</h2>';
		html += '<div class="icon">?</div>';
		html += '<h3>Posted October 8</h3>';
		html += '</div>';
		Micro.populateSideBar(html);
	},
	setMainContent : function () {
		var html  = "";
			html += "<section>";
			html += "<h3>Describe the Need<\/h3>";
			html += "<section class=\"edit inline\">";
			html += "<span class=\"quote left\"><\/span>";
			html += "<span class=\"quote right\"><\/span>";
			html += "<div class=\"container\">";
			html += "<textarea default=\"Describe your need as clearly as possible.\" id=\"need_description\"><\/textarea>";
			html += "<span class=\"description\">Edit\/Add your own text (1000 char max)<\/span>";
			html += "<\/div>";
			html += "<\/section>";
			html += "<\/section>";
			html += "<section>";
			html += "<h3>Explain Your Situation<\/h3>";
			html += "<section class=\"edit inline\">";
			html += "<span class=\"quote left\"><\/span>";
			html += "<span class=\"quote right\"><\/span>";
			html += "<div class=\"container\">";
			html += "<textarea default=\"Describe your situation as clearly as possible.\" id=\"need_situation\"><\/textarea>";
			html += "<span class=\"description\">Edit\/Add your own text (1000 char max)<\/span>";
			html += "<\/div>";
			html += "<\/section>";
			html += "<\/section>";
			html += "<section>";
			html += "<h3>Need Type<\/h3>";
			html += "<div class=\"styled-select\">";
			html += "<div class=\"left\"></div>";
			html += "<div class=\"center\">";
			html += "<select id=\"need_types_box\">";
			html += "<option value=\"\">Select a Category...<\/option>";
			html += "<\/select>";
			html += "<\/div>";
			html += "<div class=\"right\">";
			html += "<\/div>";
			html += "<\/div>";
			html += "<div class=\"clear\"><\/div>";
			html += "<\/section>";
			html += "";
			html += "<section>";
			html += "<h3>Itemized List <em>(If Necessary)<\/em><\/h3>";
			html += "<section class=\"edit inline\">";
			html += "<span class=\"quote left\"><\/span>";
			html += "<span class=\"quote right\"><\/span>";
			html += "<div class=\"container\" id=\"itemized_list_aneed\">";
			html += "<div class=\"item_line\">";
			html += "<textarea default=\"Item text here...\" class=\"itemized\" name=\"items[]\" id=\"items\"><\/textarea>";
			html += "<div class=\"addremove add\" id=\"aneed_additem\"></div>";
			html += "<span class=\"description\">Edit\/Add your own text (1000 char max)<\/span>";
			html += "</div>";
			html += "<\/div>";
			html += "<\/section>";
			html += "<\/section>";
			html += "<section class=\"location-map\">";
			html += "<h3>Destination\/Delivery Address  <span class=\"highlight\">(U.S. Locations only please)<\/span><\/h3>";
			html += "<div class=\"map edit\">";
			html += "<div class=\"container\" id=\"aneed_map\"><\/div>";
			html += "<input type=\"text\" id=\"need_address\" class=\"address address_suggestion_input\" value=\"\" default=\"Type in the delivery address. The system will attempt to find a match and display the location...\" \/>";
			html += "<input type=\"hidden\" id=\"need_geo\" \/>";
			html += "<input type=\"hidden\" id=\"need_state\" \/>";
			html += "<input type=\"hidden\" id=\"need_city\" \/>";
			html += "<\/div>";
			html += "<div class=\"address_suggestion_div\"><\/div>";
			html += "<\/div>";
			html += " <\/section>";
			html += "<section class=\"profile-mini\">";
			html += "<h3>Need Originator<\/h3>";
			html += "<div class=\"profile-icon default-man\"><\/div>";
			html += "<div class=\"info\">";
			html += "<h3><a href=\"\" id=\"aneed_uinfo_uname\"><\/a><\/h3>";
			html += "<p id=\"aneed_uinfo_about\"><\/p>";
			html += "<span class=\"date\" id=\"aneed_uinfo_joined\">Join 3 months ago<\/span>";
			html += "<input type=\"hidden\" id=\"aneed_uinfo_user_id\">";
			html += "<\/div>";
			html += "<button class=\"default\" id=\"submit_preview_form\">Preview<\/button>";
			html += "<\/section>";
		Micro.populateMainContent(html);
	}
};
