<?php 
/*
 *	User Provision DB Model
 */
class Provisions extends CI_Model {
	private $__tableName 	= 	'provisions';
	private $__fields 		= 	array('id', 'user_id', 'need_id', 'content', 'accepted', 'created_date', 'accepted_date', 'finalized');
	
	public function __construct() {
		parent::__construct();
		$this->load->model('Activities');
		$this->load->model('Needs_status_actions');
	}
	
	/**
	  * @param int $need_id
	  * @param int $user_id
	  * @param string $content
	  * @return boolean - true if successfully inserted, false on db error
	  */
	public function add($need_id, $user_id, $content	=	null) {
		$values	=	array(
						'need_id'		=> (int) $need_id,
						'user_id'		=> (int) $user_id,
						'created_date'	=>	time(),
						'accepted'		=>	0
					);
					
		if(!is_null($content)) $values['content']	=	trim($content);
		$add	=	$this->db->insert($this->__tableName, $values);
		
		if($add) {
			$addActivity	=	$this->Activities->add(
									$values['need_id'], 
									$values['user_id'],
									'',
									null,
									'PROVIDER_NOMINATION',
									null,
									"need:{$values['need_id']},user:{$values['user_id']}"
						);
						
			if($addActivity) {
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
	  * @param array $values
	  * @return boolean - true if successfully inserted, false on error
	  */
	public function accept($values) {
		$u	=	$this->db->update($this->__tableName, 
									array('accepted'=> 1, 'accepted_date'	=>	time() ), 
									array( 'id' => (int) $values['provision_id'] )
				);

		if($u) {
			$addActivity	=	$this->Activities->add(
									(int) $values['need_id'], 
									(int) $values['user_id'],
									'',
									null,
									'PROVIDER_ACCEPTED',
									null,
									json_encode(array('pv' => $values['provision_id'], 
													  'need' => $values['need_id'], 
													  'user' => $values['user_id']
												)
											)
									);		
			if($addActivity) {
				$this->Needs_status_actions->updateStatusAction($values['need_id']);
				return true;
			} else {
				return false;
			}
		} else { 
			return false;
		}
		
		return false;

	}
	
	/**
	  * Get the count of offers for a need
	  * @param int $need_id
	  * @return int - the number of offers
	  */
	public function getOffersCount($need_id) {
		$query	=	$this->db->query("SELECT count(id) as TOTAL_OFFERS FROM {$this->__tableName} WHERE need_id = " . (int) $need_id	. " AND accepted = 0");
		$query	=	$query->result_array();
		return (isset($query[0])) ? ((int)$query[0]['TOTAL_OFFERS']) : 0;
	}
	
	/**
	  * @param int $need_id
	  * @return array|boolean - an array if there is an accepted provision, false if there is no accepted provision
	  */
	public function getAcceptedProvision($need_id) {
		$query	=	$this->db->get_where( $this->__tableName, array('need_id' => (int) $need_id, 'accepted' => 1 ) );
		$query	=	$query->result_array();
		
		return (isset($query[0])) ? $query[0] : false;
	}
	
	/**
	  * Get the provisions list with entries that have not been accepted
	  * @param int $need_id
	  * @return array $result_array
	  */
	public function getProvisions($need_id) {	
		return $this->getProvisionsByNeedIdWithFlag($need_id, 0);
	}
	
	/**
	  * Get the accepted provisions list
	  * @param int $need_id
	  * @return array $result_array
	  */
	public function getAcceptedProvisions($need_id) {
		return $this->getProvisionsByNeedIdWithFlag($need_id, 1);
	}
	
	/**
	  * Get the provisions list using an flag to selected accepted or not accepted entries, or all
	  * @param int $need_id
	  * @return array $result_array
	  */
	public function getProvisionsByNeedIdWithFlag($need_id, $is_accepted = null) {
		$sql	=	'SELECT p.id as pv_id, 
					        p.need_id as pv_need,
							p.content, 
							p.accepted , 
							p.created_date, 
							p.accepted_date, 
							u.id AS pv_user, 
							u.firstname, 
							u.lastname , 
							u.username, 
							u.email, 
							u.photo 
					 FROM provisions p , 
					      users u 
					 WHERE u.id = p.user_id 
						AND p.need_id = ' .(int) $need_id . ' ';
						
		if(!is_null($is_accepted))
			$sql   .=  'AND p.accepted = '.$is_accepted.' ';
						
		$query			=	$this->db->query( $sql );
		$result_array	=	$query->result_array();
		
		return $result_array;
	}
	
	/**
	  * Get all the deliveries accepted offers that where accepted and finalized
	  * @param int $need_id
	  * @return array $entries - will return a bidimensional array that contains the accepted delivery information
	  */
	  
	public function getFinalizedProvisions($need_id) {
		$sql	=	"SELECT p.id as pv_id, "	.
					"p.need_id as pv_need, "	.	
					"p.content, p.accepted, p.created_date, p.accepted_date, "	.
					"u.id as pv_user, u.firstname, u.lastname, "	.
					"u.username, u.email, u.photo "	.
					"FROM provisions p , users u WHERE u.id = p.user_id "	.
					"AND p.need_id	=	"	.	(int) $need_id	. " AND p.accepted = 1 "	.
					"AND p.finalized = 1 ";
		$query	=	$this->db->query( $sql );
		$query	=	$query->result_array();
		
	}
}