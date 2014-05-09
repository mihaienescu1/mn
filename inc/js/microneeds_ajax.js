AjaxFramework = function () {};
AjaxFramework.METHODS = function () {};
AjaxFramework.Errors = function () {};
AjaxFramework.SERVER_ADDR = url + 'index.php/ajax/';
AjaxFramework.RESPONSE_GLUE = "JSON";
AjaxFramework.REQUEST_METHOD = "POST";
AjaxFramework.Errors.ERROR_HTTP = 1;
AjaxFramework.Errors.ERROR_WS = 2;
AjaxFramework.Errors.ERROR_REQUEST = 3;
AjaxFramework.Errors.ERROR_INTERNAL = 4;
AjaxFramework.Client = function () {
	this.data = null;
	this.responseObject = this;
	this.responseOKCallBack = null;
	this.responseErrorCallBack = null;
	this.requestMethod = AjaxFramework.REQUEST_METHOD;
	this.ajaxMethod = null;
	this.serverUrl = AjaxFramework.SERVER_ADDR;
	this.expectedResponseGlue = AjaxFramework.RESPONSE_GLUE;
	this.setData = function (xData) {
		var str = [];
		for (var p in xData)
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(xData[p]));
		this.data = '&' + str.join("&");
	};
	this.setOkCallBack = function (xCallBack, object) {
		this.responseOKCallBack = xCallBack;
		if (object !== undefined) {
			this.responseObject = object;
		}
	};
	this.setErrorCallBack = function (yCallBack, object) {
		this.responceErrorCallBack = yCallBack;
		if (object !== undefined) {
			this.responseObject = object;
		}
	};
	this.setRequestMethod = function (xMethod) {
		this.requestMethod = xMethod;
	};
	this.setAjaxMethod = function (xCallMethod) {
		this.ajaxMethod = 'am=' + xCallMethod;
	};
	this.setResponseGlue = function (xGlueString) {
		this.expectedResponseGlue = xGlueString;
	};
	this.Run = function () {
		var to_url = this.serverUrl;
		var strQuery = this.ajaxMethod + '&glue=' + this.expectedResponseGlue + this.data;
		var type = AjaxFramework.RESPONSE_GLUE.toLowerCase();
		try {
			var request = $.ajax({
					type : this.requestMethod,
					url : to_url,
					data : strQuery,
					datatype : type
				});
			request.fail($.proxy(this.responseErrorCallBack, this.responseObject));
			request.done($.proxy(this.responseOKCallBack, this.responseObject));
		} catch (ex) {
			if (console && console.log) {
				console.log(ex);
			} else {
				alert(ex);
			}
		}
	};
};

/* Methods Mapping */
A	=	{	NEEDS 		  : {}, 
			ACTIVITIES 	  : {}, 
			GEO 		  : {}, 
			SESSIONS 	  : {}, 
			USERS 		  : {},
			IMAGES		  : {},
			UserProvision : {},
			NeedDelivery  : {}
		};
