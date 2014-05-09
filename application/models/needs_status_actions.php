<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Needs_status_actions extends CI_Model
{
	private $__tableName 		= 	'needs_status_actions';
	private $__fields			=	array('id','need_id','status');
	
	public function __construct() {
		parent::__construct();
	}
	
	/**
	  * @param int $need_id
	  * @return array $result_array
	  */
	public function getStatusesArray($need_id) {
		$query 		  = $this->db->get_where($this->__tableName, array('need_id' => (int)$need_id));
		$result_array =	$query->result_array();
		return $result_array;
	}
	
	/**
	  * @param int $need_id
	  * @return array $result_array
	  */
	public function getStatusesText($need_id) {
		$arrayIn	=	$this->getStatusesArray($need_id);
		$arrayOut	=	array();
		foreach($arrayIn as $arr) {
			$arrayOut[] = $arr['status'];
		}
		
		return $arrayOut;
	}
	
	/**
	  * @param int $need_id
	  * @param string $strStatus - this string will be trimmed
	  * @return boolean 
	  */
	public function addStatus($need_id, $strStatus)
	{
		$cnt	=	$this->db->get_where($this->__tableName, array('need_id' => (int) $need_id, 'status' => trim($strStatus) ) );

		if($cnt->num_rows == 0)
		{
			$add	=	$this->db->insert($this->__tableName, array('need_id'	=>	(int) $need_id, 'status'	=>	trim($strStatus) ));
			
			return ($add) ? true : false;
		}
		return false;
	}
	
	/**
	  * @param int $need_id
	  * @param string $status
	  * @return boolean - true if the entry was successfully added, false if a db error has triggered
	  */
	public function delStatus($need_id, $status)
	{
		$this->db->where('need_id', (int) $need_id);
		$this->db->where('status', 	$status);
		
		$del 	=	$this->db->delete( $this->__tableName );
		
		return ($del) ? true : false;
	}
	
	/**
	  * This feature is not yet implemented
	  * @param int $need_id
	  * @return void
	  */
	public function refreshStatus($need_id)
	{
		$allStatuses	=	$this->getStatusesArray($need_id);
		
		$shares		=	null;
		$likes		=	null;
		$provided	=	null;
		$delivered	=	null;
	}
	
	/**
	  * @param int $need_id
	  * @return array  - will return the thing that this function returns $this->Needs_model->getNeed($need_id);
	  */
	public function updateStatusAction($need_id)
	{
		
		$this->load->model('Activities');
		$this->load->model('Provisions');
		$this->load->model('Deliveries');
		$this->load->model('Need_statuses');
		$this->load->model('Needs_model');
		
		if( !isset( $need_id ) || empty( $need_id ) ) {
			return false;
		}
		
		$meta					=	array();
		$need_id				=	(int) $need_id;
		$activities				=	$this->Activities->getTypesCount($need_id);
		$allowedStatuses		=	array_keys ( $this->Need_statuses->getAll() );
		
		$meta['likes']			=	(isset($activities['LIKE']) && count($activities['LIKE']) )		   			? $activities['LIKE'] 			: 0;
		$meta['comments']		=	(isset($activities['COMMENT']) && count($activities['COMMENT']) )	   		? $activities['COMMENT'] 		: 0;
		$meta['shares']			=	(isset($activities['SHARE_LINK']) && count($activities['SHARE_LINK']) )  	? $activities['SHARE_LINK'] 	: 0;
		$meta['photos']			=	(isset($activities['SHARE_PHOTO']) && count($activities['SHARE_PHOTO']) ) 	? $activities['SHARE_PHOTO'] 	: 0;
		$meta['fb:shares']		=	(isset($activities['SOCIAL_SHARE']) && count($activities['SOCIAL_SHARE']) ) ? $activities['SOCIAL_SHARE'] 	: 0;
		$meta['fb:likes']		=	(isset($activities['SOCIAL_LIKE']) && count($activities['SOCIAL_LIKE']) ) 	? $activities['SOCIAL_LIKE'] 	: 0;
		
		$meta['pv_offers']		=	$this->Provisions->getOffersCount($need_id);
		$meta['pv_accepted']	=	$this->Provisions->getAcceptedProvision($need_id);
		$meta['pv_finalized'] 	=	$this->Provisions->getFinalizedProvisions($need_id);
		
		$meta['dv_offers']		=	$this->Deliveries->getOffersCount($need_id);
		$meta['dv_accepted']	=	$this->Deliveries->getAcceptedDelivery($need_id);
		$meta['dv_finalized'] 	=	$this->Deliveries->getFinalizedDeliveries($need_id);
		
		$boolOK		=	false;
		
		if($meta['fb:shares'] > 0) {
			if( $this->addStatus($need_id, 'shared') ) $boolOK = true; else $boolOK = false;
		} else {
			if( $this->delStatus($need_id, 'shared') ) $boolOK = true; else $boolOK = false;
		}
		
		if($meta['fb:likes'] > 0) {
			if( $this->addStatus($need_id, 'liked') ) $boolOK = true; else $boolOK = false;
		} else {
			if( $this->delStatus($need_id, 'liked') ) $boolOK = true; else $boolOK = false;
		}
		
		if(is_array($meta['pv_accepted']) && count($meta['pv_accepted'])){
			if( $this->addStatus($need_id, 'provide_pending') ) $boolOK = true; else $boolOK = false;
		}
		else {
			if( $this->delStatus($need_id, 'provide_pending') ) $boolOK = true; else $boolOK = false;
		}
		
		if(is_array($meta['dv_accepted']) && count($meta['dv_accepted'])){
			if( $this->addStatus($need_id, 'deliver_pending') ) $boolOK = true; else $boolOK = false;
		}
		else {
			if( $this->delStatus($need_id, 'deliver_pending') ) $boolOK = true; else $boolOK = false;
		}
		
		if(is_array($meta['pv_finalized']) && count($meta['pv_finalized'])){
			if( $this->addStatus($need_id, 'provided') ) $boolOK = true; else $boolOK = false;
		}
		else {
			if( $this->delStatus($need_id, 'provided') ) $boolOK = true; else $boolOK = false;
		}
		
		if(is_array($meta['dv_finalized']) && count($meta['dv_finalized'])){
			if( $this->addStatus($need_id, 'delivered') ) $boolOK = true; else $boolOK = false;
		}
		else {
			if( $this->delStatus($need_id, 'delivered') ) $boolOK = true; else $boolOK = false;
		}
		
		if($boolOK) {
			return $this->Needs_model->getNeed( $need_id );
		} 
		
		return false;
		
	}
	
}