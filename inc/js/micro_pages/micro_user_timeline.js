Micro.UserTimeline	=	{
		
		_pageName : 'UserTimeline',
		
		Init : function()
		{

			this.setNoteBookContent();
			this.setSideBarContent();
			this.setMainContent();
			
			Micro.setNotebookView(true);
		},
		
		
		postInit : function()
		{
		
		},
		
		Abandon	: function()
		{
		
		},
		
		setNoteBookContent	:	function()
		{
			var html="";
				html += "<div class=\"thumbnail\">";
				html += "          <div class=\"picture\"> <a href=\"\/dev\/users\/paul-dumais\" title=\"View user profile.\" class=\"active\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/user_profile_photo\/default-user.png\" alt=\"Paul Dumais's picture\" title=\"View user profile.\" class=\"imagecache imagecache-user_profile_photo\" width=\"136\" height=\"136\"><\/a><\/div>";
				html += "          <h4>Joined October '11<\/h4>";
				html += "        <\/div>";
				html += "        <div class=\"details\">";
				html += "          <h2><a href=\"\">John Appleseed<\/a><\/h2>";
				html += "          <div class=\"location\"><span class=\"icon\"><\/span>Big Bear Lake, CA<\/div>";
				html += "          <nav id=\"nav-user\">";
				html += "            <h4>John's Activity<\/h4>";
				html += "            <ul>";
				html += "              <li class=\"nav-engagement\"><a>Engagement<\/a><\/li>";
				html += "              <li class=\"nav-timeline on\"><a href=\"#!\/timeline\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"user-profile\/timeline\/4\">Timeline<\/a><\/li>";
				html += "              <li class=\"nav-provided\"><a href=\"#!\/provided\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"user-profile\/provided\/4\">Provided<\/a><\/li>";
				html += "              <li class=\"nav-delivered\"><a href=\"#!\/delivered\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"user-profile\/delivered\/4\">Delivered<\/a><\/li>";
				html += "              <li class=\"nav-teams\"><a href=\"#!\/teams\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"user-profile\/teams\/4\">Teams<\/a><\/li>";
				html += "            <\/ul>";
				html += "          <\/nav>";
				html += "        <\/div>";
				html += "        <a href=\"\" class=\"icon label message\"><span><\/span>Message John<\/a> <a href=\"\" class=\"icon label follow\"><span><\/span>Follow John<\/a>";
				
				Micro.populateNotebookView( html );

		},
		
		setSideBarContent	:	function()
		{
			var html="";
				html += "<div class=\"badge type-2\">";
				html += "          <h2>CSR Affiliation<\/h2>";
				html += "          <span class=\"icon\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/microneeds.infusionstudios.com\/themes\/microneeds_v2\/images\/icon_badge_apple.png\"><\/span>";
				html += "          <h3>Apple Corp.<\/h3>";
				html += "        <\/div>";
				
				Micro.populateSideBar( html );
		},
		
		setMainContent		:	function()
		{
			var html="";
				html += "<section class=\"comments-list\">";
				html += "          <div class=\"bubble\">Post something for John...<\/div>";
				html += "          <article>";
				html += "            <div class=\"profile-icon\">";
				html += "              <div class=\"picture\"> <a href=\"#\" title=\"View user profile.\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/user_thumb_fbss\/default-user.png\" alt=\"\" title=\"View user profile.\" width=\"50\" height=\"50\"><\/a><\/div>";
				html += "            <\/div>";
				html += "            <div class=\"info\">";
				html += "              <h4><a href=\"\">lady GooGoo<\/a> commented<\/h4>";
				html += "              <p>Ore everit anen idiumsen sium sedom vit lorem ipsum dolet gomenish fidder domino nonummy eluredodiv itsumolet siametel itolk ore. Folet sid amet elitolk op<\/p>";
				html += "              <div class=\"actions\"> <span class=\"posted\">12 minutes ago<\/span> <a href=\"\">Comment<\/a> <\/div>";
				html += "              <a href=\"\" class=\"icon comments like\"><span><\/span>Like<\/a> <a href=\"\" class=\"icon comments comment\"><span><\/span>Comment<\/a> <\/div>";
				html += "          <\/article>";
				html += "          <article>";
				html += "            <div class=\"profile-icon\">";
				html += "              <div class=\"picture\"> <a href=\"#\" title=\"View user profile.\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/user_thumb_fbss\/default-user.png\" alt=\"\" title=\"View user profile.\" width=\"50\" height=\"50\"><\/a><\/div>";
				html += "            <\/div>";
				html += "            <div class=\"info\">";
				html += "              <h4><a href=\"\">lady GooGoo<\/a> commented<\/h4>";
				html += "              <p>Ore everit anen idiumsen sium sedom vit lorem ipsum dolet gomenish fidder domino nonummy eluredodiv itsumolet siametel itolk ore. Folet sid amet elitolk op<\/p>";
				html += "              <div class=\"actions\"> <span class=\"posted\">12 minutes ago<\/span> <a href=\"\">Comment<\/a> <\/div>";
				html += "              <a href=\"\" class=\"icon comments like on\"><span><\/span>Like<\/a> <a href=\"\" class=\"icon comments comment on\"><span><\/span>Comment<\/a> <\/div>";
				html += "          <\/article>";
				html += "        <\/section>";
				html += "        <!-- end .comments-list -->";
				html += "        ";
				html += "        <section class=\"timeline-needs\">";
				html += "          <article>";
				html += "            <h3>1 Case of Sterile Surgical Gloves<\/h3>";
				html += "            <span class=\"posted\">Shared by John 2 hours ago<\/span><a href=\"#\" class=\"view-details-arrow\">View Need Details<\/a><\/article>";
				html += "        <\/section>";
				html += "        <section class=\"comments-list\">";
				html += "          <article>";
				html += "            <div class=\"profile-icon\">";
				html += "              <div class=\"picture\"> <a href=\"#\" title=\"View user profile.\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/user_thumb_fbss\/default-user.png\" alt=\"\" title=\"View user profile.\" width=\"50\" height=\"50\"><\/a><\/div>";
				html += "            <\/div>";
				html += "            <div class=\"info\">";
				html += "              <h4><a href=\"\">lady GooGoo<\/a> commented<\/h4>";
				html += "              <p>Ore everit anen idiumsen sium sedom vit lorem ipsum dolet gomenish fidder domino nonummy eluredodiv itsumolet siametel itolk ore. Folet sid amet elitolk op<\/p>";
				html += "              <div class=\"actions\"> <span class=\"posted\">12 minutes ago<\/span> <a href=\"\">Comment<\/a> <\/div>";
				html += "              <a href=\"\" class=\"icon comments like\"><span><\/span>Like<\/a> <a href=\"\" class=\"icon comments comment\"><span><\/span>Comment<\/a> <\/div>";
				html += "          <\/article>";
				html += "          <article>";
				html += "            <div class=\"profile-icon\">";
				html += "              <div class=\"picture\"> <a href=\"#\" title=\"View user profile.\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/user_thumb_fbss\/default-user.png\" alt=\"\" title=\"View user profile.\" width=\"50\" height=\"50\"><\/a><\/div>";
				html += "            <\/div>";
				html += "            <div class=\"info\">";
				html += "              <h4><a href=\"\">lady GooGoo<\/a> commented<\/h4>";
				html += "              <p>Ore everit anen idiumsen sium sedom vit lorem ipsum dolet gomenish fidder domino nonummy eluredodiv itsumolet siametel itolk ore. Folet sid amet elitolk op<\/p>";
				html += "              <div class=\"actions\"> <span class=\"posted\">12 minutes ago<\/span> <a href=\"\">Comment<\/a> <\/div>";
				html += "              <a href=\"\" class=\"icon comments like on\"><span><\/span>Like<\/a> <a href=\"\" class=\"icon comments comment on\"><span><\/span>Comment<\/a> <\/div>";
				html += "          <\/article>";
				html += "        <\/section>";
				html += "        <!-- end .comments-list -->";
				html += "        <section class=\"timeline-follow\">";
				html += "        	<article><h3>John Followed <strong>Jimmy Hendrix<\/strong><\/h3><span class=\"posted\">8 hours ago<\/span><\/article>";
				html += "        <\/section>";
				
				Micro.populateMainContent( html );
		}
};