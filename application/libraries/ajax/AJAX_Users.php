<?php

class AJAX_Users extends CI_Controller {
	
	public static $CI 	= 	false;
	
	public function __construct() {
		parent::__construct();
		self::$CI = &get_instance();
	}
	
	public function getUserById() {
		self::$CI->load->model('Users_model');
		$user	=	self::$CI->Users_model->getById( (int) $_POST['uid'] );
		
		return $user;
	}
	
	public function getUserByEmail() {
		self::$CI->load->model('Users_model');
		$user	=	self::$CI->Users_model->getByEmail( $_POST['email'] );
		
		return $user;
	}
	
	public function addFacebookUser() {
		$result	=	array('uinfo'	=>	'',	'status'	=>	'OK');
		
		$fb_uinfo	=	json_decode($_POST['userdata'], true);
		self::$CI->load->model('Users_model');
		$user	=	self::$CI->Users_model->addFacebook( $fb_uinfo );
		
		if(is_array($user))
		{
			$result['uinfo']	=	$user;
		}
		else
		{
			$result['uinfo']	=	'';
			$result['status']	=	'FB_USERADD_ERROR';
		}
		
		return $result;
	}
	
	public function isUserInvolvedInThisNeed() {
		$result	=	array('isInvolved' => 0, 'status' => 'OK');
		
		return $result;
	}	
}