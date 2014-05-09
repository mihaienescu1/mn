<?php 

class App_home extends CI_Controller {

	public function __construct() {
		parent::__construct();
	}
	
	private function _getIP() { 
	
		$ip 	= 	$this->_getIpBasedOnEnviorement();
		
		if	($ip == DEFAULT_IP_MAP || $ip == DEFAULT_IP_MAP_SECOND || $ip == DEFAULT_IP_MAP_HOSTMANE) {
				$page 		= 	file_get_contents(CHECK_IP_WEBSITE);
				$string 	= 	strip_tags($page);
				$words 		= 	explode(" ", $string);
				$ip = trim($words[5]);
		}
		
		//$ip = '174.52.120.206';
		return $ip;
	}
	
	private function _getIpBasedOnEnviorement() {
	
		$ip = false; 
		
		switch(true) {
			case (getenv("HTTP_CLIENT_IP")) :
				$ip = getenv("HTTP_CLIENT_IP");
			break;
			
			case (getenv("HTTP_X_FORWARDED_FOR")) :
				$ip = getenv("HTTP_X_FORWARDED_FOR"); 
			break;
			
			case (getenv("REMOTE_ADDR")) :
				$ip = getenv("REMOTE_ADDR");
			break;
			
			default :
				$ip = null;
			break;
		}
		
		return $ip;
	}
	
	
	public function index() {
		$ip		=	$this->_getIP();
		$data	=	array('location'=>	array('latitude' => '38', 'longitude' => '-97', 'geoip'=> 'NO'),
						  'gmaps_api_key' => GOOGLE_MAPS_API_KEY,
						  'facebook_information'	=>	array(
									'api_key'	 =>	MICRONEEDS_FACEBOOK_API_KEY,
									'secret_key' => MICRONEEDS_FACEBOOK_SECRET_KEY
							)
						);
		$json	=	file_get_contents(GEOIP_SERVICE_LINK . $ip);
		$gip	=	json_decode($json, true);

		if (isset($gip['latitude'], $gip['longitude'])) {
			$data['location'] = array(
					'latitude'		=>	$gip['latitude'],
					'longitude' 	=>  $gip['longitude'],
					'geoip'			=>	'YES'
			);
		}
		$this->load->view(AJAX_HTML_MARKUP_VIEW_PREFIX . strtolower(__CLASS__), $data);
	}
}