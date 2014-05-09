<?php

class AJAX_Storage extends CI_Controller
{
	public static $CI = false;

	public function __construct()
	{
		parent::__construct();
		self::$CI = &get_instance();
		self::$CI->load->model('storage_model');
	}
	
	public function add()
	{		
		$return		=	array('status' => '', 'response'	=>	'');
		$add		=	self::$CI->storage_model->add( $_POST['key'], $_POST['val'] );
		
		$return['response']	=	$add;
		
		return $return;
	}
	
	public function get($key)
	{
		
	}
}