Micro.NeedDelivery = {
	_pageName : 'NeedDelivery',
	_currentNeed : false,
	_pagingdelivery : 0,
	_pagingComments : 0,
	_defaultdeliveryToShow : 3,
	_defaultCommentsToShow : 4,
	Init : function () {
		if (Micro.url.get().n) {
			if (!Micro._currentUser) {
				Micro.USER.isLoggedWithSocialAPI('#profile', function (data) {
					if (data.id) {
						Micro._currentUser = data.id;
						Micro.NeedDelivery.postInit();
					}
				});
			} else {
				Micro.NeedDelivery.postInit();
			}
		} else {
			Micro.NeedDelivery.Abandon();
		}
	},
	postInit : function () {
	
		Micro.NeedDelivery._currentNeed = Micro.url.get().n;
		
		Micro.NeedDelivery.setNoteBookContent();
		Micro.NeedDelivery.setSideBarContent();
		
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NEEDS.GET_BY_ID);
		Client.setResponseGlue('JSON');
		Client.setData({
			need_id : Micro.NeedDelivery._currentNeed
		});
		Client.setOkCallBack(this.handleGetNeed);
		Client.Run();
		delete Client;
		$('#add_post').bind('click', Micro.NeedDelivery.handleCommentAdd);
		$('.a_paging.delivery').bind('click', Micro.NeedDelivery.handlePagingdeliveryMain);
		$('#section-content-main').delegate('.provider_nomination', 'click', Micro.handleProvisionNomination);
		$('#section-content-main').delegate('.deliverer_nomination', 'click', Micro.handleDeliveryNomination);
		$('.delivery_view').delegate('.show_more_sub', 'click', Micro.NeedDelivery.handleReverseCommentLimits);
		$('.delivery_view').delegate('.add_action.comment', 'click', Micro.NeedDelivery.handleCommentClick);
		$('.delivery_view').delegate('.add_action.like', 'click', Micro.NeedDelivery.handleLikeClick);
		$('.delivery_view').delegate('.add_action.unlike', 'click', Micro.NeedDelivery.handleUnLikeClick);
		$('.delivery_view').delegate('.add_action.delete', 'click', Micro.NeedDelivery.handleDeletePost);
		$('.delivery_view').delegate('.add_action.share', 'click', Micro.NeedDelivery.handlePublish);
		$('.delivery_view').delegate('.cm.view-like', 'click', Micro.NeedDelivery.handleViewLikesClick);
		$('.delivery_view').delegate('.cm.view-comments', 'click', Micro.NeedDelivery.handleViewCommentClick);
		$('.delivery_view').delegate('.comments_add_box', 'keyup', Micro.NeedDelivery.handleAddComment);
		$('.delivery_view').delegate('.icon.comments.like', 'click', Micro.NeedDelivery.handleLikeClick);
		$('.delivery_view').delegate('.icon.comments.comment', 'click', Micro.NeedDelivery.handleCommentClick);
		$('.delivery_view').delegate('.unlinke_thumbs', 'click', Micro.NeedDelivery.handleUnLikeClick);
		$('.delivery_view').delegate('.sub_comments_like', 'click', Micro.NeedDelivery.handleSubCommentLike);
		$('.delivery_view').delegate('.sub_comments_delete', 'click', Micro.NeedDelivery.handleSubCommentDelete);
		$('.delivery_view').delegate('.sub_comments_unlike', 'click', Micro.NeedDelivery.handleSubCommentUnLike);
		
	},
	Abandon : function () {
		$('#add_post').unbind();
		$('.a_paging.delivery').unbind();
		$('#section-content-main').undelegate('.provider_nomination', 'click');
		$('#section-content-main').undelegate('.deliverer_nomination', 'click');
		$('.delivery_view').undelegate('.add_action.comment', 'click');
		$('.delivery_view').undelegate('.add_action.like', 'click');
		$('.delivery_view').undelegate('.add_action.unlike', 'click');
		$('.delivery_view').undelegate('.add_action.delete', 'click');
		$('.delivery_view').undelegate('.add_action.share', 'click');
		$('.delivery_view').undelegate('.cm.view-like', 'click');
		$('.delivery_view').undelegate('.cm.view-comments', 'click');
		$('.delivery_view').undelegate('.comments_add_box', 'keyup');
		$('.delivery_view').undelegate('.icon.comments.like', 'click');
		$('.delivery_view').undelegate('.icon.comments.comment', 'click');
		$('.delivery_view').undelegate('.unlinke_thumbs', 'click');
		$('.delivery_view').undelegate('.sub_comments_like', 'click');
		$('.delivery_view').undelegate('.sub_comments_delete', 'click');
		$('.delivery_view').undelegate('.sub_comments_unlike', 'click');
		$('.show_more_sub').undelegate('.show_more_sub', 'click');
	},
	handleSubCommentLike : function () {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.LIKE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
		});
		Client.setOkCallBack(Micro.NeedDelivery.handleSubCommentLikeSuccess);
		Client.Run();
		delete Client;
	},
	handleSubCommentLikeSuccess : function (d) {
		var likeLine = $('.sub_comments_like[rel=' + d.comment_id + ']');
		var unLikeLine = '<a href="javascript:void(0);" class="sub_comments_unlike" rel="' + d.comment_id + '">UnLike</a>';
		likeLine.fadeOut("fast", function () {
			$(unLikeLine).insertAfter($(this));
			$(this).off().remove();
		});
	},
	handleSubCommentUnLike : function () {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.UNLIKE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
		});
		Client.setOkCallBack(Micro.NeedDelivery.handleSubCommentUnLikeSuccess);
		Client.Run();
		delete Client;
	},
	handleSubCommentUnLikeSuccess : function (d) {
		var unLikeLine = $('.sub_comments_unlike[rel=' + d.comment_id + ']');
		var likeLine = '<a href="javascript:void(0);" class="sub_comments_like" rel="' + d.comment_id + '">Like</a>';
		unLikeLine.fadeOut("fast", function () {
			$(likeLine).insertAfter($(this));
			$(this).off().remove();
		});
	},
	handleSubCommentDelete : function () {
		var delivery = $(this).attr('delivery');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.DELETE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
			delivery_id : delivery
		});
		Client.setOkCallBack(Micro.NeedDelivery.handleSubCommentDeleteSuccess);
		Client.Run();
		delete Client;
	},
	handleSubCommentDeleteSuccess : function (d) {
		if ("COMMENT_DELETED" === d.status) {
			$('.delivery_comments .line[id=' + d.comment_id + ']').fadeOut("slow", function () {
				$(this).off().remove();
			});
			if (d.total > 0) {
				var text = null;
				switch (d.total) {
				case 1:
					text = d.total + ' Comment';
					break
				default:
					text = d.total + ' Comments';
					break;
				}
				$('.comments_count_' + d.delivery_id).html(text);
			} else {
				$('.icon.view-comments.cm[id=' + d.delivery_id + ']').hide();
			}
		}
		Micro.NeedDelivery.hasLikesOrComments(d.delivery_id);
	},
	handlePublish : function () {
		var info = $(this).attr('rel');
		var delivery_id = $(this).attr('id');
		var infoDiv = $('#publish_info_' + delivery_id + ' input');
		var oShare = {};
		$.each(infoDiv, function (i, v) {
			oShare[$(this).attr('name')] = $(this).val();
		});
		oShare.method = "feed";
		oShare.link = document.URL;
		Micro.USER.getLoggedUserWithFacebook(function (u) {
			var fname = u.firsname;
			var lname = u.lastname;
			var fullname = u.firstname + ' ' + u.lastname;
			var strTitle = null;
			var gender = u.gender;
			var isMe = oShare.name + '\'s';
			if (oShare.user_id == u.id)
				isMe = u.gender == "male" ? 'his' : 'her';
			switch (oShare.type) {
			case 'COMMENT':
				oShare.name = fullname + ' shared ' + isMe + ' comment on this Microneed';
				break;
			case 'SHARE_LINK':
				oShare.name = fullname + ' shared ' + isMe + ' link on this Microneed';
				break;
			}
			oShare.caption = $('#dv_need_title').html();
			FB.ui(oShare, function (resp) {
				console.log(resp);
			});
		});
	},
	hasLikesOrComments : function (aid) {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.GET_LIKE_AND_COMMENTS_NUMBERS);
		Client.setResponseGlue('JSON');
		Client.setData({
			nid : aid,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedDelivery.hasLikesOrCommentAction);
		Client.Run();
		delete Client;
	},
	hasLikesOrCommentAction : function (n) {
		var element = $('.comments-like[id=' + n.delivery_id + ']');
		var intComments = parseInt(n.comments);
		var intLikes = parseInt(n.likes);
		if (0 == intComments && 0 === intLikes) {
			element.addClass('dontShow');
		}
	},
	handleDeletePost : function () {
		var delivery_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.DELETE_DELIVERY);
		Client.setResponseGlue('JSON');
		Client.setData({
			delivery_id : delivery_id,
			uid : Micro._currentUser,
			need_id : Micro.NeedDelivery._currentNeed
		});
		Client.setOkCallBack(Micro.NeedDelivery.handleDeletePostSuccess);
		Client.Run();
		delete Client;
	},
	handleDeletePostSuccess : function (d) {
		if ("POST_DELETED_OK" === d.status) {
			$('#section-need-comments-' + d.delivery_id).fadeOut(800, function () {
				$(this).off().remove();
			});
		}
	},
	handleAddComment : function (e) {
		if (e.keyCode == 13 && $(this).val() && $(this).val() !== $(this).attr('default')) {
			var commentText = $(this).val();
			var delivery_id = $(this).attr('id');
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NeedDelivery.ADD_COMMENT);
			Client.setResponseGlue('JSON');
			Client.setData({
				delivery_id : delivery_id,
				uid : Micro._currentUser,
				cText : commentText
			});
			Client.setOkCallBack(Micro.NeedDelivery.handleCommentAddSuccess);
			Client.Run();
			delete Client;
		}
	},
	handleCommentAddSuccess : function (response) {
		if ("COMMENT_ADDED" === response.status) {
			var delivery_id = response.delivery_id;
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NeedDelivery.GET_COMMENTS);
			Client.setResponseGlue('JSON');
			Client.setData({
				delivery_id : delivery_id,
				uid : Micro._currentUser,
				limit : 0,
				offset : 1
			});
			Client.setOkCallBack(Micro.NeedDelivery.handleCommentAppend);
			Client.Run();
			delete Client;
		}
	},
	handleCommentAppend : function (d) {
		$('#ac_' + d.delivery_id).append(d.markup);
		$('#ac_' + d.delivery_id).show();
		if (d.total > 0) {
			var text = null;
			switch (d.total) {
			case 1:
				text = d.total + ' Comment';
				break
			default:
				text = d.total + ' Comments';
				break;
			}
			$('.comments_count_' + d.delivery_id).html(text);
			$('.comments-like[id=' + d.delivery_id + ']').removeClass('dontShow');
			$('.icon.view-comments.cm[id=' + d.delivery_id + ']').removeClass('dontShow');
		} else {
			$('.icon.view-like.cm[id=' + d.delivery_id + ']').hide();
		}
		$('.comments_add_box[id=' + d.delivery_id + ']').val('');
		Micro.clearText();
	},
	handleViewLikesClick : function () {
		var delivery_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.GET_LIKES);
		Client.setResponseGlue('JSON');
		Client.setData({
			delivery_id : delivery_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedDelivery.handleDisplayLikes);
		Client.Run();
		delete Client;
	},
	handleDisplayLikes : function (d) {
		if (d.markup) {
			Micro.showOverlay('People who likes this delivery', ' ', d.markup, false);
		}
	},
	handleViewCommentClick : function () {
		var delivery_id = $(this).attr('id');
		var maxCount = parseInt($('.comments_count_' + delivery_id).html());
		var startLimit,
		nextStart;
		if (maxCount < Micro.NeedDelivery._defaultCommentsToShow) {
			startLimit = 0;
			nextStart = 0;
		} else {
			startLimit = maxCount - Micro.NeedDelivery._defaultCommentsToShow;
			nextStart = startLimit - Micro.NeedDelivery._defaultCommentsToShow;
		}
		$('.show_more_sub[id=' + delivery_id + ']').attr('limit', nextStart);
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.GET_COMMENTS);
		Client.setResponseGlue('JSON');
		Client.setData({
			delivery_id : delivery_id,
			uid : Micro._currentUser,
			limit : startLimit,
			offset : Micro.NeedDelivery._defaultCommentsToShow,
			order : 'ASC'
		});
		Client.setOkCallBack(Micro.NeedDelivery.handleCommentsDisplay);
		Client.Run();
		delete Client;
	},
	handleReverseCommentLimits : function () {
		var delivery_id = $(this).attr('id');
		var cLimit = $(this).attr('limit');
		var ofs = Micro.NeedDelivery._defaultCommentsToShow;
		if (cLimit <= 0) {
			ofs = parseInt(ofs) + parseInt(cLimit);
			cLimit = 0;
		}
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.GET_COMMENTS);
		Client.setResponseGlue('JSON');
		Client.setData({
			delivery_id : delivery_id,
			uid : Micro._currentUser,
			limit : cLimit,
			offset : ofs,
			order : 'ASC'
		});
		Client.setOkCallBack(Micro.NeedDelivery.handleCommentsLimitAppend);
		Client.Run();
		delete Client;
	},
	handleCommentsDisplay : function (d) {
		if (d.markup) {
			$('#ac_' + d.delivery_id).html(d.markup);
		}
		
		$('#ac_' + d.delivery_id).toggle();
		$('#cax_' + d.delivery_id).toggle();
		if (d.total > Micro.NeedDelivery._defaultCommentsToShow)
			$('.show_more_sub').show();
	},
	handleCommentsLimitAppend : function (c) {
		if ($('#ac_' + c.delivery_id + ' div.line:first').length > 0) {
			$(c.markup).insertBefore($('#ac_' + c.delivery_id + ' div.line:first'));
		} else {
			$('#ac_' + c.delivery_id).append(c.markup);
		}
		var nextStart = c.limit - Micro.NeedDelivery._defaultCommentsToShow;
		if (nextStart < 0) {
			$('.show_more_sub[id=' + c.delivery_id + ']').fadeOut("fast");
		} else {
			$('.show_more_sub[id=' + c.delivery_id + ']').attr('limit', nextStart);
		}
	},
	handleCommentClick : function () {
		var box_id = 'cax_' + $(this).attr('id');
		$('#' + box_id).toggle();
		$(this).toggleClass('active');
		$('.icon.comments.comment').toggleClass('on');
	},
	handleLikeClick : function () {
		var delivery_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.LIKE);
		Client.setResponseGlue('JSON');
		Client.setData({
			delivery_id : delivery_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedDelivery.handledeliveryLikeSuccess);
		Client.Run();
		delete Client;
	},
	handledeliveryLikeSuccess : function (d) {
		var isHidden = $('.comments-like[id=' + d.delivery_id + ']').hasClass('dontShow');
		var p = d.total + ' People';
		if (isHidden) {
			$('.comments-like[id=' + d.delivery_id + ']').removeClass('dontShow');
			$('.icon.view-like[id=' + d.delivery_id + ']').removeClass('dontShow');
			$('.likes_count_' + d.delivery_id).html(p).removeClass('dontShow');
		} else {
			$('.icon.view-like[id=' + d.delivery_id + ']').removeClass('dontShow');
			$('.likes_count_' + d.delivery_id).html(p).removeClass('dontShow');
		}
		var likeLink = $('.add_action.like.first');
		var unlikeLink = '<a href="javascript:void(0);" class="add_action unlike first" id="' + d.delivery_id + '">UnLike</a>';
		likeLink.fadeOut("fast", function () {
			$(unlikeLink).insertAfter($(this));
			$(this).off().remove();
			$('.icon.comments.like').addClass('on');
		});
	},
	handleUnLikeClick : function () {
		var delivery_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.UNLIKE);
		Client.setResponseGlue('JSON');
		Client.setData({
			delivery_id : delivery_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedDelivery.handledeliveryUnLikeSuccess);
		Client.Run();
		delete Client;
	},
	handledeliveryUnLikeSuccess : function (d) {
		var p = d.total + ' People';
		if (d.total == 0) {
			$('.icon.view-like[id=' + d.delivery_id + ']').addClass('dontShow');
			$('.likes_count_' + d.delivery_id).html(p).addClass('dontShow');
		} else {
			$('.likes_count_' + d.delivery_id).html(p);
		}
		var unLikeLink = $('.add_action.unlike.first');
		var likeLink = '<a href="javascript:void(0);" class="add_action like first" id="' + d.delivery_id + '">Like</a>';
		unLikeLink.fadeOut("fast", function () {
			$(likeLink).insertAfter($(this));
			$(this).off().remove();
			$('.icon.comments.like').removeClass('on');
		});
		Micro.NeedDelivery.hasLikesOrComments(d.delivery_id);
	},
	fetchNeedNeedDelivery : function (limit, offset) {
		l = limit || 0;
		o = offset || Micro.NeedDelivery._defaultdeliveryToShow;
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NeedDelivery.GET_BY_NEED);
		Client.setResponseGlue('JSON');
		Client.setData({
			need_id : Micro.NeedDelivery._currentNeed,
			user_id : Micro._currentUser,
			limit : l,
			offset : o
		});
		Client.setOkCallBack(Micro.NeedDelivery.handledeliveryDisplay);
		Client.Run();
		delete Client;
	},
	handledeliveryDisplay : function (d) {
		if ("OK" === d.status) {
			if (d.rows > Micro.NeedDelivery._defaultdeliveryToShow) {
				Micro.NeedDelivery._pagingdelivery = parseInt(d.limit) + Micro.NeedDelivery._defaultdeliveryToShow;
				$('.a_paging.delivery').show();
				if (Micro.NeedDelivery._pagingdelivery >= parseInt(d.rows)) {
					$('.a_paging.delivery').hide();
				}
				$('.delivery_view').append(d.delivery_html);
			} else {
				$('.delivery_view').html(d.delivery_html);
			}
			Micro.clearText();
		}
	},
	handlePagingdeliveryMain : function () {
		Micro.NeedDelivery.fetchNeedNeedDelivery(Micro.NeedDelivery._pagingdelivery, Micro.NeedDelivery._defaultdeliveryToShow);
	},
	handleCommentAdd : function () {
		var commented = $('#conversation_comment').val() === $('#conversation_comment').attr('default') ? false : $('#conversation_comment').val();
		if (commented) {
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NeedDelivery.ADD);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedDelivery._currentNeed,
				user_id : Micro._currentUser,
				content : commented
			});
			Client.setOkCallBack(Micro.NeedDelivery.handleAddPostResponseBack);
			Client.Run();
			delete Client;
		}
	},
	handleAddPostResponseBack : function (d) {
		if ("POST_ADDED_OK" === d.status) {
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NeedDelivery.GET_BY_NEED);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedDelivery._currentNeed,
				user_id : Micro._currentUser,
				limit : 0,
				offset : 1
			});
			Client.setOkCallBack(Micro.NeedDelivery.handleAddPostResponseOK);
			Client.Run();
			delete Client;
		}
	},
	handleAddPostResponseOK : function (d) {
		if ($('section.delivery_view section:first-child').length < 1)
			$('.delivery_view').append(d.delivery_html);
		else
			$(d.delivery_html).insertBefore('section.delivery_view section:first-child');
	},
	handleGetNeed : function (d) {
		
		$('#dv_need_title').html(d.need.title || "");
		$('#dv_need_cat_title').html(d.need.type_label || "");
		$('#dv_icon_type').attr('class', 'icon category ' + d.need.type_label.replace(" ", "").toLowerCase());
		$('#dv_need_photo').attr('src', url + 'photos/needs/' + d.need.photo);
		Micro.geo.getAddressArrayByAddressString(d.need.location, function (oAddr) {
			var cityStateStr = oAddr.locality + ', ' + oAddr.administrative_area_level_1;
			$('#dv_location_text').html(cityStateStr || "");
		});
		
		var oDate = new Date(d.need.created.split(" ")[0]);
		var strPosted = 'Posted ' + Micro.Utils.strMonth(oDate.getMonth()) + ' ' + oDate.getDay();
		$('#dv_need_creation_date').html(strPosted);
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NeedDelivery.GET_SIDEBAR_CONTENT);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedDelivery._currentNeed,
				user_id : Micro._currentUser,
			});
			Client.setOkCallBack(Micro.NeedDelivery.setMainContent);
			Client.Run();
		delete Client;
		delete oDate;
		delete strPosted;
		
	},
	
	setNoteBookContent : function () 
	{
		var html = '<div class="thumbnail need">';
			html += '<span class="photo type-2">';
			html += '<img src="" alt="" title="" width="240" height="240" id="dv_need_photo">';
			html += '</span>';
			html += '<div class="need_status_graph" id="' + Micro.url.get().n + '">';
				html += '<div class="check liked"></div>';
				html += '<div class="check shared"></div>';
				html += '<div class="check provided"></div>';
				html += '<div class="check delivered"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="details">';
			html += '<h2><a href="javascript:void(0);" id="dv_need_title"></a></h2>';
			html += '<div class="location"><span class="icon"></span><span id="dv_location_text"></span></div>';
			html += '<nav id="nav-need">';
			html += '<h4>Need delivery</h4>';
				html += '<ul>';
					html += '<li class="nav-details"><a href="javascript:Micro.LoadPage(\'#aneed_admin?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-thread"><a href="javascript:Micro.LoadPage(\'#need_thread?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-provision"><a href="javascript:Micro.LoadPage(\'#need_provision?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-delivery on"><a href="javascript:void(0);"></a></li>';
					html += '<li class="nav-team"><a href="javascript:Micro.LoadPage(\'#need_team?n=' + Micro.url.get().n + '\');"></a></li>';
				html += '</ul>';
			html += '</nav>';
			html += '</div>';
		
		Micro.populateNotebookView(html);
		Micro.setNotebookView(true);
	},
	
	setSideBarContent : function () {
		var html = '<div class="badge type-2">';
			html += '<h2 id="dv_need_cat_title"></h2>';
			html += '<span class="icon" id="dv_icon_type"></span>';
			html += '<h3 id="dv_need_creation_date"></h3>';
			html += '</div>';
		Micro.populateSideBar(html);
	},
	
	setMainContent : function (oContent) {
		Micro.populateMainContent(oContent.markup);
	},
	
	handleFBPublish : function () {

		var info = {
			method 		: 'feed',
			name 		: $('#pv_need_title').html(),
			link 		: $('.a_share_dv').attr('url'),
			picture 	: $('#pv_need_photo').attr('src'),
			caption 	: $('.a_share_dv').attr('content'),
			description : $('#pv_need_desc').val()
		};
		FB.ui(info, Micro.NeedProvision.postCallBack);
	},
	
	postCallBack : function (response) {
		if (response && response.post_id) {
			
			var who = Micro._currentUser;
			var metaData = 'http://dev.microneeds.com/#aneed_admin?n='+Micro.NeedProvision._currentNeed;
			var need = Micro.NeedProvision._currentNeed;
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
	}
	
};