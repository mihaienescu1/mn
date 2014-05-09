<?php

Class AJAX_Apis extends CI_Controller {
	
	public static $CI 				= 	false;
	public static $fbGraphURL		=	'https://api.facebook.com/method/fql.query?query=';
	public static $allowedFormats	=	array('json', 'url');
	
	public function __construct()
	{
		parent::__construct();
		self::$CI = &get_instance();
	}
	
	function getFbUrlLikesCount()
	{	
		$url = $_REQUEST['url'];
		
		$query = "select url,normalized_url,click_count,total_count,like_count,comment_count,share_count,click_count from link_stat where url='" . $url . "'";
		$call = "https://api.facebook.com/method/fql.query?query=" . rawurlencode($query) . "&format=json";
		echo $call;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $call);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$output = curl_exec($ch);
		curl_close($ch);
		return json_decode($output);
	}
	 
}