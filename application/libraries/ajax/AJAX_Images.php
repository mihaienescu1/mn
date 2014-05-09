<?php

class AJAX_Images extends CI_Controller
{
	public static $CI = false;

	public function __construct()
	{
		parent::__construct();
		self::$CI = &get_instance();
	}
	
	public function delete()
	{
		$r	=	array('result'	=>	'');
		
		if(!isset($_POST['imgname']) || empty($_POST['imgname']))
		{
			$r['result']	=	'ERROR_NO_IMAGE_NAME_PROVIDED';
		}
		else
		{
			$photo_path	= $_SERVER['DOCUMENT_ROOT'] . 'photos/needs/'	. trim($_POST['imgname']);
			
			if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
			{
				$photo_path = 	$_SERVER['DOCUMENT_ROOT'] . '/microneeds/photos/needs/'	. trim($_POST['imgname']);
			}
			
			if(file_exists($photo_path))
			{	
				if(unlink($photo_path))
				{
					$r['result']	=	'IMAGE_DELETED';
				}
				else
				{
					$r['result']	=	'UNLINK_ERROR';
				}
			}
			else
			{
				$r['result']	=	'NO_FILE_TO_UNLINK';
			}
			
		}
		
		return $r;
	}
}