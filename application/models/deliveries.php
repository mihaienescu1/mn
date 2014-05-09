<?php
/*
 *	User Deliveris DB Model
 */
class Deliveries extends CI_Model
{
	private $__tableName 	= 	'deliveries';
	private $__fields 		= 	array('id', 'user_id', 'need_id', 'provision_id', 'content', 'accepted', 'created_date', 'accepted_date', 'finalized');
	
	public function __construct() {
		parent::__construct();
		$this->load->model('Activities');
		$this->load->model('Needs_status_actions');
	}
	
	/**
	  * Add a new delivery canditate
	  * @param int $need_id
	  * @param int $provision_id
	  * @param int $user_id
	  * @param string $content - Default null
	  * @return boolean - Status of the add, will return true of successfully added
	  */
	public function add($need_id, $provision_id, $user_id, $content	=	null) {
		$values	=	array(
						'need_id'		=> (int) $need_id,
						'user_id'		=> (int) $user_id,
						'created_date'	=>	time(),
						'accepted'		=>	0,
						'provision_id'	=> (int) $provision_id
					);
					
		if(!is_null($content)) $values['content']	=	trim($content);
		
		$add	=	$this->db->insert($this->__tableName, $values);
		
		if($add) {
			
			$addActivity	=	$this->Activities->add(
									$values['need_id'], 
									$values['user_id'],
									'',
									null,
									'DELIVER_NOMINATION',
									null,
									"need:{$values['need_id']},user:{$values['user_id']}"
						);
						
			if($addActivity) 
			{
				$this->Needs_status_actions->updateStatusAction($need_id);
				
				return true;
			} else {
				return false;
			}
			
		} else { 
			return false;
		}
	}
	
	/**
	  * @param array $values {'delivery_id', 'need_id', 'user_id'}
	  * @return boolean - true if successfully accepted, false if some error has triggered
	  */
	public function accept($values) {
		$u	=	$this->db->update($this->__tableName, 
									array('accepted'=> 1, 'accepted_date'	=>	time() ), 
									array( 'id' => (int) $values['delivery_id'] )
				);

		if($u) {
			$addActivity	=	$this->Activities->add(
									(int) $values['need_id'], 
									(int) $values['user_id'],
									'',
									null,
									'DELIVER_ACCEPTED',
									null,
									json_encode(array('pv' => $values['delivery_id'], 
													  'need' => $values['need_id'], 
													  'user' => $values['user_id']
												)
											)
									);		
			if($addActivity) {
				$this->Needs_status_actions->updateStatusAction($values['need_id']);
				return true;
			}
			else {
				return false;
			}
		} else { 
			return false;
		}
		
		return false;
	}
	
	/**
	  * Get the number of delivery offers a need has
	  * @param int $need_id
	  * @return int - number of total offers
	  */
	public function getOffersCount($need_id) {
		$query	=	$this->db->query("SELECT count(id) as TOTAL_OFFERS FROM {$this->__tableName} WHERE need_id = " . (int) $need_id	.	" AND accepted = 0");
		$query	=	$query->result_array();
		
		return (isset($query[0])) ? ((int) $query[0]['TOTAL_OFFERS']) : 0;
	}
	
	/**
	  * Get the number of delivery accepted offers a need has
	  * @param int $need_id
	  * @return int - number of total accepted offers 
	  */
	public function getAcceptedDelivery($need_id) {
		$query	=	$this->db->get_where( $this->__tableName, array('need_id' => (int) $need_id, 'accepted' => 1 ) );
		$query	=	$query->result_array();
		
		return (isset($query[0])) ? $query[0] : false;
	}
	
	/**
	  * Get all the deliveries offers that a need has
	  * @param int $need_id
	  * @return array $entries - will return a bidimensional array that contains the delivery information
	  */
	public function getDeliveries($need_id) {	
		$sql	=	"SELECT p.id as pv_id, "	.
					"p.need_id as pv_need , "	.
					"p.content, p.accepted , p.created_date, p.accepted_date, "	.
					"u.id AS pv_user, u.firstname, u.lastname , ".
					"u.username, u.email, u.photo ".
					"FROM deliveries p , users u WHERE u.id = p.user_id ".
					"AND p.need_id = " .(int) $need_id . " AND p.accepted = 0 ";
		$query	=	$this->db->query( $sql );
		$entries	=	$query->result_array();
		
		return $entries;
	}
	
	/**
	  * Get all the deliveries accepted offers that a need has
	  * @param int $need_id
	  * @return array $entries - will return a bidimensional array that contains the accepted delivery information
	  */
	public function getAcceptedDeliveries($need_id) {
		$sql	=	"SELECT d.id as pv_id, "	.
					"d.need_id as pv_need , "	.
					"d.content, d.accepted , d.created_date, d.accepted_date, "	.
					"u.id AS pv_user, u.firstname , u.lastname , ".
					"u.username, u.email, u.photo ".
					"FROM deliveries d , users u WHERE u.id = d.user_id ".
					"AND d.need_id = " .(int) $need_id . " AND d.accepted = 1 ";
		$query	=	$this->db->query( $sql );
		$query	=	$query->result_array();
		
		return $query;
	}
	
	/**
	  * Get all the deliveries accepted offers that where accepted and finalized
	  * @param int $need_id
	  * @return array $entries - will return a bidimensional array that contains the accepted delivery information
	  */
	  
	public function getFinalizedDeliveries($need_id) {
		$sql	=	"SELECT d.id as pv_id, "	.
					"d.need_id as pv_need, "	.	
					"d.content, d.accepted, d.created_date, d.accepted_date, "	.
					"u.id as pv_user, u.firstname, u.lastname, "	.
					"u.username, u.email, u.photo "	.
					"FROM deliveries d , users u WHERE u.id = d.user_id "	.
					"AND d.need_id	=	"	.	(int) $need_id	. " AND d.accepted = 1 "	.
					"AND d.finalized = 1 ";
		$query	=	$this->db->query( $sql );
		$query	=	$query->result_array();
		
	}
	
}