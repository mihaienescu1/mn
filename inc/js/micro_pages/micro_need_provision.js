Micro.NeedProvision = {

	_pageName 		: 	'NeedProvision',
	_currentNeed	:	false,
	_pagingActivity : 0,
	_pagingComments : 0,
	_defaultActivityToShow : 3,
	_defaultCommentsToShow : 4,
	
	_history		:	false,
	_reloadInterval	:	8000,
	_reloadTimer	:	null,
	
	Init : function()
	{	
		if (Micro.url.get().n) {
			if (!Micro._currentUser) {
				Micro.USER.isLoggedWithSocialAPI('#profile', function (data) {
					if (data.id) {
						Micro._currentUser = data.id;
						Micro.NeedProvision.postInit();
					}
				});
			} else {
				Micro.NeedProvision.postInit();
			}
		}
		else{
			Micro.NeedProvision.Abandon();
		}
	},
	
	postInit : function () {
		Micro.NeedProvision._currentNeed = Micro.url.get().n;
		
		Micro.NeedProvision.setNoteBookContent();
		Micro.NeedProvision.setSideBarContent();
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.NEEDS.GET_BY_ID);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedProvision._currentNeed
			});
			Client.setOkCallBack(this.handleGetNeed);
			Client.Run();
		delete Client;
		
		$('#add_post').bind('click', Micro.NeedProvision.handleCommentAdd);
		$('.a_paging.activity').bind('click', Micro.NeedProvision.handlePagingActivityMain);
		$('#section-content-main').delegate('.provider_nomination', 'click', Micro.handleProvisionNomination);
		$('#section-content-main').delegate('.deliverer_nomination', 'click', Micro.handleDeliveryNomination);
		$('.activity_view').delegate('.show_more_sub', 'click', Micro.NeedProvision.handleReverseCommentLimits);
		$('.activity_view').delegate('.add_action.comment', 'click', Micro.NeedProvision.handleCommentClick);
		$('.activity_view').delegate('.add_action.like', 'click', Micro.NeedProvision.handleLikeClick);
		$('.activity_view').delegate('.add_action.unlike', 'click', Micro.NeedProvision.handleUnLikeClick);
		$('.activity_view').delegate('.add_action.delete', 'click', Micro.NeedProvision.handleDeletePost);
		$('.activity_view').delegate('.add_action.share', 'click', Micro.NeedProvision.handlePublish);
		$('.activity_view').delegate('.cm.view-like', 'click', Micro.NeedProvision.handleViewLikesClick);
		$('.activity_view').delegate('.cm.view-comments', 'click', Micro.NeedProvision.handleViewCommentClick);
		$('.activity_view').delegate('.comments_add_box', 'keyup', Micro.NeedProvision.handleAddComment);
		$('.activity_view').delegate('.icon.comments.like', 'click', Micro.NeedProvision.handleLikeClick);
		$('.activity_view').delegate('.icon.comments.comment', 'click', Micro.NeedProvision.handleCommentClick);
		$('.activity_view').delegate('.unlinke_thumbs', 'click', Micro.NeedProvision.handleUnLikeClick);
		$('.activity_view').delegate('.sub_comments_like', 'click', Micro.NeedProvision.handleSubCommentLike);
		$('.activity_view').delegate('.sub_comments_delete', 'click', Micro.NeedProvision.handleSubCommentDelete);
		$('.activity_view').delegate('.sub_comments_unlike', 'click', Micro.NeedProvision.handleSubCommentUnLike);
		
	},
	Abandon : function () {
	
		$('#add_post').unbind();
		$('.a_paging.activity').unbind();
		$('#section-content-main').undelegate('.provider_nomination', 'click');
		$('#section-content-main').undelegate('.deliverer_nomination', 'click');
		$('.activity_view').undelegate('.add_action.comment', 'click');
		$('.activity_view').undelegate('.add_action.like', 'click');
		$('.activity_view').undelegate('.add_action.unlike', 'click');
		$('.activity_view').undelegate('.add_action.delete', 'click');
		$('.activity_view').undelegate('.add_action.share', 'click');
		$('.activity_view').undelegate('.cm.view-like', 'click');
		$('.activity_view').undelegate('.cm.view-comments', 'click');
		$('.activity_view').undelegate('.comments_add_box', 'keyup');
		$('.activity_view').undelegate('.icon.comments.like', 'click');
		$('.activity_view').undelegate('.icon.comments.comment', 'click');
		$('.activity_view').undelegate('.unlinke_thumbs', 'click');
		$('.activity_view').undelegate('.sub_comments_like', 'click');
		$('.activity_view').undelegate('.sub_comments_delete', 'click');
		$('.activity_view').undelegate('.sub_comments_unlike', 'click');
		$('.show_more_sub').undelegate('.show_more_sub', 'click');
	},
	handleSubCommentLike : function () {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.LIKE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
		});
		Client.setOkCallBack(Micro.NeedProvision.handleSubCommentLikeSuccess);
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
		Client.setAjaxMethod(A.UserProvision.UNLIKE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
		});
		Client.setOkCallBack(Micro.NeedProvision.handleSubCommentUnLikeSuccess);
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
		var activity = $(this).attr('activity');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.DELETE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
			actid : activity
		});
		Client.setOkCallBack(Micro.NeedProvision.handleSubCommentDeleteSuccess);
		Client.Run();
		delete Client;
	},
	handleSubCommentDeleteSuccess : function (d) {
		if ("COMMENT_DELETED" === d.status) {
			$('.provision_comments .line[id=' + d.comment_id + ']').fadeOut("slow", function () {
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
				$('.comments_count_' + d.provision_id).html(text);
			} else {
				$('.icon.view-comments.cm[id=' + d.provision_id + ']').hide();
			}
		}
		Micro.NeedProvision.hasLikesOrComments(d.provision_id);
	},
	handlePublish : function () {
		var info = $(this).attr('rel');
		var provision_id = $(this).attr('id');
		var infoDiv = $('#publish_info_' + provision_id + ' input');
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
			oShare.caption = $('#pv_need_title').html();
			FB.ui(oShare, function (resp) {
				console.log(resp);
			});
		});
	},
	hasLikesOrComments : function (aid) {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.GET_LIKE_AND_COMMENTS_NUMBERS);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : aid,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedProvision.hasLikesOrCommentAction);
		Client.Run();
		delete Client;
	},
	hasLikesOrCommentAction : function (n) {
		var element = $('.comments-like[id=' + n.provision_id + ']');
		var intComments = parseInt(n.comments);
		var intLikes = parseInt(n.likes);
		if (0 == intComments && 0 === intLikes) {
			element.addClass('dontShow');
		}
	},
	handleDeletePost : function () {
		var provision_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.DELETE_ACTIVITY);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : provision_id,
			uid : Micro._currentUser,
			need_id : Micro.NeedProvision._currentNeed
		});
		Client.setOkCallBack(Micro.NeedProvision.handleDeletePostSuccess);
		Client.Run();
		delete Client;
	},
	handleDeletePostSuccess : function (d) {
		if ("POST_DELETED_OK" === d.status) {
			$('#section-need-comments-' + d.provision_id).fadeOut(800, function () {
				$(this).off().remove();
			});
		}
	},
	handleAddComment : function (e) {
		if (e.keyCode == 13 && $(this).val() && $(this).val() !== $(this).attr('default')) {
			var commentText = $(this).val();
			var provision_id = $(this).attr('id');
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.UserProvision.ADD_COMMENT);
			Client.setResponseGlue('JSON');
			Client.setData({
				actid : provision_id,
				uid : Micro._currentUser,
				cText : commentText
			});
			Client.setOkCallBack(Micro.NeedProvision.handleCommentAddSuccess);
			Client.Run();
			delete Client;
		}
	},
	handleCommentAddSuccess : function (response) {
		if ("COMMENT_ADDED" === response.status) {
			var provision_id = response.provision_id;
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.UserProvision.GET_COMMENTS);
			Client.setResponseGlue('JSON');
			Client.setData({
				actid : provision_id,
				uid : Micro._currentUser,
				limit : 0,
				offset : 1
			});
			Client.setOkCallBack(Micro.NeedProvision.handleCommentAppend);
			Client.Run();
			delete Client;
		}
	},
	handleCommentAppend : function (d) {
		$('#ac_' + d.provision_id).append(d.markup);
		$('#ac_' + d.provision_id).show();
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
			$('.comments_count_' + d.provision_id).html(text);
			$('.comments-like[id=' + d.provision_id + ']').removeClass('dontShow');
			$('.icon.view-comments.cm[id=' + d.provision_id + ']').removeClass('dontShow');
		} else {
			$('.icon.view-like.cm[id=' + d.provision_id + ']').hide();
		}
		$('.comments_add_box[id=' + d.provision_id + ']').val('');
		Micro.clearText();
	},
	handleViewLikesClick : function () {
		var provision_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.GET_LIKES);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : provision_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedProvision.handleDisplayLikes);
		Client.Run();
		delete Client;
	},
	handleDisplayLikes : function (d) {
		if (d.markup) {
			Micro.showOverlay('People who likes this activity', ' ', d.markup, false);
		}
	},
	handleViewCommentClick : function () {
		var provision_id = $(this).attr('id');
		var maxCount = parseInt($('.comments_count_' + provision_id).html());
		var startLimit,
		nextStart;
		if (maxCount < Micro.NeedProvision._defaultCommentsToShow) {
			startLimit = 0;
			nextStart = 0;
		} else {
			startLimit = maxCount - Micro.NeedProvision._defaultCommentsToShow;
			nextStart = startLimit - Micro.NeedProvision._defaultCommentsToShow;
		}
		$('.show_more_sub[id=' + provision_id + ']').attr('limit', nextStart);
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.GET_COMMENTS);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : provision_id,
			uid : Micro._currentUser,
			limit : startLimit,
			offset : Micro.NeedProvision._defaultCommentsToShow,
			order : 'ASC'
		});
		Client.setOkCallBack(Micro.NeedProvision.handleCommentsDisplay);
		Client.Run();
		delete Client;
	},
	handleReverseCommentLimits : function () {
		var provision_id = $(this).attr('id');
		var cLimit = $(this).attr('limit');
		var ofs = Micro.NeedProvision._defaultCommentsToShow;
		if (cLimit <= 0) {
			ofs = parseInt(ofs) + parseInt(cLimit);
			cLimit = 0;
		}
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.GET_COMMENTS);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : provision_id,
			uid : Micro._currentUser,
			limit : cLimit,
			offset : ofs,
			order : 'ASC'
		});
		Client.setOkCallBack(Micro.NeedProvision.handleCommentsLimitAppend);
		Client.Run();
		delete Client;
	},
	handleCommentsDisplay : function (d) {
		if (d.markup) {
			$('#ac_' + d.provision_id).html(d.markup);
		}
		$('#ac_' + d.provision_id).toggle();
		$('#cax_' + d.provision_id).toggle();
		if (d.total > Micro.NeedProvision._defaultCommentsToShow)
			$('.show_more_sub').show();
	},
	handleCommentsLimitAppend : function (c) {
		if ($('#ac_' + c.provision_id + ' div.line:first').length > 0) {
			$(c.markup).insertBefore($('#ac_' + c.provision_id + ' div.line:first'));
		} else {
			$('#ac_' + c.provision_id).append(c.markup);
		}
		var nextStart = c.limit - Micro.NeedProvision._defaultCommentsToShow;
		if (nextStart < 0) {
			$('.show_more_sub[id=' + c.provision_id + ']').fadeOut("fast");
		} else {
			$('.show_more_sub[id=' + c.provision_id + ']').attr('limit', nextStart);
		}
	},
	handleCommentClick : function () {
		var box_id = 'cax_' + $(this).attr('id');
		$('#' + box_id).toggle();
		$(this).toggleClass('active');
		$('.icon.comments.comment').toggleClass('on');
	},
	handleLikeClick : function () {
		var provision_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.LIKE);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : provision_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedProvision.handleActivityLikeSuccess);
		Client.Run();
		delete Client;
	},
	handleActivityLikeSuccess : function (d) {
		var isHidden = $('.comments-like[id=' + d.provision_id + ']').hasClass('dontShow');
		var p = d.total + ' People';
		if (isHidden) {
			$('.comments-like[id=' + d.provision_id + ']').removeClass('dontShow');
			$('.icon.view-like[id=' + d.provision_id + ']').removeClass('dontShow');
			$('.likes_count_' + d.provision_id).html(p).removeClass('dontShow');
		} else {
			$('.icon.view-like[id=' + d.provision_id + ']').removeClass('dontShow');
			$('.likes_count_' + d.provision_id).html(p).removeClass('dontShow');
		}
		var likeLink = $('.add_action.like.first');
		var unlikeLink = '<a href="javascript:void(0);" class="add_action unlike first" id="' + d.provision_id + '">UnLike</a>';
		likeLink.fadeOut("fast", function () {
			$(unlikeLink).insertAfter($(this));
			$(this).off().remove();
			$('.icon.comments.like').addClass('on');
		});
	},
	handleUnLikeClick : function () {
		var provision_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.UNLIKE);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : provision_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedProvision.handleActivityUnLikeSuccess);
		Client.Run();
		delete Client;
	},
	handleActivityUnLikeSuccess : function (d) {
		var p = d.total + ' People';
		if (d.total == 0) {
			$('.icon.view-like[id=' + d.provision_id + ']').addClass('dontShow');
			$('.likes_count_' + d.provision_id).html(p).addClass('dontShow');
		} else {
			$('.likes_count_' + d.provision_id).html(p);
		}
		var unLikeLink = $('.add_action.unlike.first');
		var likeLink = '<a href="javascript:void(0);" class="add_action like first" id="' + d.provision_id + '">Like</a>';
		unLikeLink.fadeOut("fast", function () {
			$(likeLink).insertAfter($(this));
			$(this).off().remove();
			$('.icon.comments.like').removeClass('on');
		});
		Micro.NeedProvision.hasLikesOrComments(d.provision_id);
	},
	fetchNeedUserProvision : function (limit, offset) {
		l = limit || 0;
		o = offset || Micro.NeedProvision._defaultActivityToShow;
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.UserProvision.GET_BY_NEED);
		Client.setResponseGlue('JSON');
		Client.setData({
			need_id : Micro.NeedProvision._currentNeed,
			user_id : Micro._currentUser,
			limit : l,
			offset : o
		});
		Client.setOkCallBack(Micro.NeedProvision.handleActivityDisplay);
		Client.Run();
		delete Client;
	},
	handleActivityDisplay : function (d) {
		if ("OK" === d.status) {
			if (d.rows > Micro.NeedProvision._defaultActivityToShow) {
				Micro.NeedProvision._pagingActivity = parseInt(d.limit) + Micro.NeedProvision._defaultActivityToShow;
				$('.a_paging.activity').show();
				if (Micro.NeedProvision._pagingActivity >= parseInt(d.rows)) {
					$('.a_paging.activity').hide();
				}
				$('.activity_view').append(d.activity_html);
			} else {
				$('.activity_view').html(d.activity_html);
			}
			Micro.clearText();
		}
	},
	handlePagingActivityMain : function () {
		Micro.NeedProvision.fetchNeedUserProvision(Micro.NeedProvision._pagingActivity, Micro.NeedProvision._defaultActivityToShow);
	},
	handleCommentAdd : function () {
		var commented = $('#conversation_comment').val() === $('#conversation_comment').attr('default') ? false : $('#conversation_comment').val();
		if (commented) {
			var Client = new AjaxFramework.Client();
				Client.setAjaxMethod(A.UserProvision.ADD);
				Client.setResponseGlue('JSON');
				Client.setData({
					need_id : Micro.NeedProvision._currentNeed,
					user_id : Micro._currentUser,
					content : commented
				});
				Client.setOkCallBack(Micro.NeedProvision.handleAddPostResponseBack);
				Client.Run();
			delete Client;
		}
	},
	handleAddPostResponseBack : function (d) {
		
		if ("POST_ADDED_OK" === d.status) {
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.UserProvision.GET_BY_NEED);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedProvision._currentNeed,
				user_id : Micro._currentUser,
				limit : 0,
				offset : 1
			});
			Client.setOkCallBack(Micro.NeedProvision.handleAddPostResponseOK);
			Client.Run();
			delete Client;
		}
	},
	handleAddPostResponseOK : function (d) {
		if ($('section.activity_view section:first-child').length < 1)
			$('.activity_view').append(d.activity_html);
		else
			$(d.activity_html).insertBefore('section.activity_view section:first-child');
	},
	
	handleGetNeed : function (d) {
		
		$('#pv_need_desc').val(d.need.description);
		$('#pv_need_title').html(d.need.title || "");
		$('#pv_need_cat_title').html(d.need.type_label || "");
		$('#pv_icon_type').attr('class', 'icon category ' + d.need.type_label.replace(" ", "").toLowerCase());
		$('#pv_need_photo').attr('src', url + 'photos/needs/' + d.need.photo);
		
		Micro.geo.getAddressArrayByAddressString(d.need.location, function (oAddr) {
			var cityStateStr = oAddr.locality + ', ' + oAddr.administrative_area_level_1;
			$('#pv_location_text').html(cityStateStr || "");
		});
		var oDate = new Date(d.need.created.split(" ")[0]);
		var strPosted = 'Posted ' + Micro.Utils.strMonth(oDate.getMonth()) + ' ' + oDate.getDay();
		$('#pv_need_creation_date').html(strPosted);	
		
		var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.UserProvision.GET_SIDEBAR_CONTENT);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedProvision._currentNeed,
				user_id : Micro._currentUser,
			});
			Client.setOkCallBack(Micro.NeedProvision.setMainContent);
			Client.Run();
		delete Client;
		delete oDate;
		delete strPosted;
	},
	
	setNoteBookContent : function ()
	{
		var html = '<div class="thumbnail need">';
			html += '<span class="photo type-2">';
			html += '<img src="" alt="" title="" width="240" height="240" id="pv_need_photo">';
			html += '</span>';
			html += '<div class="need_status_graph" id="">';
				html += '<div class="check liked"></div>';
				html += '<div class="check shared"></div>';
				html += '<div class="check provided"></div>';
				html += '<div class="check delivered"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="details">';
			html += '<h2><a href="javascript:void(0);" id="pv_need_title"></a></h2>';
			html += '<div class="location"><span class="icon"></span><span id="pv_location_text"></span></div>';
			html += '<nav id="nav-need">';
			html += '<h4>Need Activity</h4>';
				html += '<ul>';
					html += '<li class="nav-details"><a href="javascript:Micro.LoadPage(\'#aneed_admin?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-thread"><a href="javascript:Micro.LoadPage(\'#need_thread?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-provision on"><a href="javascript:void(0);"></a></li>';
					html += '<li class="nav-delivery"><a href="javascript:Micro.LoadPage(\'#need_delivery?n=' + Micro.url.get().n + '\');"></a></li>';
					html += '<li class="nav-team"><a href="javascript:Micro.LoadPage(\'#need_team?n=' + Micro.url.get().n + '\');"></a></li>';
				html += '</ul>';
			html += '</nav>';
			html += '</div>';
			html += '<input type="hidden" id="pv_need_desc" value="">';
		
		Micro.populateNotebookView(html);
		Micro.setNotebookView(true);
	},
	
	setSideBarContent : function () {
		var html = '<div class="badge type-2">';
			html += '<h2 id="pv_need_cat_title"></h2>';
			html += '<span class="icon" id="pv_icon_type"></span>';
			html += '<h3 id="pv_need_creation_date"></h3>';
			html += '</div>';
		Micro.populateSideBar(html);
	},
	
	setPageBar	:	function() {
		var dynNav = Micro.BreadCrumbs.generate();
		$('.section-breadcrumbs .left-side .title').html( dynNav );
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
			var metaData = url + '#aneed_admin?n='+Micro.NeedProvision._currentNeed;
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