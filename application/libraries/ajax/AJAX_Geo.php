<?php

Class AJAX_Geo extends CI_Controller
{
	public static $CI 				= 	false;
	public static $googleMapsUri	=	"http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=";
	
	public function __construct()
	{
		parent::__construct();
		self::$CI = &get_instance();
	}
	
	public function getCoordsByAddressString()
	{
		$address	=	urlencode($_POST['address']);
		$response	=	file_get_contents(self::$googleMapsUri	.	$address);
		
		return json_decode($response, true);
	}
	
	public function getCityStateByAddressString($address = null)
	{
		$addr	=	empty($_REQUEST['address']) ? '' : $_REQUEST['address'];
		if(!empty($address))	$addr	=	$address;
		
		$address	=	urlencode($addr);
		$response	=	file_get_contents(self::$googleMapsUri	.	$address);
		
		$arrayResponse	= json_decode($response, true);
		$result			=	$arrayResponse['results'][0];
		
		$state	=	'';
		$city	=	'';
		
		print_r($arrayResponse); 
		if($result['status'] === "OK")
		{
			foreach($result['address_components'] as $aComp)
			{
				if(in_array("administrative_area_level_1", $aComp['types']))
				{
					$state	=	$aComp['long_name'];
				}
				
				if(in_array("locality", $aComp['types']))
				{
					$city	=	$aComp['long_name'];
				}
			}
			
			return array('state'	=>	$state, 'city'	=>	$city, 'string'	=>	$city . ', ' . $state);
		}
	}
}