/* Images */
A.IMAGES.DELETE									=	'images.delete';
/* Geo */
A.GEO.REVERSE_GEOCODE_BY_STR					=	'geo.getCoordsByAddressString';
/* Sessions */
A.SESSIONS.ADD									=	'sessions.add';
A.SESSIONS.GET									=	'sessions.get';
/* Needs */
A.NEEDS.GET_BY_ID								=	'needs.getNeedById';
A.NEEDS.GET_NEED								=	'needs.getNeed';
A.NEEDS.GET_USER_BY_ID							=	'users.getUserById';
A.NEEDS.SELECT_NEED_PROVIDER					=	'needs.selectProvider';
A.NEEDS.SELECT_NEED_DELIVERER					=	'needs.selectDeliverer';
A.NEEDS.GET_ACTION_REQUIRE_NEEDS				=	'needs.getActionRequireNeeds';
A.NEEDS.GET_NEEDS_WHERE_CURRENT_USER_INVOLDED	=	'needs.getInvolvedNeeds';
A.NEEDS.NOMINATE_NEED_PROVIDER					=	'needs.nominateNeedProvider';
A.NEEDS.NOMINATE_NEED_DELIVERER					=	'needs.nominateNeedDeliverer';
A.NEEDS.UPDATE_STATUS_ACTIONS					=	'needs.updateNeedStatusActions';
A.NEEDS.UPDATE_NEED								=	'needs.updateNeed';
A.NEEDS.GET_NEED_TYPES							=	'needs.getNeedTypes';
A.NEEDS.GET_NEEDS_IN_MAP_VIEWPORT				=	'needs.getViewPortNeeds';
A.NEEDS.GET_NEEDS_NEARBY_LOCATION				=	'needs.getNearbyNeeds';
A.NEEDS.ADD_NEED								=	'needs.addNeed';
A.NEEDS.GET_NEED_OWNER_INFO						=	'needs.getNeedOwnerInfo';
A.NEEDS.DOES_USER_OFFERED_PROVISION				=	'needs.doesUserOfferedProvision';
A.NEEDS.DOES_USER_OFFERED_DELIVERY				=	'needs.doesUserOfferedDelivery';
A.NEEDS.DOES_USER_IS_INVOLVED_IN_NEED			=	'needs.doesUserIsInvolvedInNeed';

/* Activities */
A.ACTIVITIES.GET_PROVISION_OFFERS				=	'activities.getProvisionOffers';
A.ACTIVITIES.GET_DELIVERY_OFFERS				=	'activities.getDeliveryOffers';
A.ACTIVITIES.ADD								=	'activities.add';
A.ACTIVITIES.DELETE_ACTIVITY					=	'activities.delete';
A.ACTIVITIES.GET_BY_NEED						=	'activities.getByNeed';
A.ACTIVITIES.GET_NEED_DELIVERY_INFO				=	'activities.getNeedDeliveryInfo';
A.ACTIVITIES.LIKE_COMMENT						=	'activities.commentLike';
A.ACTIVITIES.UNLIKE_COMMENT						=	'activities.commentUnlike';
A.ACTIVITIES.DELETE_COMMENT						=	'activities.delComment';
A.ACTIVITIES.GET_LIKE_AND_COMMENTS_NUMBERS		=	'activities.likeCommentsNumber';
A.ACTIVITIES.ADD_COMMENT						=	'activities.addComment';
A.ACTIVITIES.GET_COMMENTS						=	'activities.getComments';
A.ACTIVITIES.GET_LIKES							=	'activities.getLikes';
A.ACTIVITIES.LIKE								=	'activities.like';
A.ACTIVITIES.UNLIKE								=	'activities.unlike';
/* Users */
A.USERS.GET_BY_EMAIL							=	'users.getUserByEmail';
A.USERS.GET_BY_ID								=	'users.getUserById';
A.USERS.ADD_BY_FACEBOOK							=	'users.addFacebookUser';
A.USERS.GET_USER								=	'users.getUser';
A.USERS.GET_FRIENDS								=	'users.getFriends';
A.USERS.GET_SETTINGS							=	'users.getSettings';
A.USERS.IS_INVOLVED_IN_NEED						=	'users.isUserInvolvedInThisNeed';

/* UserProvision */
A.UserProvision.GET_PROVISION_OFFERS			=	'UserProvision.getProvisionOffers';
A.UserProvision.GET_DELIVERY_OFFERS				=	'UserProvision.getDeliveryOffers';
A.UserProvision.ADD								=	'UserProvision.add';
A.UserProvision.DELETE_ACTIVITY					=	'UserProvision.delete';
A.UserProvision.GET_BY_NEED						=	'UserProvision.getByNeed';
A.UserProvision.GET_NEED_DELIVERY_INFO			=	'UserProvision.getNeedDeliveryInfo';
A.UserProvision.LIKE_COMMENT					=	'UserProvision.commentLike';
A.UserProvision.UNLIKE_COMMENT					=	'UserProvision.commentUnlike';
A.UserProvision.DELETE_COMMENT					=	'UserProvision.delComment';
A.UserProvision.GET_LIKE_AND_COMMENTS_NUMBERS	=	'UserProvision.likeCommentsNumber';
A.UserProvision.ADD_COMMENT						=	'UserProvision.addComment';
A.UserProvision.GET_COMMENTS					=	'UserProvision.getComments';
A.UserProvision.GET_LIKES						=	'UserProvision.getLikes';
A.UserProvision.LIKE							=	'UserProvision.like';
A.UserProvision.UNLIKE							=	'UserProvision.unlike';
A.UserProvision.GET_SIDEBAR_CONTENT				=	'UserProvision.getProvisionHeader';

