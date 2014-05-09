<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Needs_model extends CI_Model
{
	private $__tableName 		= 	'needs';
	private $__itemsTable		=	'need_items';
	private $__fields = array(
							'id', 
							'user_id', 
							'type_id', 
							'title', 
							'description', 
							'situation', 
							'location', 
							'photo',
							'status',
							'created',
							'co_owner_id'
	);
	
	public function __construct()
	{
		parent::__construct();
		
		$this->load->model('Provisions');
		$this->load->model('Deliveries');
	}
	
	/**
	  * Get all the Needs
	  * @param int $limit
	  * @param int $offset
	  * @return array $result_array
	  */
	public function getAll($limit, $offset)
	{
		
		$strQuery	 =	"SELECT n.id, n.user_id , n.type_id, nt.title AS type_label, ";
		$strQuery	.=	"n.title, n.description, n.situation, n.location, n.photo, n.`status`, ";
		$strQuery	.=	"ns.label AS status_label, n.created, CURRENT_TIMESTAMP AS today, ";
		$strQuery	.=	"n.phase , ns.label AS phase_label , ";
		$strQuery	.=	"UNIX_TIMESTAMP(n.created) AS created_unix, ";
		$strQuery	.=	"(  UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(n.created) ) AS need_age_unix,	";
		$strQuery	.=	"n.latitude, n.longitude, (SELECT `status` FROM needs_status_actions WHERE need_id = n.id ORDER BY `timestamp` DESC LIMIT 1) AS lsa ";
		$strQuery	.=	"FROM {$this->__tableName} n ";
		$strQuery	.=	"LEFT OUTER JOIN need_types nt ON nt.id = n.type_id ";
		$strQuery	.=	"LEFT OUTER JOIN need_statuses ns ON ns.status_id = n.`status` ";
		$strQuery	.=	"LEFT OUTER JOIN need_phases np	ON np.id = n.phase ";
		$strQuery	.=	"LIMIT {$limit}, {$offset} ";
		
		$query 			=	$this->db->query($strQuery);
		$result_array	=	$query->result_array();
		
		return $result_array;
	}
	
	/**
	  * @param array $need
	  * @param array $items
	  * @return int|boolean - will return an integer if the entry is successfully added, that integer is the need_id, if insertion fails, it will return false
	  */
	public function addNeed( $need = array(), $items	= array())
	{
		$add		=	$this->db->insert($this->__tableName, $need);
		$need_id	=	$this->db->insert_id();
		
		if($add) {
			$ai	= 0;
			foreach($items as $item)
				$ai += (!$this->addItemToNeed($need_id, $item)) ? 1 : 0;
			
			return ($ai	==	0) ? $need_id : false;
		}
	}
	
	/**
	  * @param int $need_id
	  * @param string $item_article
	  * @return boolean - true if successfully inserted, false if some database error was triggered
	  */
	public function addItemToNeed( $need_id, $item_title)
	{
		$add	=	$this->db->insert($this->__itemsTable, array('need_id'	=>	$need_id, 
																 'title'	=>	$item_title)
									);
		return ($add) ? true : false; 
	}
	
	/**
	  * @param int $need_id
	  * @param int $item_id
	  * @return boolean - true if successfully inserted, false if some database error was triggered
	  */
	public function deleteItem(int $need_id, int $item_id)
	{
		$del	=	$this->db->delete($this->__itemsTable, array('id' => (int) $item_id,
																 'need_id' => (int) $need_id)
				); 
		
		return ($del) ? true : false;
	}
	
	/**
	  * Get Need By Id
	  * @param int $need_id
	  * @return array $res - An array with the need information, will also contain the items and status actions
	  */
	public function getNeed($need_id)
	{
		$this->load->model('Needs_status_actions');
		
		$strQuery	 =	"SELECT n.id, n.user_id , n.type_id, nt.title AS type_label, ";
		$strQuery	.=	"n.title, n.description, n.situation, n.location, n.photo, n.`status`, ";
		$strQuery	.=	"ns.label AS status_label, n.created, CURRENT_TIMESTAMP AS today, ";
		$strQuery	.=	"n.phase , ns.label AS phase_label , ";
		$strQuery	.=	"(SELECT UNIX_TIMESTAMP(`timestamp`) FROM needs_status_actions WHERE need_id = n.id AND `status` = 'provide_pending') AS pv_selected_date, ";
		$strQuery	.=	"(SELECT UNIX_TIMESTAMP(`timestamp`) FROM needs_status_actions WHERE need_id = n.id AND `status` = 'provided') AS pv_provided_date, ";
		$strQuery	.=	"UNIX_TIMESTAMP(n.created) AS created_unix, ";
		$strQuery	.=	"(  UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(n.created) ) AS need_age_unix,	";
		$strQuery	.=	"n.latitude, n.longitude, (SELECT `status` FROM needs_status_actions WHERE need_id = n.id ORDER BY `timestamp` DESC LIMIT 1) AS lsa, ";
		$strQuery	.=	"(SELECT UNIX_TIMESTAMP(`timestamp`) FROM needs_status_actions WHERE need_id = n.id ORDER BY `timestamp` DESC LIMIT 1) AS lsa_time ";
		$strQuery	.=	"FROM {$this->__tableName} n ";
		$strQuery	.=	"LEFT OUTER JOIN need_types nt ON nt.id = n.type_id ";
		$strQuery	.=	"LEFT OUTER JOIN need_statuses ns ON ns.status_id = n.`status` ";
		$strQuery	.=	"LEFT OUTER JOIN need_phases np	ON np.id = n.phase ";
		$strQuery	.=	"WHERE n.id = " . (int) $need_id;
		
		$query 					=	$this->db->query($strQuery);
		$query					=	$query->result_array();
		$res					=	$query[0];
		$res['items']			= 	$this->getNeedItems($need_id);
		$res['status_actions']	=	$this->getNeedStatusActionLabels($need_id);
		
		return $res;
	}
	
	/**
	  * @param int $need_id
	  * @return array $user_ifno
	  */
	public function getNeedMinimalInfo($need_id) {
		 $query = $this->db->get_where($this->__tableName, array('id' => (int) $need_id));
		 $query = $query->result_array();
		 
		 if(isset($query[0])) {
			return $query[0];
		 } else {
			return false;
		 }
	}
	
	/**
	  * @param int $need_id
	  * @return array $doc
	  */
	public function getNeedStatusActionLabels($need_id)
	{
		$this->load->model('Needs_status_actions');
		$res	=	$this->Needs_status_actions->getStatusesArray($need_id);
		$doc	=	array();
		
		foreach($res as $r)
		{
			$doc[]	=	$r['status'];
		}
		unset($res);
		return $doc;
	}
	
	/**
	  * Get all the need items that belong to a specific need
	  * @param int $need_id
	  * @return array $res 
	  */
	public function getNeedItems($need_id)
	{
		$query	=	$this->db->get_where($this->__itemsTable, array('need_id'	=>	(int) $need_id));
		$query	=	$query->result_array();
		$res	=	$query;
		
		return $res;
	}
	
	/**
	  * Update a specific need using the need_id
	  * @param int $need_id
	  * @param array $fields
	  * @return string - the status of the update { NEED_FIELD_UPDATED : NEED_FIELD_UPDATE_ERROR}
	  */
	public function updateNeed( $need_id, $fields	=	array())
	{	
		$this->db->where('id', (int) $need_id);
		$update	=	$this->db->update($this->__tableName, $fields);
		return ($update) ? 'NEED_FIELD_UPDATED' : 'NEED_FIELD_UPDATE_ERROR';
	}
	
	/**
	  * @param int $item_id
	  * @param int $need_id
	  * @param string $item_title
	  * @return boolean - true if the need item has been successfully updated, false if some db error has triggered
	  */
	public function updateNeedItem( $item_id, $need_id, $item_title)
	{
		$strQuery	=	"UPDATE {$this->__itemsTable} "	.	
						"SET title	=	'" . trim($item_title) . "' "	.	
						"WHERE id= '" . (int)$item_id . "' AND need_id = ' "  . (int)$need_id . " '";
		
		$update	=	$this->db->query($strQuery);
		
		return ($update) ? true : false;
	}
	
	/**
	  * Search the list of needs using a keyword
	  * @param string $keyword
	  * @return array $result - the list of needs that match the keyword
	  */
	public function getByKeyword( $keyword = null)
	{
		
		if(is_null($keyword)){
			
			return false;
		}

		$strQuery	 =	"";
		$strQuery	.=	"SELECT ";
		$strQuery	.=	"n.id, n.user_id, n.title, n.description, n.situation, n.location, ";
		$strQuery	.=	"n.latitude, n.longitude, n.photo, nt.title as category, n.phase, ( SELECT label FROM need_phases np WHERE np.id = n.phase ) AS phase_label, ";
		$strQuery	.=	"FROM needs n LEFT OUTER JOIN need_types nt ON n.type_id = nt.id  ";
		$strQuery	.=	"WHERE ";
		$strQuery	.=	"n.title LIKE '%{$keyword}%' OR	";
		$strQuery	.=	"n.description LIKE '%{$keyword}%' OR	";
		$strQuery	.=	"n.situation LIKE '%{$keyword}%' OR	";
		$strQuery	.=	"nt.title LIKE '%{$keyword}%' ";
		
		$query 		=	$this->db->query($strQuery);
		$result 	= 	$query->result_array();
		
		return	$result;
	}
	
	/**
	  * @param array $bounds
	  * @param string $keyword  - Default null
	  * @param int $category_id - Default null - NOTE : this is type_id in the database
	  * @return array $result - the list of needs
	  */
	public function getViewportNeeds( $bounds = array() , $keyword = null, $category_id	=	null)
	{
		$this->load->model('Needs_status_actions');
		$this->load->model('Provisions');
		$this->load->model('Deliveries');
		
		$sql	= "SELECT n.*, n.title as need_title, "	.
				  "(SELECT `status` FROM needs_status_actions WHERE need_id = n.id ORDER BY `timestamp` DESC LIMIT 1) AS lsa, "	.
				  "( SELECT label FROM need_phases np WHERE np.id = n.phase ) AS phase_label, ".
				  "( SELECT action_text FROM need_status_messages nsm WHERE nsm.need_id = n.id ORDER BY action_msg_timestamp DESC LIMIT 0,1) AS last_status_message, ".
				  "( SELECT action_msg_time_unix FROM need_status_messages nsm WHERE nsm.need_id = n.id ORDER BY action_msg_timestamp DESC LIMIT 0,1) AS last_status_timestamp, ".
				  "nt.title as category "	.
				  "FROM needs n LEFT OUTER JOIN need_types nt ON n.type_id = nt.id WHERE "	.
				  "(n.longitude BETWEEN ".$bounds['west']." AND ".$bounds['east'].")	".
				  "AND (n.latitude BETWEEN ".$bounds['south']." AND ".$bounds['north'].")	"	.
				  "";
		if(!is_null($keyword))
		{
			$sql 	.=  "AND ( "	.	
						"n.title LIKE '%{$keyword}%' OR	"	.
						"n.description LIKE '%{$keyword}%' OR	"	.
						"n.situation LIKE '%{$keyword}%' OR	"	.
						"nt.title LIKE '%{$keyword}%' "	.
						") ";
		}
		
		if(!is_null($category_id))
		{
			$sql	.=	" AND n.type_id	= ".$category_id." ";
		}
		
		// Add limit & offset later
		
		//echo $sql;

		$result 	= 	$this->db->query($sql)->result_array();
		
		foreach($result as $k => $r){
			$result[$k]['status_actions']		=	$this->getNeedStatusActionLabels($r['id']);
			$result[$k]['provision_offers']		=	$this->Provisions->getProvisions( $r['id'] );
			$result[$k]['provision_accepted']	=	$this->Provisions->getAcceptedProvisions( $r['id'] );
			$result[$k]['delivery_offers']		=	$this->Deliveries->getDeliveries( $r['id'] );
			$result[$k]['delivery_accepted']	=	$this->Deliveries->getAcceptedDeliveries( $r['id'] );
		}

		return $result;
	}
	
	/**
	  * Get all nearby needs
	  * @param array $from
	  * @param string $keyboard
	  * @param float $radius
	  * @param int $cat
	  * @return array $result
	  */
	public function getNearByNeeds( $from , $keyword = null, $radius, $cat	=	null)
	{
		$f	=	explode(',', $from);
		
		$strSr	=	"SELECT n.* , "	.
					"n.title as need_title, "	.
					"(SELECT `status` FROM needs_status_actions WHERE need_id = n.id ORDER BY `timestamp` DESC LIMIT 1) AS lsa, ".
					"( SELECT label FROM need_phases np WHERE np.id = n.phase ) AS phase_label, ".
					"nt.title as category, "	.
					"( 3959 * acos( cos( radians('%s') ) * cos( radians( n.latitude ) ) * cos( radians( n.longitude ) - radians('%s') ) + sin( radians('%s') ) * sin( radians( n.latitude ) ) ) ) AS distance "	.
					"FROM needs n LEFT OUTER JOIN need_types nt ON n.type_id = nt.id "	.
					"WHERE 1=1 HAVING distance <= '%s' ORDER BY distance ";
		
		$sr		=  sprintf($strSr,$f[0],$f[1],$f[0],$radius);
		
		if(!is_null($keyword))
		{
			$keyw	 =	" WHERE 1=1 AND ( ";
			$keyw	.=	"n.title LIKE '%{$keyword}%' OR	";
			$keyw	.=	"n.description LIKE '%{$keyword}%' OR	";
			$keyw	.=	"n.situation LIKE '%{$keyword}%' OR	";
			$keyw	.=	"nt.title LIKE '%{$keyword}%' ";
			$keyw	.=	") ";
			
			$sr		 =	str_replace("WHERE 1=1", $keyw, $sr);
		}
		
		if(!is_null($cat))
		{
			$catw	=	" AND n.type_id	= ".$cat." HAVING ";
			$sr	=	str_replace("HAVING", $catw, $sr);
		}
		$query 		=	$this->db->query($sr);
		$result 	= 	$query->result_array();

		foreach($result as $k => $r)
		{
			$result[$k]['status_actions']	=	$this->getNeedStatusActionLabels($r['id']);
		}
		return	$result;
	}
	
	/**
	  * @param int $user_id
	  * @return array $result
	  */
	public function getActionRequireNeeds($user_id)
	{

		$sql	 =	"SELECT n.id, n.title, n.user_id, n.description, n.situation, n.location, n.latitude, n.longitude, n.photo, ";
		$sql	.=	"(SELECT label FROM need_phases np WHERE np.id = n.phase) AS phase, ";
		$sql	.=	"(SELECT COUNT(p.id) FROM provisions p WHERE p.need_id = n.id) AS pv,";
		$sql	.=	"(SELECT COUNT(d.id) FROM deliveries d WHERE d.need_id = n.id) AS dv, ";
		$sql	.=	"(SELECT title FROM need_types nt WHERE nt.id = n.type_id) AS category, ";
		$sql	.=	"(SELECT UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(n.created) ) AS need_age_unix, ";
		$sql	.=	"(SELECT UNIX_TIMESTAMP(n.created)) AS created_unix, ";
		$sql	.=	"(SELECT `status` FROM needs_status_actions WHERE need_id = n.id ORDER BY `timestamp` DESC LIMIT 1) AS lsa ";
		$sql	.=	"FROM needs n ";
		$sql	.=	"WHERE n.user_id = " .	(int) $user_id . " ";
		$sql	.=	"AND (";
		$sql	.=	"(SELECT COUNT(p.id) FROM provisions p WHERE p.need_id = n.id) > 0 ";
		$sql	.=	"OR ";
		$sql	.=	"(SELECT COUNT(d.id) FROM deliveries d WHERE d.need_id = n.id) > 0 ";
		$sql	.=	")";
		

		$query	=	$this->db->query($sql);
		$result	=	$query->result_array();
		
		foreach($result as $k => $r)
		{
			$result[$k]['status_actions']		=	$this->getNeedStatusActionLabels( $r['id'] );
			$result[$k]['provision_offers']		=	$this->Provisions->getProvisions( $r['id'] );
			$result[$k]['provision_accepted']	=	$this->Provisions->getAcceptedProvisions( $r['id'] );
			
			$result[$k]['delivery_offers']		=	$this->Deliveries->getDeliveries( $r['id'] );
			$result[$k]['delivery_accepted']	=	$this->Deliveries->getAcceptedDeliveries( $r['id'] );
		}
		
		return $result;
	}
	
	/**
	  * @param int $user_id
	  * @param array $result
	  */
	public function getInvolvedNeeds($user_id)
	{
		$sql	 =	"SELECT n.id, n.title, n.user_id, n.description, n.situation, n.location, n.latitude, n.longitude, n.photo, ";
		$sql	.=	"(SELECT label FROM need_phases np WHERE np.id = n.phase) AS phase, ";
		$sql	.=	"(SELECT title FROM need_types nt WHERE nt.id = n.type_id) AS category, ";
		$sql	.=	"(SELECT COUNT(p.id) FROM provisions p WHERE p.need_id = n.id) AS pv,";
		$sql	.=	"(SELECT COUNT(d.id) FROM deliveries d WHERE d.need_id = n.id) AS dv, ";
		$sql	.=	"(SELECT UNIX_TIMESTAMP(now()) - UNIX_TIMESTAMP(n.created) ) AS need_age_unix, ";
		$sql	.=	"(SELECT UNIX_TIMESTAMP(n.created)) AS created_unix, ";
		$sql	.=	"(SELECT `status` FROM needs_status_actions WHERE need_id = n.id ORDER BY `timestamp` DESC LIMIT 1) AS lsa ";
		$sql	.=	"FROM needs n ";
		$sql	.=	"WHERE n.user_id = " .	(int) $user_id . " ";
		$sql	.=	"AND (";
		$sql	.=	"(SELECT COUNT(p.id) FROM provisions p WHERE p.need_id = n.id) = 0 ";
		$sql	.=	"AND ";
		$sql	.=	"(SELECT COUNT(d.id) FROM deliveries d WHERE d.need_id = n.id) = 0 ";
		$sql	.=	")";
		
		$query	=	$this->db->query($sql);
		$result	=	$query->result_array();
		
		foreach($result as $k => $r)
		{
			$result[$k]['status_actions']		=	$this->getNeedStatusActionLabels( $r['id'] );
			$result[$k]['provision_offers']		=	$this->Provisions->getProvisions( $r['id'] );
			$result[$k]['provision_accepted']	=	$this->Provisions->getAcceptedProvisions( $r['id'] );
			
			$result[$k]['delivery_offers']		=	$this->Deliveries->getDeliveries( $r['id'] );
			$result[$k]['delivery_accepted']	=	$this->Deliveries->getAcceptedDeliveries( $r['id'] );
		}
		
		return $result;
	}
	
	
	/**
	  * @param int $user_id
	  * @param array $need_id
	  * @return array $result
	  */
	public function doesUserOfferedProvision( $user_id, $need_id) {
	
	}
	
	
	/**
	  * @param int $user_id
	  * @param array $need_id
	  * @return array $result
	  */
	public function doesUserOfferedDelivery( $user_id,  $need_id) {
	
	}
	
	/**
	  * @param int $user_id
	  * @param array $need_id
	  * @return array $result
	  */
	public function isNeedShared( $user_id,  $need_id) {
	
	}
	
	/**
	  * @param int $user_id
	  * @param array $need_id
	  * @return array $result
	  */
	public function doesUserIsInvolvedInNeed($user_id, $need_id) {
	
		$user_id = (int) $user_id;
		$need_id = (int) $need_id;
		
		$callProc	=	"CALL isUserInvolvedInTheNeed({$user_id}, {$need_id}, @shares, @provisions, @deliveries); ";
		$strSQL		=	"SELECT ";
		$strSQL	   .=	"@shares AS shares, ";
		$strSQL	   .=	"@provisions AS provisions, ";
		$strSQL	   .=	"@deliveries AS deliveries, ";
		$strSQL	   .=	"(@shares+@provisions+@deliveries) AS total_actions, ";
		$strSQL	   .=	"(CASE WHEN (@shares+@provisions+@deliveries) > 0 THEN 1 ELSE 0 END) AS is_involved; ";
		
		$this->db->trans_start();
			$this->db->query($callProc);
			$result = $this->db->query($strSQL);
		$this->db->trans_complete();
		
		$result  =	$result->result_array();
		$result[0]['query'] = $callProc . $strSQL;
		
		return isset($result[0]) ? $result[0] : array();
	}
}

/*
   /*
         * var_dump($this->_request->isXmlHttpRequest());
         * $this->_helper->layout->disableLayout();
         * $this->_helper->viewRenderer->setNeverRender();
         * if (!$this->getRequest()->isXmlHttpRequest() || !$this->getRequest()->isPost()) return;
         */