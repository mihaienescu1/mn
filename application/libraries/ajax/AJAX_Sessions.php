<?php

class AJAX_Sessions extends CI_Controller
{
	public static $CI = false;

	public function __construct()
	{
		parent::__construct();
		self::$CI = &get_instance();
	}
		
	public function add()
	{
		$status	=	array('status'	=>	'OK');
		
		$key	=	trim($_POST['key']);
		$value	=	trim($_POST['val']);
		$udata	=	array();
		
		$udata['client_side'][$key]	=	$value;
		
		$this->session->set_userdata($udata);
		
		return $status;
	}
	
	public function get()
	{
		$status	=	array('status'	=>	'OK', 'data'	=>	'');
		$key		=	trim($_POST['key']);
		$clientSide	=	$this->session->userdata('client_side');
		
		if(isset($clientSide[$key]))
		{
			$status['data']		= 	$clientSide[$key];
		}
		else
		{
			$status['status']	=	'KEY_NOT_FOUND';
		}
		
		print_r($clientSide);
		return $status;
	}
}