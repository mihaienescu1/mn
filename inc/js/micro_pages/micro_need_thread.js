Micro.NeedThread = {
	_pageName : 'NeedThread',
	_currentNeed : false,
	_pagingActivity : 0,
	_pagingComments : 0,
	_defaultActivityToShow : 3,
	_defaultCommentsToShow : 4,
	Init : function () {
		if (Micro.url.get().n) {
			if (!Micro._currentUser) {
				Micro.USER.isLoggedWithSocialAPI('#profile', function (data) {
					if (data.id) {
						Micro._currentUser = data.id;
						Micro.NeedThread.postInit();
					}
				});
			} else {
				Micro.NeedThread.postInit();
			}
		} else {
			Micro.NeedThread.Abandon();
		}
	},
	postInit : function () {
		Micro.NeedThread.setNoteBookContent();
		Micro.NeedThread.setSideBarContent();
		Micro.NeedThread.setMainContent();
		Micro.NeedThread._currentNeed = Micro.url.get().n;
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.NEEDS.GET_BY_ID);
		Client.setResponseGlue('JSON');
		Client.setData({
			need_id : Micro.NeedThread._currentNeed
		});
		Client.setOkCallBack(this.handleGetNeed);
		Client.Run();
		delete Client;
		$('#add_post').bind('click', Micro.NeedThread.handleCommentAdd);
		$('.a_paging.activity').bind('click', Micro.NeedThread.handlePagingActivityMain);
		$('#section-content-main').delegate('.provider_nomination', 'click', Micro.handleProvisionNomination);
		$('#section-content-main').delegate('.deliverer_nomination', 'click', Micro.handleDeliveryNomination);
		$('.activity_view').delegate('.show_more_sub', 'click', Micro.NeedThread.handleReverseCommentLimits);
		$('.activity_view').delegate('.add_action.comment', 'click', Micro.NeedThread.handleCommentClick);
		$('.activity_view').delegate('.add_action.like', 'click', Micro.NeedThread.handleLikeClick);
		$('.activity_view').delegate('.add_action.unlike', 'click', Micro.NeedThread.handleUnLikeClick);
		$('.activity_view').delegate('.add_action.delete', 'click', Micro.NeedThread.handleDeletePost);
		$('.activity_view').delegate('.add_action.share', 'click', Micro.NeedThread.handlePublish);
		$('.activity_view').delegate('.cm.view-like', 'click', Micro.NeedThread.handleViewLikesClick);
		$('.activity_view').delegate('.cm.view-comments', 'click', Micro.NeedThread.handleViewCommentClick);
		$('.activity_view').delegate('.comments_add_box', 'keyup', Micro.NeedThread.handleAddComment);
		$('.activity_view').delegate('.icon.comments.like', 'click', Micro.NeedThread.handleLikeClick);
		$('.activity_view').delegate('.icon.comments.comment', 'click', Micro.NeedThread.handleCommentClick);
		$('.activity_view').delegate('.unlinke_thumbs', 'click', Micro.NeedThread.handleUnLikeClick);
		$('.activity_view').delegate('.sub_comments_like', 'click', Micro.NeedThread.handleSubCommentLike);
		$('.activity_view').delegate('.sub_comments_delete', 'click', Micro.NeedThread.handleSubCommentDelete);
		$('.activity_view').delegate('.sub_comments_unlike', 'click', Micro.NeedThread.handleSubCommentUnLike);
		
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
		Client.setAjaxMethod(A.ACTIVITIES.LIKE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
		});
		Client.setOkCallBack(Micro.NeedThread.handleSubCommentLikeSuccess);
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
		Client.setAjaxMethod(A.ACTIVITIES.UNLIKE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
		});
		Client.setOkCallBack(Micro.NeedThread.handleSubCommentUnLikeSuccess);
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
		Client.setAjaxMethod(A.ACTIVITIES.DELETE_COMMENT);
		Client.setResponseGlue('JSON');
		Client.setData({
			comment_id : $(this).attr('rel'),
			uid : Micro._currentUser,
			actid : activity
		});
		Client.setOkCallBack(Micro.NeedThread.handleSubCommentDeleteSuccess);
		Client.Run();
		delete Client;
	},
	handleSubCommentDeleteSuccess : function (d) {
		if ("COMMENT_DELETED" === d.status) {
			$('.activity_comments .line[id=' + d.comment_id + ']').fadeOut("slow", function () {
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
				$('.comments_count_' + d.activity_id).html(text);
			} else {
				$('.icon.view-comments.cm[id=' + d.activity_id + ']').hide();
			}
		}
		Micro.NeedThread.hasLikesOrComments(d.activity_id);
	},
	handlePublish : function () {
		var info = $(this).attr('rel');
		var activity_id = $(this).attr('id');
		var infoDiv = $('#publish_info_' + activity_id + ' input');
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
			oShare.caption = $('#nth_need_title').html();
			FB.ui(oShare, function (resp) {
				console.log(resp);
			});
		});
	},
	hasLikesOrComments : function (aid) {
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.GET_LIKE_AND_COMMENTS_NUMBERS);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : aid,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedThread.hasLikesOrCommentAction);
		Client.Run();
		delete Client;
	},
	hasLikesOrCommentAction : function (n) {
		var element = $('.comments-like[id=' + n.activity_id + ']');
		var intComments = parseInt(n.comments);
		var intLikes = parseInt(n.likes);
		if (0 == intComments && 0 === intLikes) {
			element.addClass('dontShow');
		}
	},
	handleDeletePost : function () {
		var activity_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.DELETE_ACTIVITY);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : activity_id,
			uid : Micro._currentUser,
			need_id : Micro.NeedThread._currentNeed
		});
		Client.setOkCallBack(Micro.NeedThread.handleDeletePostSuccess);
		Client.Run();
		delete Client;
	},
	handleDeletePostSuccess : function (d) {
		if ("POST_DELETED_OK" === d.status) {
			$('#section-need-comments-' + d.activity_id).fadeOut(800, function () {
				$(this).off().remove();
			});
		}
	},
	handleAddComment : function (e) {
		if (e.keyCode == 13 && $(this).val() && $(this).val() !== $(this).attr('default')) {
			var commentText = $(this).val();
			var activity_id = $(this).attr('id');
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.ACTIVITIES.ADD_COMMENT);
			Client.setResponseGlue('JSON');
			Client.setData({
				actid : activity_id,
				uid : Micro._currentUser,
				cText : commentText
			});
			Client.setOkCallBack(Micro.NeedThread.handleCommentAddSuccess);
			Client.Run();
			delete Client;
		}
	},
	handleCommentAddSuccess : function (response) {
		if ("COMMENT_ADDED" === response.status) {
			var activity_id = response.activity_id;
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.ACTIVITIES.GET_COMMENTS);
			Client.setResponseGlue('JSON');
			Client.setData({
				actid : activity_id,
				uid : Micro._currentUser,
				limit : 0,
				offset : 1
			});
			Client.setOkCallBack(Micro.NeedThread.handleCommentAppend);
			Client.Run();
			delete Client;
		}
	},
	handleCommentAppend : function (d) {
		$('#ac_' + d.activity_id).append(d.markup);
		$('#ac_' + d.activity_id).show();
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
			$('.comments_count_' + d.activity_id).html(text);
			$('.comments-like[id=' + d.activity_id + ']').removeClass('dontShow');
			$('.icon.view-comments.cm[id=' + d.activity_id + ']').removeClass('dontShow');
		} else {
			$('.icon.view-like.cm[id=' + d.activity_id + ']').hide();
		}
		$('.comments_add_box[id=' + d.activity_id + ']').val('');
		Micro.clearText();
	},
	handleViewLikesClick : function () {
		var activity_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.GET_LIKES);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : activity_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedThread.handleDisplayLikes);
		Client.Run();
		delete Client;
	},
	handleDisplayLikes : function (d) {
		if (d.markup) {
			Micro.showOverlay('People who likes this activity', ' ', d.markup, false);
		}
	},
	handleViewCommentClick : function () {
		var activity_id = $(this).attr('id');
		var maxCount = parseInt($('.comments_count_' + activity_id).html());
		var startLimit,
		nextStart;
		if (maxCount < Micro.NeedThread._defaultCommentsToShow) {
			startLimit = 0;
			nextStart = 0;
		} else {
			startLimit = maxCount - Micro.NeedThread._defaultCommentsToShow;
			nextStart = startLimit - Micro.NeedThread._defaultCommentsToShow;
		}
		$('.show_more_sub[id=' + activity_id + ']').attr('limit', nextStart);
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.GET_COMMENTS);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : activity_id,
			uid : Micro._currentUser,
			limit : startLimit,
			offset : Micro.NeedThread._defaultCommentsToShow,
			order : 'ASC'
		});
		Client.setOkCallBack(Micro.NeedThread.handleCommentsDisplay);
		Client.Run();
		delete Client;
	},
	handleReverseCommentLimits : function () {
		var activity_id = $(this).attr('id');
		var cLimit = $(this).attr('limit');
		var ofs = Micro.NeedThread._defaultCommentsToShow;
		if (cLimit <= 0) {
			ofs = parseInt(ofs) + parseInt(cLimit);
			cLimit = 0;
		}
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.GET_COMMENTS);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : activity_id,
			uid : Micro._currentUser,
			limit : cLimit,
			offset : ofs,
			order : 'ASC'
		});
		Client.setOkCallBack(Micro.NeedThread.handleCommentsLimitAppend);
		Client.Run();
		delete Client;
	},
	handleCommentsDisplay : function (d) {
		if (d.markup) {
			$('#ac_' + d.activity_id).html(d.markup);
		}
		$('#ac_' + d.activity_id).toggle();
		$('#cax_' + d.activity_id).toggle();
		if (d.total > Micro.NeedThread._defaultCommentsToShow)
			$('.show_more_sub').show();
	},
	handleCommentsLimitAppend : function (c) {
		if ($('#ac_' + c.activity_id + ' div.line:first').length > 0) {
			$(c.markup).insertBefore($('#ac_' + c.activity_id + ' div.line:first'));
		} else {
			$('#ac_' + c.activity_id).append(c.markup);
		}
		var nextStart = c.limit - Micro.NeedThread._defaultCommentsToShow;
		if (nextStart < 0) {
			$('.show_more_sub[id=' + c.activity_id + ']').fadeOut("fast");
		} else {
			$('.show_more_sub[id=' + c.activity_id + ']').attr('limit', nextStart);
		}
	},
	handleCommentClick : function () {
		var box_id = 'cax_' + $(this).attr('id');
		$('#' + box_id).toggle();
		$(this).toggleClass('active');
		$('.icon.comments.comment').toggleClass('on');
	},
	handleLikeClick : function () {
		var activity_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.LIKE);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : activity_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedThread.handleActivityLikeSuccess);
		Client.Run();
		delete Client;
	},
	handleActivityLikeSuccess : function (d) {
		var isHidden = $('.comments-like[id=' + d.activity_id + ']').hasClass('dontShow');
		var p = d.total + ' People';
		if (isHidden) {
			$('.comments-like[id=' + d.activity_id + ']').removeClass('dontShow');
			$('.icon.view-like[id=' + d.activity_id + ']').removeClass('dontShow');
			$('.likes_count_' + d.activity_id).html(p).removeClass('dontShow');
		} else {
			$('.icon.view-like[id=' + d.activity_id + ']').removeClass('dontShow');
			$('.likes_count_' + d.activity_id).html(p).removeClass('dontShow');
		}
		var likeLink = $('.add_action.like.first');
		var unlikeLink = '<a href="javascript:void(0);" class="add_action unlike first" id="' + d.activity_id + '">UnLike</a>';
		likeLink.fadeOut("fast", function () {
			$(unlikeLink).insertAfter($(this));
			$(this).off().remove();
			$('.icon.comments.like').addClass('on');
		});
	},
	handleUnLikeClick : function () {
		var activity_id = $(this).attr('id');
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.UNLIKE);
		Client.setResponseGlue('JSON');
		Client.setData({
			actid : activity_id,
			uid : Micro._currentUser
		});
		Client.setOkCallBack(Micro.NeedThread.handleActivityUnLikeSuccess);
		Client.Run();
		delete Client;
	},
	handleActivityUnLikeSuccess : function (d) {
		var p = d.total + ' People';
		if (d.total == 0) {
			$('.icon.view-like[id=' + d.activity_id + ']').addClass('dontShow');
			$('.likes_count_' + d.activity_id).html(p).addClass('dontShow');
		} else {
			$('.likes_count_' + d.activity_id).html(p);
		}
		var unLikeLink = $('.add_action.unlike.first');
		var likeLink = '<a href="javascript:void(0);" class="add_action like first" id="' + d.activity_id + '">Like</a>';
		unLikeLink.fadeOut("fast", function () {
			$(likeLink).insertAfter($(this));
			$(this).off().remove();
			$('.icon.comments.like').removeClass('on');
		});
		Micro.NeedThread.hasLikesOrComments(d.activity_id);
	},
	fetchNeedActivities : function (limit, offset) {
		l = limit || 0;
		o = offset || Micro.NeedThread._defaultActivityToShow;
		var Client = new AjaxFramework.Client();
		Client.setAjaxMethod(A.ACTIVITIES.GET_BY_NEED);
		Client.setResponseGlue('JSON');
		Client.setData({
			need_id : Micro.NeedThread._currentNeed,
			user_id : Micro._currentUser,
			limit : l,
			offset : o
		});
		Client.setOkCallBack(Micro.NeedThread.handleActivityDisplay);
		Client.Run();
		delete Client;
	},
	handleActivityDisplay : function (d) {
		if ("OK" === d.status) {
			if (d.rows > Micro.NeedThread._defaultActivityToShow) {
				Micro.NeedThread._pagingActivity = parseInt(d.limit) + Micro.NeedThread._defaultActivityToShow;
				$('.a_paging.activity').show();
				if (Micro.NeedThread._pagingActivity >= parseInt(d.rows)) {
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
		Micro.NeedThread.fetchNeedActivities(Micro.NeedThread._pagingActivity, Micro.NeedThread._defaultActivityToShow);
	},
	handleCommentAdd : function () {
		var commented = $('#conversation_comment').val() === $('#conversation_comment').attr('default') ? false : $('#conversation_comment').val();
		if (commented) {
			var Client = new AjaxFramework.Client();
			Client.setAjaxMethod(A.ACTIVITIES.ADD);
			Client.setResponseGlue('JSON');
			Client.setData({
				need_id : Micro.NeedThread._currentNeed,
				user_id : Micro._currentUser,
				content : commented
			});
			Client.setOkCallBack(Micro.NeedThread.handleAddPostResponseBack);
			Client.Run();
			delete Client;
		}
	},
	handleAddPostResponseBack : function (d) {
		if ("POST_ADDED_OK" === d.status) {
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
	handleAddPostResponseOK : function (d) {
		if ($('section.activity_view section:first-child').length < 1)
			$('.activity_view').append(d.activity_html);
		else
			$(d.activity_html).insertBefore('section.activity_view section:first-child');
	},
	handleGetNeed : function (d) {

		$('#nth_need_title').html(d.need.title || "");
		$('#nth_need_cat_title').html(d.need.type_label || "");
		$('#nth_icon_type').attr('class', 'icon category ' + d.need.type_label.replace(" ", "").toLowerCase());
		$('#nth_need_photo').attr('src', url + 'photos/needs/' + d.need.photo);
		Micro.geo.getAddressArrayByAddressString(d.need.location, function (oAddr) {
			var cityStateStr = oAddr.locality + ', ' + oAddr.administrative_area_level_1;
			$('#nth_location_text').html(cityStateStr || "");
		});
		var oDate = new Date(d.need.created.split(" ")[0]);
		var strPosted = 'Posted ' + Micro.Utils.strMonth(oDate.getMonth()) + ' ' + oDate.getDay();
		$('#nth_need_cration_date').html(strPosted);
		delete oDate;
		delete strPosted;
		
		var	question	=	"Want to provide solution for this need?";
		var	buttonText	=	"I&#8217;ll Provide This!";
		var	buttonClass	=	"provider_nomination";
		var msg			=	'No thanks, but I&#8217;d like to <a href="javascript:void(0);" class="more_needs">see more Needs</a> like this.';
		var	isProvision	=	"";
		
		if( d.need.status_actions.in_array("provided") )
		{
			question	=	"Want to deliver this need?";
		 	buttonText	=	"I&#8217;ll Deliver This!";
		 	buttonClass	=	"deliverer_nomination";
			msg			=	'No thanks, but I&#8217;d like to <a href="javascript:void(0);" class="more_needs">see more Needs</a> like this.';
			
			if(d.need.pv_accepted[0].pv_id) isProvision	=	"provision_id"+d.need.pv_accepted[0].pv_id;
		}
		
		if( d.need.status_actions.in_array("delivered") )
		{
			question	=	"Interested in this need? It\'s pretty much covered but we\'ve got more..";
			buttonText	=	"Show Similar Needs!";
			buttonClass	=	"show_sim_needs";
			msg			=	'Show me <a href="javascript:void(0);" class="more_needs">other Needs</a> from this originator.';
			
			isProvision	=	"";
		}
				
		var asideHeader	="";
			asideHeader += '<h2>'+question+'</h2>';
			asideHeader += '<button class="default '+buttonClass+'" id="' + Micro.NeedThread._currentNeed + '">';
			asideHeader += '<a href="javascript:void(0);" class="provide_need_current_user">'+buttonText+'</a>';
			asideHeader += '</button>';
			asideHeader += '<div class="needs-status-message">';
			asideHeader += msg;
			asideHeader += '</div>';
			asideHeader += '<div class="fb_btn nth">';
			asideHeader += '<fb:like href="http://qa.microneeds.com/#aneed_admin?n=' + Micro.NeedThread._currentNeed + '" send="false" layout="button_count" width="50" show_faces="false" font="arial"></fb:like>';
			asideHeader += '</div>';
			
		
		$('#need_thread_header').html( asideHeader );
		FB.XFBML.parse(document.getElementById('section-content-main'));

		//Micro.handleNeedUpdate({ need_id : d.need.id });
		Micro.NeedThread.fetchNeedActivities();
	},
	
	setNoteBookContent : function () {
		var html = '<div class="thumbnail need">';
		html += '<span class="photo type-2">';
		html += '<img src="" alt="" title="" width="240" height="240" id="nth_need_photo">';
		html += '</span>';
		html += '<div class="need_status_graph" id="' + Micro.url.get().n + '">';
		html += '<div class="check liked"></div>';
		html += '<div class="check shared"></div>';
		html += '<div class="check provided"></div>';
		html += '<div class="check delivered"></div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="details">';
		html += '<h2><a href="javascript:void(0);" id="nth_need_title"></a></h2>';
		html += '<div class="location"><span class="icon"></span><span id="nth_location_text"></span></div>';
		html += '<nav id="nav-need">';
		html += '<h4>Need Activity</h4>';
		html += '<ul>';
		html += '<li class="nav-details"><a href="javascript:Micro.LoadPage(\'#aneed_admin?n=' + Micro.url.get().n + '\');"></a></li>';
		html += '<li class="nav-thread on"><a href="javascript:void(0);"></a></li>';
		html += '<li class="nav-provision"><a href="javascript:Micro.LoadPage(\'#need_provision?n=' + Micro.url.get().n + '\');"></a></li>';
		html += '<li class="nav-delivery"><a href="javascript:Micro.LoadPage(\'#need_delivery?n=' + Micro.url.get().n + '\');"></a></li>';
		html += '<li class="nav-team"><a href="javascript:Micro.LoadPage(\'#need_team?n=' + Micro.url.get().n + '\');"></a></li>';
		html += '</ul>';
		html += '</nav>';
		html += '</div>';
		
		Micro.populateNotebookView(html);
		Micro.setNotebookView(true);
	},
	setSideBarContent : function () {
		var html = '<div class="badge type-2">';
			html += '<h2 id="nth_need_cat_title"></h2>';
			html += '<span class="icon" id="nth_icon_type"></span>';
			html += '<h3 id="nth_need_cration_date"></h3>';
			html += '</div>';
		Micro.populateSideBar(html);
	},
	setMainContent : function () {
	
		var html = '<aside class="header" id="need_thread_header">';
			html += '<h2>Want to provide solution for this need?</h2>';
			html += '<button class="default provide_nomination" id="' + Micro.url.get().n + '">';
			html += '<a href="javascript:void(0);" class="provide_need_current_user">I&#8217;ll provide This!</a>';
			html += '</button>';
			html += '<div class="needs-status-message">';
			html += 'No thanks, but I&#8217;d like to <a href="javascript:void(0);" class="more_needs">see more Needs</a> like this.';
			html += '</div>';
			html += '<div class="fb_btn nth">';
			html += '<fb:like href="http://dev.microneeds.com/#aneed_admin?n=' + Micro.url.get().n + '" send="false" layout="button_count" width="50" show_faces="false" font="arial"></fb:like>';
			html += '</div>';
			html += '</aside>';
			
			html += '<div class="thread_comment_list">';
				html += '<div class="box need_steps_cbox">';
				html += '<input class="comment-input-pad" type="text" id="conversation_comment" default="Join the conversation around this need..." />';
				html += '</div>';
				html += '<button class="default need-thread-post" id="add_post">Post</button>';
				html += '<div class="nth_photo"></div>';
			html += '</div>';
			html += '<section class="activity_view"></section>';
			html += '<div class="ap_wrapper"><a href="javascript:void(0);" class="a_paging activity">show next <span class="act_number"></span> posts...</a></div>';
		
		Micro.populateMainContent(html);
	},
};
