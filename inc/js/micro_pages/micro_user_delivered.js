Micro.UserDelivered	=	{
		
		_pageName : 'UserDelivered',
		
		Init : function()
		{
			this.setNoteBookContent();
			this.setSideBarContent();
			this.setMainContent();
			
			Micro.setNotebookView(true);
		},
		
		Abandon	: function()
		{
			
		},
		
		setNoteBookContent : function()
		{
			var html="";
				html += "<div class=\"thumbnail\">";
				html += "			<div class=\"picture\">";
				html += "  <a href=\"\/dev\/users\/paul-dumais\" title=\"View user profile.\" class=\"active\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/user_profile_photo\/default-user.png\" alt=\"Paul Dumais's picture\" title=\"View user profile.\" class=\"imagecache imagecache-user_profile_photo\" width=\"136\" height=\"136\"><\/a><\/div>";
				html += "			<h4>Joined October '11<\/h4>";
				html += "		<\/div>";
				html += "	";
				html += "		<div class=\"details\">";
				html += "			<h2><a href=\"\">John Appleseed<\/a><\/h2>";
				html += "			<div class=\"location\"><span class=\"icon\"><\/span>Big Bear Lake, CA<\/div>";
				html += "			 <nav id=\"nav-user\">";
				html += "			 	<h4>John's Activity<\/h4>";
				html += "			 	<ul>";
				html += "			 		<li class=\"nav-engagement\"><a>Engagement<\/a><\/li>";
				html += "			 		<li class=\"nav-timeline\"><a href=\"#!\/timeline\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"user-profile\/timeline\/4\">Timeline<\/a><\/li>";
				html += "			 		<li class=\"nav-provided\"><a href=\"#!\/provided\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"user-profile\/provided\/4\">Provided<\/a><\/li>";
				html += "			 		<li class=\"nav-delivered on\"><a href=\"#!\/delivered\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"user-profile\/delivered\/4\">Delivered<\/a><\/li>";
				html += "			 		<li class=\"nav-teams\"><a href=\"#!\/teams\" data-rel=\"#load\" data-tagtohide=\"#user-profile-detail\" data-load=\"user-profile\/teams\/4\">Teams<\/a><\/li>";
				html += "			 	<\/ul>";
				html += "			 <\/nav>	 ";
				html += "		<\/div>";
				html += "		";
				html += "		<a href=\"\" class=\"icon label message\"><span><\/span>Message John<\/a>";
				html += "		<a href=\"\" class=\"icon label follow\"><span><\/span>Follow John<\/a>";

				Micro.populateNotebookView( html );
		},
		
		setSideBarContent : function()
		{
			var html="";
				html += "<div class=\"badge type-2\">";
				html += "          <h2>CSR Affiliation<\/h2>";
				html += "          <span class=\"icon\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/microneeds.infusionstudios.com\/themes\/microneeds_v2\/images\/icon_badge_apple.png\"><\/span>";
				html += "          <h3>Apple Corp.<\/h3>";
				html += "        <\/div>";
				
				Micro.populateSideBar( html );
		},
		
		setMainContent : function()
		{
			var html="";
				html += "<section class=\"needs-list\">";
				html += "         <h3 class=\"title\">Active<\/h3>";
				html += "         <article class=\"need\">";
				html += "          <div class=\"thumbnail\"><span class=\"photo type-2\"><img src=\"http:\/\/microneeds.infusionstudios.com#sites\/dev2.microneeds.com\/files\/imagecache\/need_thumb\/featured_photos\/school-supplies.jpg\" width=\"120\" height=\"102\" \/><\/span>";
				html += "            <div class=\"status provide_pending\">";
				html += "              <ul>";
				html += "                <li class=\"check-new\">New<\/li>";
				html += "                <li class=\"check-share\">Share<\/li>";
				html += "                <li class=\"check-provide\">Provide<\/li>";
				html += "                <li class=\"check-deliver\">Deliver<\/li>";
				html += "              <\/ul>";
				html += "            <\/div>";
				html += "          <\/div>";
				html += "          <div class=\"details\">";
				html += "            <h2><a href=\"#teams\/need\/3-boxes-various-educational-supplies\">3 Boxes of Various Educational Supplies<\/a><\/h2>";
				html += "            <div class=\"location\"><span class=\"icon\"><\/span> New Delhi, India<\/div>";
				html += "          <\/div>";
				html += "          <a href=\"#\" class=\"view-details-arrow\">View Need Details<\/a>";
				html += "          <div class=\"fb-like\" data-href=\"http:\/\/microneeds.com\" data-send=\"false\" data-width=\"450\" data-show-faces=\"false\"><\/div>";
				html += "          <div class=\"needs-actions\">";
				html += "            <div class=\"needs-status-actions\" style=\"display: none;\">";
				html += "              <ul>";
				html += "                <li class=\"action-label\">Get Involved:<\/li>";
				html += "                <li class=\"action-share\"><a href=\"#\" title=\"Share\">Share<\/a><\/li>";
				html += "                <li class=\"action-provide\"><a href=\"#\" title=\"Provide\">Provide<\/a><\/li>";
				html += "                <li class=\"action-deliver\"><a href=\"#\" title=\"Deliver\">Deliver<\/a><\/li>";
				html += "              <\/ul>";
				html += "            <\/div>";
				html += "            <div class=\"needs-status\">";
				html += "              <div class=\"recent-activity\"><span class=\"activity-timestamp\">Wed, 02\/01\/2012 - 00:30<\/span><span class=\"activity-message\"><a href=\"#\" class=\"user\">PedroDePyro<\/a> has offered to Provide <a href=\"#\">3 Boxes of Various Educational Supplies<\/a>.<\/span><\/div>";
				html += "            <\/div>";
				html += "          <\/div>";
				html += "        <\/article>";
				html += "				<\/section>";
				html += "				<section class=\"needs-list\">";
				html += "        <h3 class=\"title\">Completed<\/h3>";
				html += "        <article class=\"need\">";
				html += "          <div class=\"thumbnail\"><span class=\"photo type-1\"><img src=\"http:\/\/microneeds.infusionstudios.com#sites\/dev2.microneeds.com\/files\/imagecache\/need_thumb\/featured_photos\/school-supplies.jpg\" width=\"120\" height=\"102\" \/><\/span>";
				html += "            <div class=\"status provide_pending\">";
				html += "              <ul>";
				html += "                <li class=\"check-new\">New<\/li>";
				html += "                <li class=\"check-share\">Share<\/li>";
				html += "                <li class=\"check-provide\">Provide<\/li>";
				html += "                <li class=\"check-deliver\">Deliver<\/li>";
				html += "              <\/ul>";
				html += "            <\/div>";
				html += "          <\/div>";
				html += "          <div class=\"details\">";
				html += "            <h2><a href=\"#teams\/need\/3-boxes-various-educational-supplies\">3 Boxes of Various Educational Supplies<\/a><\/h2>";
				html += "            <div class=\"location\"><span class=\"icon\"><\/span> New Delhi, India<\/div>";
				html += "          <\/div>";
				html += "          <a href=\"#\" class=\"view-details-arrow\">View Need Details<\/a>";
				html += "          <div class=\"fb-like\" data-href=\"http:\/\/microneeds.com\" data-send=\"false\" data-width=\"450\" data-show-faces=\"false\"><\/div>";
				html += "          <div class=\"needs-actions\">";
				html += "            <div class=\"needs-status-actions\" style=\"display: none;\">";
				html += "              <ul>";
				html += "                <li class=\"action-label\">Get Involved:<\/li>";
				html += "                <li class=\"action-share\"><a href=\"#\" title=\"Share\">Share<\/a><\/li>";
				html += "                <li class=\"action-provide\"><a href=\"#\" title=\"Provide\">Provide<\/a><\/li>";
				html += "                <li class=\"action-deliver\"><a href=\"#\" title=\"Deliver\">Deliver<\/a><\/li>";
				html += "              <\/ul>";
				html += "            <\/div>";
				html += "            <div class=\"needs-status\">";
				html += "              <div class=\"recent-activity\"><span class=\"activity-timestamp\">Wed, 02\/01\/2012 - 00:30<\/span><span class=\"activity-message\"><a href=\"#\" class=\"user\">PedroDePyro<\/a> has offered to Provide <a href=\"#\">3 Boxes of Various Educational Supplies<\/a>.<\/span><\/div>";
				html += "            <\/div>";
				html += "          <\/div>";
				html += "        <\/article>";
				html += "			<\/section>";

				Micro.populateMainContent(html);
		}

};