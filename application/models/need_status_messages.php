<?php
/*
 *	User Need_status_messages DB Model
 */
class Need_status_messages extends CI_Model {

	private $__tableName 	= 	'need_status_messages';
	private $__fields 		= 	array('id', 'need_id', 'action_text', 'action_msg_timestamp', 'action_msg_time_unix', 'warning');
	
	public function __construct() {
		parent::__construct();
	}
	
	/**
	  * @param array $msg - An array containing the fields to be added (need_id, action_text, action_msg_timestamp, action_msg_time_unix)
	  * @return bool $status
	  */
	public function add($msg) {
		
		$need_waring_icon = NO_WARNING_ICON;
		if(array_key_exists('warning', $msg) && !empty($msg['warning'])) {
			$need_warning_icon = trim($msg['warning']);
		}
		
		$add	=	$this->db->insert($this->__tableName, array(
			'action_msg_time_unix' 	=> 	time(),
			'action_text'			=>	$msg['action_text'],
			'need_id'				=>	$msg['need_id'],
			'warning'				=>	$need_waring_icon
		));
		
		return ($add) ? true : false;
	}
	
	/**
	  * @param int $criteria_id
	  * @param string $criteria_fields ( Default : id , Can be deleted by need id , in this case , method will delete all need messages )
	  * @return bool $status
	  */
	public function delete($criteria_id, $criteria_field = 'id') {
		
		switch($criteria_field) {
			case 'id' : 
				$this->db->where('id', (int) $criteria_id);
			break;
			
			case 'need_id' :
				$this->db->where('need_id', (int) $criteria_id);
			break;
			
			default : 
				$this->db->where('id', (int) $criteria_id);
			break;
		}
		$del	=	$this->db->delete($this->__tableName);
		return ($del) ? true : false;
	}
	
	/**
	  * @param int $need_id
	  * @param string $criteria_fields ( Default : id , Can be deleted by need id , in this case , method will delete all need messages )
	  * @return array ( An array containing the last action message that will be displayed in the need box )
	  */
	public function getLastActivityMessage($need_id) {
		$query = $this->db->query("SELECT * FROM " . $this->__tableName . " WHERE need_id = " . (int) $need_id . " ORDER BY action_msg_timestamp DESC LIMIT 0, 1");
		return $query->result_array();
	}
}