<?php
/*
 * Images controller that will be used for AJAX Requests
 */
class Images extends CI_Controller
{
	private $__currentImageName	=	false;
	private $__max_file_size	=	8174800;
	
	public function __construct() {
		parent::__construct();
	}
	
	public function index() {
		/* Not used for now */
	}
	
	public function upload() {	
		$response		=	array( 'result' => '', 'info' => array() );
		$allowedTypes 	= 	array('image/jpeg', 'image/png', 'image/gif');
		$filename		=	$_FILES['Filedata']['name'];
		$filesize		=	$_FILES['Filedata']['size'];
		$filetype		=	$_FILES['Filedata']['type'];
		$fileTemp		=	$_FILES['Filedata']['tmp_name'];
		$mimeType		=	mime_content_type($_FILES['Filedata']['tmp_name']);

		if( $filesize > $this->__max_file_size ) {
			$response['result']	= 'FILESIZE_EXCEEDED';
			exit(json_encode($response));
		}
		
		if ( in_array($mimeType, $allowedTypes) ) {
			$upload_dir = 	$_SERVER['DOCUMENT_ROOT'] . 'photos/needs/';
				
			if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
				$upload_dir = 	$_SERVER['DOCUMENT_ROOT'] . '/microneeds/photos/needs/';
				
			
			$prefix 	= 	substr ( md5(uniqid(rand(),1)), 3, 10);
			$fnameNew	=	$prefix.'__'.str_replace(" ", "", strtolower($filename));
			$to_dir		=	$upload_dir . $fnameNew;
			
			move_uploaded_file($fileTemp, $to_dir);
			
			$config['image_library'] = 'gd2';
			$config['source_image'] = $to_dir;
			$config['create_thumb'] = FALSE;
			$config['maintain_ratio'] = FALSE;
			$config['width'] = 121;
			$config['height'] = 102;
			
			$this->load->library('image_lib', $config);
			$this->image_lib->resize();
			
			$response['result']							= 'UPLOAD_OK';
			$response['info']['file_name']				=	$filename;
			$response['info']['file_name_stored']		=	$fnameNew;
			$response['info']['location']				=	$to_dir;
				
			$this->__currentImageName	=	$fnameNew;
		}
		else {
			$response['result']	= 'INVALID_FILE_TYPE';
		}
		echo json_encode($response);
	}
	
	public function delete($fname) {
		$img_dir = 	$_SERVER['DOCUMENT_ROOT'] . 'photos/needs/';
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')
		{
			$img_dir = 	$_SERVER['DOCUMENT_ROOT'] . '/microneeds/photos/needs/';
		} 	
		unlink($img_dir	. $fname);
	}
	
	public function store() {
		/* Not used for now */
	}
}