/* Need Delivery */
A.NeedDelivery.GET_PROVISION_OFFERS				=	'UserNeedDelivery.getProvisionOffers';
A.NeedDelivery.GET_DELIVERY_OFFERS				=	'UserNeedDelivery.getDeliveryOffers';
A.NeedDelivery.ADD								=	'UserNeedDelivery.add';
A.NeedDelivery.DELETE_DELIVERY					=	'UserNeedDelivery.delete';
A.NeedDelivery.GET_BY_NEED						=	'UserNeedDelivery.getByNeed';
A.NeedDelivery.GET_NEED_DELIVERY_INFO			=	'UserNeedDelivery.getNeedDeliveryInfo';
A.NeedDelivery.LIKE_COMMENT						=	'UserNeedDelivery.commentLike';
A.NeedDelivery.UNLIKE_COMMENT					=	'UserNeedDelivery.commentUnlike';
A.NeedDelivery.DELETE_COMMENT					=	'UserNeedDelivery.delComment';
A.NeedDelivery.GET_LIKE_AND_COMMENTS_NUMBERS	=	'UserNeedDelivery.likeCommentsNumber';
A.NeedDelivery.ADD_COMMENT						=	'UserNeedDelivery.addComment';
A.NeedDelivery.GET_COMMENTS						=	'UserNeedDelivery.getComments';
A.NeedDelivery.GET_LIKES						=	'UserNeedDelivery.getLikes';
A.NeedDelivery.LIKE								=	'UserNeedDelivery.like';
A.NeedDelivery.UNLIKE							=	'UserNeedDelivery.unlike';
A.NeedDelivery.GET_SIDEBAR_CONTENT				=	'UserNeedDelivery.getDeliveryHeader';

/* Constants MAPPING */
C = {
	FACEBOOK_APP_ID 		: 	'114206805353278',
	MICROSOFT_MAPS_KEY 		: 	'AomsB1MLkwDA7J83JKkxeY_wzEHzVfBS1MEFUzqj_MxEfkPUQycat4ryfIrPABBi',
	GOOGLE_MAPS_KEY			: 	'AIzaSyC8rMkxtnr3Syo-tPm_n6r_9dWgbayb76c',
	PAGE_CLOSE_BUTTON		:	'<div class="close"></div>',
	SUB_SECTION_SEPARATOR 	: 	'>',
	BREADCRUMB_SEPARATOR	:	'&#8226;',
	BREADCRUMB_TPL			:	'&nbsp;<span class="breadcrumb_arrow">&#8226;</span>&nbsp;',
	MAX_BREADCRUB_STRIP		:	15,
	ELIPS_BREADCRUMB_CHARS	:	'...',
	NEED_CAPTION_GENERAL	:	'Can you help fill this Need?',
	MICROSOFT_MAPS_VIEW_CHANGE_START_EVENT_NAME   : 'viewchangestart',
	MICROSOFT_MAPS_VIEW_CHANGE_END_EVENT_NAME	  : 'viewchangeend',
	GOOGLE_API_SEARCHBOX_PLACE_CHANGED_EVENT_NAME : 'place_changed',
	USER_LOCATION_MAP_PIN	:	'https://chart.googleapis.com/chart?chst=d_map_pin_icon_withshadow&chld=star|666666',
}




