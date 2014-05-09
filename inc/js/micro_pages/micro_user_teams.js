Micro.UserTeams	=	{
		
		_pageName : 'UserTeams',
		
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
		
		setNoteBookContent	: 	function()
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
				html += "			 		<li class=\"nav-timeline\"><a href=\"#!\/timeline\">Timeline<\/a><\/li>";
				html += "			 		<li class=\"nav-provided\"><a href=\"#!\/provided\">Provided<\/a><\/li>";
				html += "			 		<li class=\"nav-delivered\"><a href=\"#!\/delivered\">Delivered<\/a><\/li>";
				html += "			 		<li class=\"nav-teams on\"><a href=\"#!\/teams\">Teams<\/a><\/li>";
				html += "			 	<\/ul>";
				html += "			 <\/nav>	 ";
				html += "		<\/div>";
				html += "		";
				html += "<a href=\"\" class=\"icon label message\"><span><\/span>Message John<\/a>";
				html += "<a href=\"\" class=\"icon label follow\"><span><\/span>Follow John<\/a>";
				
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
				html += "<section id=\"section-users-teams\" class=\"teams-list\">";
				html += "          <article>";
				html += "          	<div class=\"container\">";
				html += "              <div class=\"thumbnail\"> <span class=\"photo type-2\"><a href=\"#\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/need_thumb\/featured_photos\/school-supplies.jpg\" alt=\"\" title=\"\" class=\"imagecache imagecache-need_thumb\" width=\"120\" height=\"102\"><\/a><\/span> <\/div>";
				html += "              <div class=\"details\">";
				html += "                <h2><a href=\"\/dev\/#\">3 Boxes of Various Educational Supplies<\/a><\/h2>";
				html += "                <div class=\"location\"><span class=\"icon\"><\/span>New Delhi, India<\/div>";
				html += "              <\/div>";
				html += "              <div class=\"member-count\"><a href=\"\/dev\/og\/users\/3\/faces\">2<\/a><\/div>";
				html += "              <div class=\"status large provide_pending\">";
				html += "                <ul>";
				html += "                  <li class=\"check-new\">New<\/li>";
				html += "                  <li class=\"check-share\">Share<\/li>";
				html += "                  <li class=\"check-provide\">Provide<\/li>";
				html += "                  <li class=\"check-deliver\">Deliver<\/li>";
				html += "                <\/ul>";
				html += "              <\/div>";
				html += "              <a href=\"#\" class=\"view-details-arrow\">View Need Details<\/a> ";
				html += "            <\/div>";
				html += "          <\/article>";
				html += "";
				html += "          <article>";
				html += "          	<div class=\"container\">";
				html += "              <div class=\"thumbnail\"> <span class=\"photo type-2\"><a href=\"#\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/need_thumb\/featured_photos\/school-supplies.jpg\" alt=\"\" title=\"\" class=\"imagecache imagecache-need_thumb\" width=\"120\" height=\"102\"><\/a><\/span> <\/div>";
				html += "              <div class=\"details\">";
				html += "                <h2><a href=\"\/dev\/#\">3 Boxes of Various Educational Supplies<\/a><\/h2>";
				html += "                <div class=\"location\"><span class=\"icon\"><\/span>New Delhi, India<\/div>";
				html += "              <\/div>";
				html += "              <div class=\"member-count\"><a href=\"\/dev\/og\/users\/3\/faces\">2<\/a><\/div>";
				html += "              <div class=\"status large provide_pending\">";
				html += "                <ul>";
				html += "                  <li class=\"check-new\">New<\/li>";
				html += "                  <li class=\"check-share\">Share<\/li>";
				html += "                  <li class=\"check-provide\">Provide<\/li>";
				html += "                  <li class=\"check-deliver\">Deliver<\/li>";
				html += "                <\/ul>";
				html += "              <\/div>";
				html += "              <a href=\"#\" class=\"view-details-arrow\">View Need Details<\/a> ";
				html += "            <\/div>";
				html += "          <\/article>";
				html += "";
				html += "          <article>";
				html += "          	<div class=\"container\">";
				html += "              <div class=\"thumbnail\"> <span class=\"photo type-2\"><a href=\"#\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/need_thumb\/featured_photos\/school-supplies.jpg\" alt=\"\" title=\"\" class=\"imagecache imagecache-need_thumb\" width=\"120\" height=\"102\"><\/a><\/span> <\/div>";
				html += "              <div class=\"details\">";
				html += "                <h2><a href=\"\/dev\/#\">3 Boxes of Various Educational Supplies<\/a><\/h2>";
				html += "                <div class=\"location\"><span class=\"icon\"><\/span>New Delhi, India<\/div>";
				html += "              <\/div>";
				html += "              <div class=\"member-count\"><a href=\"\/dev\/og\/users\/3\/faces\">2<\/a><\/div>";
				html += "              <div class=\"status large provide_pending\">";
				html += "                <ul>";
				html += "                  <li class=\"check-new\">New<\/li>";
				html += "                  <li class=\"check-share\">Share<\/li>";
				html += "                  <li class=\"check-provide\">Provide<\/li>";
				html += "                  <li class=\"check-deliver\">Deliver<\/li>";
				html += "                <\/ul>";
				html += "              <\/div>";
				html += "              <a href=\"#\" class=\"view-details-arrow\">View Need Details<\/a> ";
				html += "            <\/div>";
				html += "          <\/article>";
				html += "";
				html += "          <article>";
				html += "          	<div class=\"container\">";
				html += "              <div class=\"thumbnail\"> <span class=\"photo type-2\"><a href=\"#\"><img src=\"http:\/\/microneeds.infusionstudios.com\/dev\/sites\/dev2.microneeds.com\/files\/imagecache\/need_thumb\/featured_photos\/school-supplies.jpg\" alt=\"\" title=\"\" class=\"imagecache imagecache-need_thumb\" width=\"120\" height=\"102\"><\/a><\/span> <\/div>";
				html += "              <div class=\"details\">";
				html += "                <h2><a href=\"\/dev\/#\">3 Boxes of Various Educational Supplies<\/a><\/h2>";
				html += "                <div class=\"location\"><span class=\"icon\"><\/span>New Delhi, India<\/div>";
				html += "              <\/div>";
				html += "              <div class=\"member-count\"><a href=\"\/dev\/og\/users\/3\/faces\">2<\/a><\/div>";
				html += "              <div class=\"status large provide_pending\">";
				html += "                <ul>";
				html += "                  <li class=\"check-new\">New<\/li>";
				html += "                  <li class=\"check-share\">Share<\/li>";
				html += "                  <li class=\"check-provide\">Provide<\/li>";
				html += "                  <li class=\"check-deliver\">Deliver<\/li>";
				html += "                <\/ul>";
				html += "              <\/div>";
				html += "              <a href=\"#\" class=\"view-details-arrow\">View Need Details<\/a> ";
				html += "            <\/div>";
				html += "          <\/article>";
				html += "        <\/section>";
				
				Micro.populateMainContent(html);

		}

};