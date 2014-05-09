<?php

Class Storage_model extends CI_Model
{
	private $__tableName 	= 	'storage';
	private $__fields 		= 	array('id', 'key', 'value','indentifier');
	
	public function __construct() {
		parent::__construct();
	}
	
	public function add($key, $value) {
		$status	= 'VALUE_NOT_CHANGED';
		$isKey	= $this->db->get_where( $this->__tableName, array('key' => trim($key)) );

		if($isKey->num_rows > 0) {	
			/*
			$this->db->where('key', trim($key));
			$updateKey	=	$this->db->update( $this->__tableName, array( 'value' => json_encode($value) )); 
			*/
			$status		=	'KEY_UPDATED';
		}
		else {
			$insertKey	=	$this->db->insert( $this->__tableName, array('key' => trim($key) , 'value' => json_encode($value) ) );
			$status		=	'KEY_INSERTED';
		}
		
		return $status;
	}
}