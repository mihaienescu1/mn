<?php

class Ajax extends CI_Controller {

	protected 	$_instancePrefix		=	AJAX_DEFAULT_INSTANCE_PRFIX;
	protected 	$_glue					=	AJAX_METHOD_RETURN_GLUE_XML;
	protected 	$_allowedResponses		= 	array(
												AJAX_METHOD_RETURN_GLUE_JSON,
												AJAX_METHOD_RETURN_GLUE_XML,
												AJAX_METHOD_RETURN_GLUE_HTML
											);
	
	protected 	$_globalMethods			=	array();
	private		$__node					=	null;
	private 	$__method				=	null;
	
	public function __construct() {
		parent::__construct();
		
		foreach( get_class_methods(__CLASS__) as $method) {
			$this->_globalMethods[]	=	$method;
		}
		
		$split			=	explode(".", $_REQUEST['am']);
		$this->__node	=	$this->_instancePrefix	.	ucfirst($split[0]);
		$this->__method	=	$split[1];
		
		if (isset( $_REQUEST['glue'] )) {
			if (!in_array($_REQUEST['glue'], $this->_allowedResponses)) {
				$this->__Abort(AJAX_INVALID_GLUE_VALUE_EXCEPTION);
			}
			else {
				$this->_glue = $_REQUEST['glue'];
			}
		}
	}
	
	public function index() {
		try  {
			$this->load->library('ajax/'.$this->__node);
			$object = new $this->__node;
		}
		catch (Exception $ex){
			echo $e->getMessage();
		}
		
		if (isset($object) && method_exists($object, $this->__method)) {
			$output = $object->{$this->__method}();
			if (!is_array($output)) {
				$this->__Abort(AJAX_METHOD_INVALID_RETURN_TYPE);
			}
			else {
				echo $this->__out($output);
			}
		}
		else {
			$this->__Abort(AJAX_METHOD_NOT_FOUND_EXCEPTION);
		}
	}
	
	private function __Abort($errMessage) {
		throw new Exception($errMessage);
	}
	
	private function __xml($array) {
		$xml 	= 	new SimpleXMLElement('<root/>');
					array_walk_recursive($array, array ($xml, 'addChild'));
		$out	=	$xml->asXML();
	
		return $out;
	}
	
	private function __out($parameter) {
	
		switch($this->_glue) {
		
			case AJAX_METHOD_RETURN_GLUE_JSON :
				header('Content-Type: application/json');
				$parameter 	=  json_encode($parameter);
			break;
	
			case AJAX_METHOD_RETURN_GLUE_XML :
				header('Content-type: text/xml');
				$parameter	=	$this->__xml($parameter);
			break;
	
			case AJAX_METHOD_RETURN_GLUE_HTML :
				$parameter = $parameter[0];
			break;
	
			default:
				header('Content-type: text/xml');
				$parameter	=	$this->__xml($parameter);
			break;
			
		}
		
		return $parameter;
	}
}