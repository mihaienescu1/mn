<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Need_phases extends CI_Model
{
	private $__tableName	=	'need_phases';
	private	$__fields		=	array('id', 'label', 'comments');
	
	public function __construct()
	{	
		parent::__construct();
	}
	
	/**
	  * Get all the need phases
	  * @return void
	  */
	public function getAll()
	{
		$get	=	$this->db->get($this->__tableName);
		$query	=	$get->result_array();
	}
	
}