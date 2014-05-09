Micro.AddaNeed_Admin = {
	_pageName : 'AddaNeed_Admin',
	_need : null,
	_itemsToDelete : [],
	_itemsToAdd : [],
	_itemsToUpdate : [],
	_newNeedImage : false,
	_currentNeedImage : false,
	_interimMap : null,
	_selPIN : null,
	_editModes : {
		need_edit_name : {
			state : false,
			field_id : 'ana_need_title',
			currentVal : null
		},
		need_edit_description : {
			state : false,
			field_id : 'ana_description',
			currentVal : null
		},
		need_edit_situation : {
			state : false,
			field_id : 'ana_situation',
			currentVal : null
		},
		need_edit_category : {
			state : false,
			field_id : 'ana_need_types',
			currentVal : null
		},
		need_edit_items : {
			state : false,
			field_id : null,
			currentVal : null
		},
		need_edit_destination : {
			state : false,
			field_id : 'ana_address_text',
			currentVal : null
		},
		need_edit_originator : {
			state : false,
			field_id : null,
			currentVal : null
		}
	},
	Init : function () {
		if (Micro.url.get().n) {
			this._need = Micro.url.get().n;
			Micro.AddaNeed_Admin.postInit();
		} else {
			Micro.AddaNeed_Admin.Abandon();
			Micro.LoadPage('#aneed');
		}
	},
	postInit : function () {
		if (Micro._searchActivate) {
			Micro.mapActivateSearch();
		}
		this.setPageBar();
		this.setSideBarContent();
		this.setNoteBookContent();
		this.setMainContent();
		Micro.setNotebookView(true);
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NEEDS.GET_BY_ID);
		Client.setResponseGlue('JSON');
		Client.setData({
			need_id : this._need
		});
		Client.setOkCallBack(this.handleGetNeed);
		Client.Run();
		delete Client;
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NEEDS.GET_NEED_TYPES);
		Client.setData({});
		Client.setOkCallBack(this.handleGetNeedTypes);
		Client.Run();
		delete Client;
		var adminAddressText = new google.maps.places.Autocomplete(document.getElementById('ana_address_text'), {
				types : ['geocode'],
				componentRestrictions : {
					country : 'us'
				}
			});
		google.maps.event.addListener(adminAddressText, 'place_changed', function () {
			var strCity = null;
			var strState = null;
			var strCityState = null;
			var selPlace = adminAddressText.getPlace();
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
			$('#ana_need_geo').val(coords);
			$('#ana_need_city').val(strCity);
			$('#ana_need_state').val(strState);
			$('#ana_address_text').val(strAddress);
			Micro.AddaNeed_Admin._interimMap.entities.clear();
			Micro.AddaNeed_Admin._selPIN = new Microsoft.Maps.Pushpin(oCoords, {
					title : strAddress,
					id : coords,
					draggable : false
				});
			Micro.AddaNeed_Admin._interimMap.setView({
				zoom : 10,
				center : oCoords
			});
			Micro.AddaNeed_Admin._interimMap.entities.push(Micro.AddaNeed_Admin._selPIN);
			Microsoft.Maps.Events.addHandler(Micro.AddaNeed_Admin._selPIN, 'dragend', Micro.AddaNeed_Admin.handlePinSelectionMove);
		});
		$('#ana_address_text').attr('disabled', 'disabled');
		$('.pr_edit_btn_active_mode .save, .pr_edit_btn_active_mode .discard').mousedown(function () {
			$(this).addClass('press');
		}).mouseup(function () {
			$(this).removeClass('press');
		});
		$('.pr_edit_btn').bind('click', Micro.AddaNeed_Admin.handleEditButtonClick);
		$('.item_line .remove_item').live('click', Micro.AddaNeed_Admin.handleItemDelete);
		$('.add_item').bind('click', Micro.AddaNeed_Admin.handleItemAdd);
		$('.pr_edit_btn_active_mode .save').bind('click', Micro.AddaNeed_Admin.handleSaveSectionButtonClick);
		$('.pr_edit_btn_active_mode .discard').bind('click', Micro.AddaNeed_Admin.handleCancelEditButtonClick);
		$('#ana_need_types').bind('change', Micro.AddaNeed_Admin.handleCategoryChange);
		
		$('#section-content-main').delegate('.share_need', 'click', Micro.AddaNeed_Admin.handleFBPublish);
		$('#add_new_need').bind('click', Micro.AddaNeed_Admin.GoBackToAddNeed);
        if(Micro._lastPage) {
            $('.section-breadcrumbs .right-side .close').bind('click', Micro.aNeedClosePageHandler).show();
        }
	},
	
	Abandon : function () {
		$('.pr_edit_btn_active_mode .save, .pr_edit_btn_active_mode .discard').unbind().off();
		$('.pr_edit_btn').unbind().off();
		$('.remove_item').unbind().off();
		$('.add_item').unbind().off();
		$('#ana_need_types').unbind().off();
		$('#close_addaneed_admin').unbind().off();
		$('#section-content-main').undelegate('.share_need');
		$('.section-breadcrumbs .right-side .close').unbind().off().hide();
	},
	GoBackToAddNeed : function () {
		Micro.AddaNeed_Admin.Abandon();
		Micro.LoadPage('#aneed');
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
			$('#ana_need_geo').val(results[0].geometry.location.lat() + "," + results[0].geometry.location.lng());
			$('#ana_need_city').val(strCity);
			$('#ana_need_state').val(strState);
			$('#ana_address_text').val(strAddress);
			console.log(strAddress);
		});
	},
	handleFBPublish : function () {
		
		var info = {
			method 		: 'feed',
			name 		: $('#ana_need_title').val(),
			link 		: $('.share_need').attr('url'),
			picture 	: $('#ana_photo').attr('src'),
			caption 	: C.NEED_CAPTION_GENERAL,
			description : $('#ana_description').val()
		};
		
		console.log( 'Teste' );

		FB.ui(info, Micro.AddaNeed_Admin.postCallBack);
	},
	postCallBack : function (response) {
	
	console.log( response );
		if (response && response.post_id) {
			
			var who = Micro._currentUser;
			var metaData = url + '#aneed_admin?n='+Micro.AddaNeed_Admin._need;
			var need = Micro.AddaNeed_Admin._need;
			var type = 'SOCIAL_SHARE';
			var postid	=	response.post_id;
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.ACTIVITIES.ADD);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : need,
				user_id : who,
				content : postid,
				activity_type : type,
				meta : metaData
			});
			Client.setOkCallBack(Micro.handleNeedUpdate);
			Client.Run();
			delete Client;
		} else {
			console.log('Post was not published.');
		}
	},
	handleGetNeedTypes : function (types) {
		$('#ana_need_types').empty().html("");
		$.each(types, function (idx, type) {
			var value = type.title.replace(" ", "").toLowerCase();
			var type_id = type.id;
			var title = type.title;
			$('#ana_need_types').append('<option value="' + value + '" id="' + type_id + '">' + title + '</option>');
		});
	},
	handleCategoryChange : function () {
		className = $(this).val();
		selectedText = $(this).find('option:selected').text();
		newClass = 'icon category ' + className.toLowerCase();
		$('#section-content-sidebar .badge .icon').html("");
		$('#section-content-sidebar .badge .icon').attr('class', newClass);
		$('#ana_need_category_name').html(selectedText);
	},
	handleItemDelete : function (e) {
		e.preventDefault();
		e.stopPropagation();
		e.cancelBubble = true;
		if ($(this).parent().hasClass('added')) {
			btn_id = $(this).attr('id').split("_");
			line_id = $(this).parent().attr('id').split("_");
			$('#line_' + line_id[1]).remove();
		} else {
			btn_id = $(this).attr('id');
			line_id = $(this).parent().attr('id');
			var ni = $(this).parent().attr('id').replace('item_id_', '').replace('need_', '');
			c = ni.split("_");
			cNeedId = c[1];
			cItemId = c[0];
			$('#item_id_' + cItemId + '_need_' + cNeedId).hide();
			if (!Micro.AddaNeed_Admin._itemsToDelete.in_array(cItemId)) {
				Micro.AddaNeed_Admin._itemsToDelete.push(cItemId);
			}
		}
	},
	handleItemAdd : function () {
		rand_id = Math.floor((Math.random() * 10) + 1);
		line_id = 'line_' + rand_id;
		btn_id = 'btn_' + rand_id;
		text_id = 'text_' + rand_id;
		line = "";
		line += '<div class="item_line added" id="' + line_id + '">';
		line += '<textarea class="itemized added edit-enabled" readonly="readonly" id="' + text_id + '"><\/textarea>';
		line += '<div class="addremove remove remove_item ana" id="' + btn_id + '"></div>';
		line += "<span class=\"description charmax\">Edit\/Add your own text (1000 char max)<\/span>";
		line += "</div>";
		$('#ana_items').append(line);
		$('.addremove.ana').show();
		$('#' + text_id).removeAttr('readonly');
	},
	handleEditButtonClick : function () {
		var classArray = $(this).attr('class').split(" ");
		var actionName = classArray[classArray.length - 1];
		Micro.AddaNeed_Admin.toggleSectionEditModeOnOff(actionName, 'edit');
	},
	handleCancelEditButtonClick : function () {
		var classArray = $(this).parent().attr('class').split(" ");
		var actionName = classArray[classArray.length - 1];
		Micro.AddaNeed_Admin.toggleSectionEditModeOnOff(actionName, 'discard');
	},
	handleSaveSectionButtonClick : function () {
		var classArray = $(this).parent().attr('class').split(" ");
		var actionName = classArray[classArray.length - 1];
		Micro.AddaNeed_Admin.toggleSectionEditModeOnOff(actionName, 'save');
	},
	handleNeedUserDisplay : function (user) {
		if (Micro._currentUser == user.id) {
			$('.pr_edit_btn').show();
		}
		if (user.about) {
			$('#ana_user_about').html(user.about);
		}
		if (user.firstname && user.lastname) {
			$('#ana_user_fullname').html(user.firstname + ' ' + user.lastname);
		}
		if (user.joined) {
			$('#ana_user_joined').html(user.joined);
		}
	},
	toggleSectionEditModeOnOff : function (sectionName, actionType) {
		var currentField = Micro.AddaNeed_Admin._editModes[sectionName].field_id;
		if (currentField) {
			if ("edit" === actionType) {
				Micro.AddaNeed_Admin._editModes[sectionName].currentVal = $('#' + currentField).val();
				if (currentField === "ana_address_text") {
					Micro.AddaNeed_Admin._editModes.need_edit_destination.op = Micro.AddaNeed_Admin._interimMap.getCenter();
					Micro.AddaNeed_Admin._interimMap.setView({
						disableZooming : false,
						disablePanning : false
					});
					Micro.AddaNeed_Admin._selPIN.setOptions({
						draggable : true
					});
					$('#ana_address_text').removeAttr('disabled');
				}
			}
			if (!Micro.AddaNeed_Admin._editModes[sectionName].state) {
				Micro.AddaNeed_Admin._editModes[sectionName].state = true;
				$('.pr_edit_btn_active_mode.' + sectionName).show();
				$('.pr_edit_btn.' + sectionName).hide();
				if (currentField === "ana_need_types") {
					$('#' + currentField).removeAttr('disabled');
				} else {
					$('#' + currentField).removeAttr('readonly');
					$('#' + currentField).addClass('edit-enabled');
				}
				if ("need_edit_name" === sectionName) {
					Micro.AddaNeed_Admin.handlePhotoEdit(sectionName, actionType);
				}
			} else {
				Micro.AddaNeed_Admin._editModes[sectionName].state = false;
				$('.pr_edit_btn_active_mode.' + sectionName).hide();
				$('.pr_edit_btn.' + sectionName).show();
				if ("discard" === actionType) {
					$('#' + currentField).val(Micro.AddaNeed_Admin._editModes[sectionName].currentVal);
					Micro.AddaNeed_Admin._editModes[sectionName].currentVal = null;
					if (currentField === "ana_address_text") {
						var cPlace = Micro.AddaNeed_Admin._editModes.need_edit_destination.op;
						Micro.AddaNeed_Admin._interimMap.setView({
							disableZooming : true,
							disablePanning : true,
							zoom : 10,
							center : cPlace
						});
						Micro.AddaNeed_Admin._selPIN.setOptions({
							draggable : false
						});
						Micro.AddaNeed_Admin._selPIN.setLocation(cPlace);
						$('#ana_address_text').attr('disabled', 'disabled');
						console.log(Micro.AddaNeed_Admin._editModes[sectionName]);
					}
				} else if ("save" === actionType) {
					if ($('#' + currentField).val()) {
						fields_to_update = {
							id : Micro.AddaNeed_Admin._need
						};
						new_value = $('#' + currentField).val();
						switch (currentField) {
						case 'ana_need_title':
							fields_to_update.title = new_value;
							break;
						case 'ana_description':
							fields_to_update.description = new_value;
							break;
						case 'ana_situation':
							fields_to_update.situation = new_value;
							break;
						case 'ana_need_types':
							new_value = $('#' + currentField).find('option:selected').attr('id');
							fields_to_update.type_id = new_value;
							break;
						case 'ana_address_text':
							fields_to_update.location = new_value;
							var coords = $('#ana_need_geo').val().split(",");
							fields_to_update.latitude = coords[0];
							fields_to_update.longitude = coords[1];
							$('.city_state').html($('#ana_need_city').val() + ', ' + $('#ana_need_state').val());
							$('#ana_address_text').attr('disabled', 'disabled');
							var newPlace = new Microsoft.Maps.Location(fields_to_update.latitude, fields_to_update.longitude);
							Micro.AddaNeed_Admin._interimMap.setView({
								disableZooming : true,
								disablePanning : true,
								zoom : 10,
								center : newPlace
							});
							Micro.AddaNeed_Admin._selPIN.setOptions({
								draggable : false
							});
							Micro.AddaNeed_Admin._selPIN.setLocation(newPlace);
							break;
						default:
							break;
						}
						var strFields = JSON.stringify(fields_to_update);
						var Client = new AjaxFramework.Client();
						Client.setAjaxMethod(A.NEEDS.UPDATE_NEED);
						Client.setResponseGlue('JSON');
						Client.setData({
							fields : strFields
						});
						Client.setOkCallBack(function (response) {
							if (response.status !== "NEED_FIELD_UPDATED") {
								$('#' + currentField).val(Micro.AddaNeed_Admin._editModes[sectionName].currentVal);
								Micro.AddaNeed_Admin._editModes[sectionName].currentVal = null;
							}
						});
						Client.Run();
						delete Client;
					}
				}
				if (currentField === "ana_need_types") {
					$('#' + currentField).attr('disabled', 'disabled');
				} else {
					$('#' + currentField).attr('readonly', 'readonly');
					$('#' + currentField).removeClass('edit-enabled');
				}
				if ("need_edit_name" === sectionName) {
					Micro.AddaNeed_Admin.handlePhotoEdit(sectionName, actionType);
				}
			}
		} else {
			switch (sectionName) {
			case 'need_edit_items':
				Micro.AddaNeed_Admin.toggleItemsEditSection(sectionName, actionType);
				break;
			default:
				Micro.voidAction();
				break;
			}
		}
	},
	toggleItemsEditSection : function (sectionName, action) {
		var displayEmodeInactive = function () {
			$('textarea.itemized.current').attr('readonly', 'readonly');
			$('textarea.itemized.current').removeClass('edit-enabled');
			$('textarea.itemized.added').removeClass('edit-enabled');
			$('.pr_edit_btn_active_mode.' + sectionName).hide();
			$('.pr_edit_btn.' + sectionName).show();
			$('.addremove.ana').hide();
			return;
		};
		var displayEmodeActive = function () {
			$('textarea.itemized.current').removeAttr('readonly');
			$('textarea.itemized.current').addClass('edit-enabled');
			$('textarea.itemized.added').addClass('edit-enabled');
			$('.pr_edit_btn_active_mode.' + sectionName).show();
			$('.pr_edit_btn.' + sectionName).hide();
			$('.addremove.ana').show();
			return;
		};
		var storeDefaultValues = function () {
			Micro.AddaNeed_Admin._editModes[sectionName].currentVal = [];
			$.each($('textarea.itemized.current'), function (idx, textVal) {
				Micro.AddaNeed_Admin._editModes[sectionName].currentVal.push({
					val : $(this).val(),
					id : $(this).attr('id')
				});
			});
			return;
		};
		var getDefaultValues = function () {
			return Micro.AddaNeed_Admin._editModes[sectionName].currentVal;
		};
		switch (action) {
		case 'edit':
			storeDefaultValues();
			break;
		case 'save':
			$.each($('.item_line.added textarea'), function (idx, val) {
				Micro.AddaNeed_Admin._itemsToAdd.push($(this).val());
			});
			$.each($('.item_line.db textarea'), function (idx, val) {
				uid = $(this).attr('id');
				if (!Micro.AddaNeed_Admin._itemsToDelete.in_array(uid)) {
					Micro.AddaNeed_Admin._itemsToUpdate.push({
						id : uid,
						val : $(this).val()
					});
				}
			});
			oUpdate = {
				del_ids : Micro.AddaNeed_Admin._itemsToDelete,
				add : Micro.AddaNeed_Admin._itemsToAdd,
				update : Micro.AddaNeed_Admin._itemsToUpdate
			};
			Micro.AddaNeed_Admin._itemsToUpdate = [];
			Micro.AddaNeed_Admin._itemsToAdd = [];
			Micro.AddaNeed_Admin._itemsToDelete = [];
			oUpdate = JSON.stringify(oUpdate);
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod('needs.updateNeedItems');
			Client.setData({
				need_id : Micro.AddaNeed_Admin._need,
				params : oUpdate
			});
			Client.setOkCallBack(function (data) {
				console.log(data);
			});
			Client.Run();
			delete Client;
			break;
		case 'discard':
			$('.item_line.db').show();
			$('.item_line.added').remove();
			$.each(getDefaultValues(), function (idx, d) {
				$('#item_id_' + d.id + '_need_' + Micro.AddaNeed_Admin._need).find('textarea').val(d.val);
			});
			Micro.AddaNeed_Admin._itemsToDelete = [];
			Micro.AddaNeed_Admin._itemsToAd = [];
			break;
		default:
			Micro.voidAction();
			break;
		}
		if (!Micro.AddaNeed_Admin._editModes[sectionName].state) {
			displayEmodeActive();
			Micro.AddaNeed_Admin._editModes[sectionName].state = true;
		} else {
			displayEmodeInactive();
			Micro.AddaNeed_Admin._editModes[sectionName].state = false;
		}
	},
	handlePhotoEdit : function (section, action) {
		if (Micro.AddaNeed_Admin._editModes[section].state) {
			$('#ana_photo').bind('click', Micro.AddaNeed_Admin.handleImageClick);
		} else {
			$('#ana_photo').unbind().off();
			switch (action) {
			case 'discard':
				$('#ana_photo').attr('src', url + 'photos/needs/' + Micro.AddaNeed_Admin._currentNeedImage);
				Micro.AddaNeed_Admin.handleDeleteTempImg(Micro.AddaNeed_Admin._newNeedImage);
				Micro.AddaNeed_Admin._newNeedImage = false;
				break;
			case 'save':
				if (Micro.AddaNeed_Admin._newNeedImage) {
					fields_to_update.photo = Micro.AddaNeed_Admin._newNeedImage;
					var imgField = JSON.stringify(fields_to_update);
					var Client = new AjaxFramework.Client();
					Client.setAjaxMethod(A.NEEDS.UPDATE_NEED);
					Client.setResponseGlue('JSON');
					Client.setData({
						fields : imgField
					});
					Client.setOkCallBack(function (response) {
						if (response.status === "NEED_FIELD_UPDATED") {
							Micro.AddaNeed_Admin.handleDeleteTempImg(Micro.AddaNeed_Admin._currentNeedImage);
							Micro.AddaNeed_Admin._currentNeedImage = Micro.AddaNeed_Admin._newNeedImage;
							Micro.AddaNeed_Admin._newNeedImage = false;
						}
					});
					Client.Run();
					delete Client;
				}
				break;
			}
		}
	},
	handleImgEditCancel : function () {
		if (Micro.AddaNeed_Admin._newNeedImage) {
			Micro.AddaNeed_Admin.handleDeleteTempImg(Micro.AddaNeed_Admin._newNeedImage);
			Micro.AddaNeed_Admin._newNeedImage = false;
		}
		Micro.hideOverlay();
	},
	handleDeleteTempImg : function (img) {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.IMAGES.DELETE);
		Client.setData({
			imgname : img
		});
		Client.setOkCallBack(function (data) {});
		Client.Run();
		delete Client;
	},
	handleImageClick : function () {
		var oHTML = '';
		oHTML += '<div class="addaneed_img_upload">';
		oHTML += '<div class="thumb_overlay">';
		oHTML += '<div class="img"><img src="img/addphoto.png\" class="preview_uploaded_img" width="121" height="102" /></div>';
		oHTML += '</div>';
		oHTML += '<div class="fields_overlay">';
		oHTML += '<span class="inner_title_overlay">Browse your computer and select an image.</span>';
		oHTML += '<br />';
		oHTML += '<span class="inner_subtitle_overlay">Only JPGs, PNGs or BMPs file formats please.</span>';
		oHTML += '<input type="file" id="image_file_aneed_edit" name="image_file_aneed_edit">';
		oHTML += '</div>';
		oHTML += '<div class="overlay_aneed_bottom">';
		oHTML += '<button class="default" id="submit_img_upload_aneed_change">Change Image<\/button>';
		oHTML += '<input type="hidden" id="fname_tmp" name="fname_tmp">';
		oHTML += '<span class="overlay_aneed_itext">On second thought, skip this for now</span>';
		oHTML += '</div>';
		oHTML += '</div>';
		Micro.showOverlay('Chose a new Photo', '121 x 102 maximum', oHTML, Micro.AddaNeed_Admin.handleImgEditCancel);
		$('#image_file_aneed_edit').uploadify({
			'swf' : 'inc/js/uploadify/uploadify.swf',
			'uploader' : url + 'index.php/images/upload',
			'buttonText' : 'Browse...',
			'buttonImage' : " ",
			'wmode' : 'transparent',
			'onInit' : function () {
				Micro.AddaNeed_Admin.displayUserFileSelectedMsg();
				Micro.AddaNeed_Admin.displayUserFileSelectedMsg();
			},
			'onCancel' : function () {
				Micro.AddaNeed_Admin.displayUserFileSelectedMsg();
			},
			'onSelect' : function (file) {
				Micro.AddaNeed_Admin.clearUserFileSelectedMsg();
			},
			'onUploadComplete' : function (file) {},
			'onUploadSuccess' : function (file, data, response) {
				var imgData = $.parseJSON(data);
				if (imgData.result && imgData.result === "UPLOAD_OK") {
					Micro.AddaNeed_Admin.handlePreviwUploadedImage(data);
					Micro.AddaNeed_Admin._newNeedImage = imgData.info.file_name_stored;
				}
			},
			'auto' : true
		});
		$('#submit_img_upload_aneed_change').click(function () {
			if (Micro.AddaNeed_Admin._newNeedImage !== false) {
				newImagePath = url + 'photos/needs/' + Micro.AddaNeed_Admin._newNeedImage;
				$('#ana_photo').attr('src', newImagePath);
				Micro.hideOverlay();
			} else {
				console.log('No new image selected');
			}
		});
	},
	
	clearUserFileSelectedMsg : function () {
		$('.no_file_alert').remove();
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
	
	handlePreviwUploadedImage : function (imgData) {
		d = $.parseJSON(imgData);
		if ("UPLOAD_OK" === d.result) {
			p = url + 'photos/needs/' + d.info.file_name_stored;
			$('.preview_uploaded_img').attr('src', p);
			$('#fname_tmp').val(d.info.file_name_stored);
			Micro.AddaNeed_Admin.uploadDisplayMessage('Image ok, Click to upload.');
		} else if ("FILESIZE_EXCEEDED" === d.result) {
			Micro.AddaNeed_Admin.uploadClearQueue();
			Micro.AddaNeed_Admin.uploadDisplayMessage('The image file should have maximum 1MB.');
		}
	},

	handleGetNeed : function (data) {
		
		if (data.need.title) {
            $('#ana_need_title').val(data.need.title);
            $('.brct').html(data.need.title);
        }
		
		if (data.need.photo) {
			path = url + 'photos/needs/' + data.need.photo;
			$('#ana_photo').attr('src', path);
			Micro.AddaNeed_Admin._currentNeedImage = data.need.photo;
		}
		
		if (data.need.description) {
			$('#ana_description').val(data.need.description);
		}
		
		if (data.need.situation) {
			$('#ana_situation').val(data.need.situation);
		}
		
		if (data.need.type_label) {
			selected = data.need.type_label.toLowerCase().replace(" ", "");
			newClass = 'icon category ' + selected;
			$('#section-content-sidebar .badge .icon').html("");
			$('#section-content-sidebar .badge .icon').attr('class', newClass);
			$('#ana_need_category_name').html(data.need.type_label);
			setTimeout(function () {
				$('#ana_need_types').val(selected);
				$('#ana_need_types').attr('disabled', 'disabled');
			}, 1500);
		}
		
		if (data.need.items) {
			var line = '';
			var p = 1;
			for (var i = 0; i < data.need.items.length; i++) {
				line += "";
				line += '<div class="item_line db" id="item_id_' + data.need.items[i].id + '_need_' + data.need.items[i].need_id + '">';
				line += '<textarea class="itemized current" readonly="readonly" id="' + data.need.items[i].id + '">' + data.need.items[i].title + '<\/textarea>';
				line += '<div class="addremove remove remove_item ana" id="remove_' + data.need.items[i].id + '"></div>';
				line += "<span class=\"description charmax\">Edit\/Add your own text (1000 char max)<\/span>";
				line += "</div>";
				p++;
			}
			$('#ana_items').html(line);
		}
		
		if (data.need.location) {
		
			$('#ana_address_str').val(data.need.location);
			$('#ana_address_text').val(data.need.location);
			Micro.geo.getAddressArrayByAddressString(data.need.location, function (oAddr) {
				var cityStateStr = oAddr.locality + ', ' + oAddr.administrative_area_level_1;
				$('.city_state').html(cityStateStr);
			});
		}
		
		if (data.need.latitude && data.need.longitude) {
			var strCoords = new String(data.need.longitude + ',' + data.need.latitude);
			if (strCoords) {
				$('#ana_need_geo').val(strCoords);
			}
			var oCoords = new Microsoft.Maps.Location(data.need.latitude, data.need.longitude);
			if (Micro.AddaNeed_Admin._interimMap instanceof Object) {
				Micro.AddaNeed_Admin._interimMap.dispose();
				Micro.AddaNeed_Admin._interimMap = null;
			}
			
			if( 'AddaNeed_Preview' == Micro._lastPage.name ) {
				Micro.handleSetMapCenter(oCoords, true, Micro.url.get().n);
			}
			
			Micro.AddaNeed_Admin._interimMap = new Microsoft.Maps.Map(document.getElementById('aneed_adm_map'), {
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
			Micro.AddaNeed_Admin._selPIN = new Microsoft.Maps.Pushpin(oCoords, {
					draggable : false
				});
			Micro.AddaNeed_Admin._interimMap.entities.push(Micro.AddaNeed_Admin._selPIN);
			Microsoft.Maps.Events.addHandler(Micro.AddaNeed_Admin._selPIN, 'dragend', Micro.AddaNeed_Admin.handlePinSelectionMove);
		}
		
		if (data.need.user_id) {
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.USERS.GET_BY_ID);
			Client.setData({
				uid : data.need.user_id
			});
			Client.setOkCallBack(Micro.AddaNeed_Admin.handleNeedUserDisplay);
			Client.Run();
			delete Client;
		}
		if (data.need.created) {
			var oDate = new Date(data.need.created.split(" ")[0]);
			var strPosted = 'Posted ' + Micro.Utils.strMonth(oDate.getMonth()) + ' ' + oDate.getDay();
			$('#ana_need_date_created').html(strPosted);
			delete oDate;
			delete strPosted;
		}
		
		/*
		Micro.handleNeedUpdateResponseOK(data);
		*/
	},
	
	setPageBar	:	function() {
		$('.section-breadcrumbs .left-side .title').html(Micro.BreadCrumbs.generate());
		//$('.section-breadcrumbs .right-side').html(C.PAGE_CLOSE_BUTTON);
	},

	setSideBarContent : function () {
		var html = '';
		html += '<div class="badge type-2">';
		html += '<h2 id="ana_need_category_name">Recycled Tech</h2>';
		html += '<div class="icon">?</div>';
		html += '<h3 id="ana_need_date_created"></h3>';
		html += '</div>';
		Micro.populateSideBar(html);
	},
	setNoteBookContent : function () {
		var html = '<div class="thumbnail need">';
		html += '<span class="photo type-2"><img id="ana_photo" width="240" height="240"></span>';
		html += '<div class="need_status_graph" id="' + Micro.url.get().n + '">';
		html += '<div class="check liked"></div>';
		html += '<div class="check shared"></div>';
		html += '<div class="check provided"></div>';
		html += '<div class="check delivered"></div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="details">';
		html += '<input type="text" readonly="readonly" class="need_name" name="need_name" id="ana_need_title" value="" />';
		html += '<div class="location"><span class="icon"></span><span class="city_state"></span></div>';
		html += '<nav id="nav-need">';
		html += '<h4>Need Activity</h4>';
		html += '<ul>';
		html += '<li class="nav-details on"><a href="javascript:void(0);" rel="details">Details</a></li>';
		html += '<li class="nav-thread"><a href="javascript:Micro.LoadPage(\'#need_thread?n=' + Micro.url.get().n + '\');"></a></li>';
		html += '<li class="nav-provision"><a href="javascript:Micro.LoadPage(\'#need_provision?n=' + Micro.url.get().n + '\');"></a></li>';
		html += '<li class="nav-delivery"><a href="javascript:Micro.LoadPage(\'#need_delivery?n=' + Micro.url.get().n + '\');"></a></li>';
		html += '<li class="nav-team"><a href="javascript:Micro.LoadPage(\'#need_team?n=' + Micro.url.get().n + '\');"></a></li>';
		html += '</ul>';
		html += '</nav>';
		html += '</div>';
		html += '<div class="pr_edit_btn need_edit_name"></div>';
		html += '<div class="pr_edit_btn_active_mode need_edit_name">';
		html += '<div class="save">Save</div>';
		html += '<div class="discard">Discard</div>';
		html += '</div>';
		Micro.populateNotebookView(html);
	},
	setMainContent : function () {
		
		/*
		var meta  = '<meta property="og:title" content="Microneeds" />';
			meta += '<meta property="og:type" content="company" />';
			meta += '<meta property="og:url" content="' + url+'#aneed_admin?n=' + Micro.AddaNeed_Admin._need + '" />';
			meta += '<meta property="og:image"content="' + url + 'img/home/featured_img_many_kids.jpg" />';
			meta += '<meta property="og:site_name" 	content="Microneeds" />';
			meta += '<meta property="og:description" content="MicroNeeds is an online social-engine for people to identify and fulfill \'micro\' global needs" />';
			meta += '<meta property="fb:admins" content="100000825160835" />'; */
		
		var html = '<aside class="header">';
			html += '<h2>Want to be the first to share this across the interwebs?</h2>';
			html += '<button class="default share_need" id="fb-share-need-owner-view" url="'+ url+'#aneed_admin?n=' + Micro.AddaNeed_Admin._need + '" content="">';
			html += 'Share This!';
			html += '</button>';
			html += '<span class="need_edit">Thanks, but I really need to <a href="javascript:void(0);" id="add_new_need">add another need.</a></span>';
			html += '<div class="fb_btn">';
				html += '<fb:like href="'+url+'#aneed_admin?n=' + Micro.AddaNeed_Admin._need + '" send="false" layout="button_count" width="50" show_faces="false" font="arial"></fb:like>'
			html += '</div>';
			html += '</aside>';
			html += '<section class="description">';
			html += '<h3 class="title">';
			html += 'Description';
			html += '<div class="pr_edit_btn need_edit_description"></div>';
			html += '<div class="pr_edit_btn_active_mode need_edit_description">';
			html += '<div class="save">Save</div>';
			html += '<div class="discard">Discard</div>';
			html += '</div>';
			html += '</h3>';
			html += '<div class="content anp">';
			html += '<textarea id="ana_description" readonly="readonly"></textarea>';
			html += '</div>';
			html += '</section>';
			html += '<section class="description">';
			html += '<h3 class="title">';
			html += 'Situation';
			html += '<div class="pr_edit_btn need_edit_situation"></div>';
			html += '<div class="pr_edit_btn_active_mode need_edit_situation">';
			html += '<div class="save">Save</div>';
			html += '<div class="discard">Discard</div>';
			html += '</div>';
			html += '</h3>';
			html += '<div class="content anp">';
			html += "<textarea id=\"ana_situation\" readonly=\"readonly\"><\/textarea>";
			html += '</div>';
			html += '</section>';
			html += '<section class="description">';
			html += '<h3 class="title">';
			html += 'Need Type';
			html += '<div class="pr_edit_btn need_edit_category"></div>';
			html += '<div class="pr_edit_btn_active_mode need_edit_category">';
			html += '<div class="save">Save</div>';
			html += '<div class="discard">Discard</div>';
			html += '</div>';
			html += '</h3>';
			html += "<div class=\"styled-select\">";
			html += "<div class=\"left\"></div>";
			html += "<div class=\"center\">";
			html += "<select id=\"ana_need_types\">";
			html += "<option value=\"\">Select a Category...<\/option>";
			html += "<\/select>";
			html += "<\/div>";
			html += "<div class=\"right\">";
			html += "<\/div>";
			html += "<\/div>";
			html += "<div class=\"clear\"><\/div>";
			html += "<\/section>";
			html += "<section class=\"content anp\">";
			html += '<h3 class="title">';
			html += 'Itemized List';
			html += '<div class="pr_edit_btn need_edit_items"></div>';
			html += '<div class="pr_edit_btn_active_mode need_edit_items">';
			html += '<div class="save">Save</div>';
			html += '<div class="discard">Discard</div>';
			html += '</div>';
			html += '</h3>';
			html += "<section class=\"edit inline\">";
			html += "<div class=\"container simple\" id=\"ana_items\"><\/div>";
			html += '<div class="addremove add add_item ana"></div>';
			html += "<\/section>";
			html += "<\/section>";
			html += "<section class=\"content anp\">";
			html += '<h3 class="title">';
			html += 'Destination';
			html += '<div class="pr_edit_btn need_edit_destination"></div>';
			html += '<div class="pr_edit_btn_active_mode need_edit_destination">';
			html += '<div class="save">Save</div>';
			html += '<div class="discard">Discard</div>';
			html += '</div>';
			html += '</h3>';
			html += "<div class=\"map edit\">";
			html += "<div class=\"container\" id=\"aneed_adm_map\"><\/div>";
			html += "<input type=\"text\" id=\"ana_address_text\" class=\"address non-editable address_suggestion_input\" readonly=\"readonly\" \/>";
			html += "<input type=\"hidden\" id=\"ana_need_geo\" \/>";
			html += "<input type=\"hidden\" id=\"ana_need_state\" \/>";
			html += "<input type=\"hidden\" id=\"ana_need_city\" \/>";
			html += "<\/div>";
			html += "<div class=\"address_suggestion_div\"><\/div>";
			html += "<\/div>";
			html += " <\/section>";
			html += '<section class="description profile-mini clearfix aneed_preview_bottom">';
			html += '<h3 class="title">';
			html += 'Originator';
			html += '</h3>';
			html += '<div class="profile-icon default-man"></div>';
			html += '<div class="content info">';
			html += '<h3><a href="" id="ana_user_fullname"></a></h3>';
			html += '<p id="ana_user_about">';
			html += '</p>';
			html += '<div class="clear"></div>';
			html += '<span class="date" id="ana_user_joined"></span>';
			html += '</div>';
			/*
			html += '<button class="default other_needs">';
			html += 'My Other Needs';
			html += '</button>';
			*/
			html += '</section>';
			
			Micro.populateMainContent(html);
	}
};
