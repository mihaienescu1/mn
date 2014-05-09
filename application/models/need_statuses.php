<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Need_statuses extends CI_Model
{
	private $__tableName	=	'need_statuses';
	private	$__fields		=	array('status_id', 'label', 'comments');
	
	public function __construct()
	{	
		parent::__construct();
	}
	
	/**
	  * Get all the Need Statuses List
	  * @return array $s - the list of all the need statuses
	  */
	public function getAll()
	{
		$get	=	$this->db->get($this->__tableName);
		$query	=	$get->result_array();
		$s		=	array();
		
		foreach($query	as $key	=>	$val)
		{
			$row	=	array('id'	=>	$val['status_id'], 'descr'	=>	$val['comments']);
			$s[$val['label']]	=	$row;
		}
		
		return $s;
	}
	
}