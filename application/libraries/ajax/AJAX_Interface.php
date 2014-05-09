<?php

class AJAX_Interface extends CI_Controller
{
	public static $CI = false;
	
	public function __construct()
	{
		parent::__construct();
		self::$CI = &get_instance();
	}
	
	public function upload()
	{
		
	}
}