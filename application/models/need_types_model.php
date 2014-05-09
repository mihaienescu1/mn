<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Need_types_model extends CI_Model
{
	private $__tableName = 'need_types';
	private $__fields = array('id', 'title');
	
	public function getAll(){
		$query = $this->db->get($this->__tableName);
		
		return $query->result_array();
	}
}