Micro.AppHome = {
	_pageName : 'AppHome',
	_searchLocation : false,
	_selMarker : false,
	_iw : false,
	_nearbyNeeds : [],
	_searchMarkers : [],
	Init : function () {
		Micro.AppHome.setPageBar();
		Micro.AppHome.setSideBarContent();
		Micro.setNotebookView(false);
		Micro.initGlobalMapArea();
	},
	
	Abandon : function () {
		$('.set_notebook').unbind().off();
		$('.unset_notebook').unbind().off();
		$('.view-details-arrow').unbind().off();
	},

	setSideBarContent : function () {
		var html = '<div class="banner"></div>';
		Micro.populateSideBar(html);
	},
	
	setMainContent : function () {
		console.log( Micro._lastPage );
		console.log('setMainContentTrigger');
		var html = '---------';
		Micro.populateMainContent(html);
	},
	
	setPageBar	:	function () {
		var dynNav = Micro.BreadCrumbs.generate();
		$('.section-breadcrumbs .left-side .title').html( dynNav );
	}
};