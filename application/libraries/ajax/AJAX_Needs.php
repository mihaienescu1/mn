<?php
date_default_timezone_set('America/New_York');

class AJAX_Needs extends CI_Controller
{
	public static $CI = false;
	
	public function __construct() {
		parent::__construct();
		self::$CI = &get_instance();
		self::$CI->load->model('Need_status_messages');
		self::$CI->load->model('Users_model');
		self::$CI->load->library('utils');
	}
	
	public function getNeedTypes() {
		self::$CI->load->model('Need_types_model');
		
		$categories	= self::$CI->Need_types_model->getAll();
		
		return $categories;
	}
	
	/* Needs functions that wires up the database */
	
	public function addNeed() {
		$result		=	array('result' => 	'');
		
		self::$CI->load->model('Needs_model');
		
		$info	=	json_decode($_POST['my'], true);
		$geo	=	explode(",", $info['need_geo']);
		$need	=	array(
				
				'title'			=>	$info['need_title'],
				'description'	=>	$info['need_description'],
				'situation'		=>	$info['need_situation'],
				'location'		=>	$info['need_address'],
				'photo'			=>	$info['need_photo'],
				'type_id'		=>	$info['need_type_id'],
				'user_id'		=>	$info['need_user_id'],
				'latitude'		=>	$geo[0],
				'longitude'		=>	$geo[1]
		);
		
		$add	=	self::$CI->Needs_model->addNeed($need, $info['need_items']);
		
		if($add) {
			$result['result']	=	$add;
			
			self::$CI->load->model('Users_model');
			$uinfo = self::$CI->Users_model->getById($need['user_id']);
			
			$addMessage = self::$CI->Need_status_messages->add(array(
				'need_id' 		=> 	$add,
				'action_text'	=>	sprintf(DEFAULT_NEED_ADD_STATUS_MESSAGE_FORMAT, $uinfo['id'], $uinfo['firstname'], $uinfo['lastname'])
			));
		}
		else {
			$result['result']	=	'NEED_ADD_ERR';
		}
		
		return $result;
	}
	
	/* @Ported partially - > need new sql query */
	public function getNeedById() {
	
		$result		=	array('need' => 	'', 'status' => 'OK');
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Provisions');
		self::$CI->load->model('Deliveries');
		
		$need_id	=	(int)$_POST['need_id'];
		
		$result['need']	=	self::$CI->Needs_model->getNeed($need_id);
		$result['need']['pv_accepted']	=	self::$CI->Provisions->getAcceptedProvisions($need_id);
		$result['need']['dv_accepted']	=	self::$CI->Deliveries->getAcceptedDeliveries($need_id);
		$result['need']['created(team_page_format)'] = date("h:m A F d, Y", $result['need']['created_unix']);

		
		return $result;
	}
	
	public function updateNeed() {
	
		$result	=	array('status'	=>	'');
		self::$CI->load->model('Needs_model');
		
		$fields	=	json_decode($_POST['fields'], true);
		$need_id	=	(int) $fields['id'];
		unset($fields['id']);

		$result['status']	=	self::$CI->Needs_model->updateNeed($need_id,  $fields);
		
		return $result;
	}
	
	public function addActionStatus() {
	
		$result		=	array('status'	=>	'');
		$need_id	=	(int) $_POST['need_id'];	
		
		self::$CI->load->model('Needs_status_actions');
		
		return $result;
	}
	
	public function updateNeedItems() {
	
		$result	=	array('status'	=>	'OK');
		self::$CI->load->model('Needs_model');

		$need_id	=	$_POST['need_id'];
		$params		=	json_decode($_POST['params'], true);
		$errors		=	0;
		
		foreach($params['add'] as $text)
		{
			$add	=	self::$CI->Needs_model->addItemToNeed($need_id, $text);
			
			if(!$add)	$errors++;
		}
		
		foreach($params['del_ids'] as $item_id)
		{
			$del	=	self::$CI->Needs_model->deleteItem($need_id, $item_id);
			
			if(!$del)	$errors++;
		}
		
		foreach($params['update'] as $field)
		{
			$upd	=	self::$CI->Needs_model->updateNeedItem($field['id'], $need_id, $field['val']);
			
			if(!$upd)	$errors++;
		}
		
		if($errors > 0)	$result['status']	=	'UPDATE_ERRORS_AT_SOME_POINT';
		
		return $result;
	}
	
	public function getNeeds() {
	
		$result	=	array('status'	=>	'OK', 'needs'	=>	array());
		
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Users_model');
		self::$CI->load->library('ajax/AJAX_Geo');
		
		$needs	=	self::$CI->Needs_model->getAll();
		
		foreach($needs as $key	=>	$val)
		{
			$addrAry	=	self::$CI->ajax_geo->getCityStateByAddressString($val['location']);
			$userInfo	=	self::$CI->Users_model->getById($val['user_id']);
			
			$needs[$key]['city_state']	=	$addrAry['string'];
			$needs[$key]['user_info']	=	$userInfo;	
		}
		
		$result['needs']	=	$needs;
		
		return $result;
	}
	
	
	function getNeedsByKeyword() {
		
		$result	=	array('status'	=>	'OK', 'needs'	=>	array());
		
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Users_model');
		self::$CI->load->library('ajax/AJAX_Geo');
		
		$keyword = isset($_POST['keyword']) ? $this->input->post('keyword', true) : false ; 
		
		$needs	=	self::$CI->Needs_model->getByKeyword($keyword);
		
		
		foreach($needs as $key	=>	$val)
		{
			$addrAry	=	self::$CI->ajax_geo->getCityStateByAddressString($val['location']);
			$userInfo	=	self::$CI->Users_model->getById($val['user_id']);
			
			$needs[$key]['city_state']	=	$addrAry['string'];
			$needs[$key]['user_info']	=	$userInfo;	
		}

		$result['needs']	=	$needs;
		
		return $result;
	}
	
	function getViewPortNeeds() {
	
		$result	=	array('status'	=>	'OK', 'needs'	=>	array());
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Users_model');
		self::$CI->load->library('ajax/AJAX_Geo');
		
		if( !isset($_REQUEST['west'], $_REQUEST['east'], $_REQUEST['north'], $_REQUEST['south']) )
		{
			$result['status']	=	'NO_BOUNDS_PROVIDED';
			return $result;
		}
		
		$keyword	=	isset($_POST['keyword']) ? $_POST['keyword'] 	: 	null;
		$cat		=	isset($_POST['cat'])	?  $_POST['cat']		:	null;
		
		if($cat == "000") $cat = null;
		
		$needs		=	self::$CI->Needs_model->getViewportNeeds(array(
															'west' 	=> trim($_REQUEST['west']),
															'east' 	=> trim($_REQUEST['east']),
															'north' => trim($_REQUEST['north']),
															'south' => trim($_REQUEST['south']),
															), 
															$keyword, 
															$cat);
				
		foreach($needs as $key => $need) {
			$userInfo	=	self::$CI->Users_model->getById($need['user_id']);			
			$needs[$key]['user_info']	=	$userInfo;
			$needs[$key]['city_state']	=	'';
			$needs[$key]['last_activity_time_ago']	=	self::$CI->utils->time_since($need['last_status_timestamp']);
		}
		
		$markup = self::$CI->load->view(AJAX_HTML_MARKUP_VIEW_PREFIX . __FUNCTION__ , array('needs' => $needs), true);
		
		$result['needs']	=	$needs;
		$result['markup']	=	$markup;
		
		return $result;
	}
	
	public function getNearbyNeeds() {
	
		$result	=	array('status'	=>	'OK', 'needs'	=>	array());
		
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Users_model');
		self::$CI->load->library('ajax/AJAX_Geo');
		
		
		if(!isset($_POST['lat']) || !isset($_POST['lng']) || !isset($_POST['lat'], $_POST['lng']))
		{
			$result['status']	=	'NO_LAT_OR_LON_PROVIDED';
			return $result;
		}
		
		$keyword	=	isset($_POST['keyword']) ? $_POST['keyword'] 	: 	null;
		$radius		=	isset($_POST['radius'])	 ? $_POST['radius']	  	: 	null;
		$from		=	$_POST['lat']	.	','		.	$_POST['lng'];
		$cat		=	isset($_POST['cat'])	?  $_POST['cat']		:	null;
		
		if($cat	=== "000") $cat	=	null;
		
		$needs	=	self::$CI->Needs_model->getNearByNeeds($from, $keyword, (int)$radius , $cat);
		
		foreach ($needs as $key	=>	$val) {
			$userInfo								=	self::$CI->Users_model->getById($val['user_id']);			
			$needs[$key]['user_info']				=	$userInfo;
			$needs[$key]['city_state']				=	'';
		}
		
		$markup = self::$CI->load->view(AJAX_HTML_MARKUP_VIEW_PREFIX . __FUNCTION__ , array('needs' => $needs), true);
		
		$result['needs']	=	$needs;
		$result['markup']	=	$markup;
		$result['radius']	=	$radius;
		
		return $result;
	}
	
	public function updateNeedStatusActions() {
		self::$CI->load->model('Needs_status_actions');
		$need_id		=	(int) $_POST['need_id'];
		$result			=	array('status'	=>	'OK', 'need'	=>	'');
		$result['need']	=	$this->Needs_status_actions->updateStatusAction( $need_id );
		
		return $result;
	}
	
	public function nominateNeedProvider() {
		
		self::$CI->load->model('Provisions');
		
		$need_id	=	(int) $_POST['need'];
		$user_id	=	(int) $_POST['user'];
		$page		=	trim( $_POST['page'] );
		
		$result		=	array(	'status'	=>	'POST_ADDED_OK'	,
								'need_id'	=>	$need_id, 
								'user_id' 	=> 	$user_id,
								'page'		=>	$page	
						);
		
		$add	=	$this->Provisions->add($need_id, $user_id);
		
		if(!$add) {
			$result['status']	=	'ERROR';
			return $result;
		} 
		 
		$uinfo 		= self::$CI->Users_model->getById($user_id);
		$genderMsg  = ($uinfo['gender'] == 'female') ? 'herself' : 'himself';
	
		$addMessage = self::$CI->Need_status_messages->add(array(
			'need_id' 		=> $need_id,
			'action_text'	=>	sprintf(DEFAULT_NEED_PROVISION_NOMINATION_STATUS_MESSAGE_FORMAT, $uinfo['id'], $uinfo['firstname'], $uinfo['lastname'], $genderMsg)
		));
		
		return $result;
	}
	
	public function selectProvider() {
		self::$CI->load->model('Provisions');
			  
		$provision_id	=	(int) $_POST['provision'];
		$need_id		=	(int) $_POST['need'];
		$user_id		=	(int) $_POST['user'];
		
		$result	=	array('status'	=>	'OK',
						  'provision_id'	=>	$provision_id,
						  'need_id'			=>	$need_id);
						  
		$getAccept	=	self::$CI->Provisions->accept(
								array(
										'provision_id'	=>	$provision_id,
										'need_id'		=>	$need_id,
										'user_id'		=>	$user_id
									)
		);
		
		return $result;
	}
	
	public function selectDeliverer() {
		self::$CI->load->model('Deliveries');
			  
		$delivery_id	=	(int) $_POST['delivery'];
		$need_id		=	(int) $_POST['need'];
		$user_id		=	(int) $_POST['user'];
		
		$result	=	array('status'	=>	'OK',
						  'provision_id'	=>	$delivery_id,
						  'need_id'			=>	$need_id);
						  
		$getAccept	=	self::$CI->Deliveries->accept(array(
				'delivery_id'	=>	$delivery_id,
				'need_id'		=>	$need_id,
				'user_id'		=>	$user_id
			)
		);
		
		return $result;
	}
	
	public function nominateNeedDeliverer() {
		self::$CI->load->model('Deliveries');
		
		$need_id			=	(int) $_POST['need'];
		$user_id			=	(int) $_POST['user'];
		$provision_id		=	(int) $_POST['provision'];
		
		$result		=	array(	'status'			=>	'POST_ADDED_OK'	,
								'need_id'			=>	$need_id, 
								'user_id' 			=> 	$user_id,
								'provision_id'		=>	$provision_id	
						);
		
		$add	=	$this->Deliveries->add($need_id, $provision_id, $user_id);
		
		if(!$add) {
			$result['status']	=	'ERROR';
			return $result;
		}
		
		$uinfo 		= self::$CI->Users_model->getById($user_id);
		$genderMsg  = ($uinfo['gender'] == 'female') ? 'herself' : 'himself';
	
		$addMessage = self::$CI->Need_status_messages->add(array(
			'need_id' 		=> $need_id,
			'action_text'	=>	sprintf(DEFAULT_NEED_DELIVERY_NOMINATION_STATUS_MESSAGE_FORMAT, $uinfo['id'], $uinfo['firstname'], $uinfo['lastname'], $genderMsg)
		));
		
		return $result;
	}
	
	public function acceptDelivererRequest() {
		self::$CI->load->model('Deliveries');
		
		$delivery_id	=	(int)	$_POST['delivery'];
		$provision_id	=	(int) 	$_POST['provision'];
		$need_id		=	(int) 	$_POST['need'];
		$user_id		=	(int) 	$_POST['user'];
		$page			=	trim( 	$_POST['page'] 	);
		
		$result			=	array(	'status'		=>	'OK'	,
									'provision_id'	=>	$provision_id, 
									'need_id'		=>	$need_id,
									'user_id' 		=> 	$user_id,
									'page'			=>	$page	
						);
						
		$accept		=	$this->Provisions->accept($provision_id, $delivery_id, $user_id);
		
		if(!$accept)	$result['status']	=	'ERROR';
		
		return $result;
	}
	
	public function getActionRequireNeeds() {
		/*
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Users_model');
		
		$user_id	=	(int)	$_POST['user'];
		$user_data	=	self::$CI->Users_model->getById( $user_id );
		$limit		=	isset( $_POST['limit']  ) 	? (int)	$_POST['limit']		:	null;
		$offset		=	isset( $_POST['offset'] ) 	? (int)	$_POST['offset']	:	null;
		$result		=	array('status' => 'OK', 'user_id'	=> $user_id);
		$needs		=	self::$CI->Needs_model->getActionRequireNeeds($user_id);
		$markup		=	"";
		
		
		foreach($needs as $n)
		{
			$checkLiked			=	'';
			$checkShared		=	'';
			$checkProvided		=	'';
			$checkDelivered		=	'';
			/*
			if( in_array('liked', $n['status_actions']) ) 	$checkLiked		=	'on';
			if( in_array('shared', $n['status_actions']) ) 	$checkShared	=	'on';
			
			if( in_array('provide_pending', $n['status_actions']) ) 	$checkProvided	=	'pending';
			if( in_array('deliver_pending', $n['status_actions']) ) 	$checkDelivered	=	'pending';
			
			if( in_array('provided', $n['status_actions']) ) 	$checkProvided	=	'on';
			if( in_array('delivered', $n['status_actions']) ) 	$checkDelivered	=	'on';
			
			if($n['lsa']){
				if( $n['lsa'] === "liked" ) 
						$checkLiked	.=	" lastaction";
				if( $n['lsa'] === "shared" ) 
						$checkShared	.=	" lastaction";
				if( $n['lsa'] === "provided" || $n['lsa'] === "provide_pending") 
						$checkProvided	.=	" lastaction";
				if( $n['lsa'] === "delivered" || $n['lsa'] === "deliver_pending") 
						$checkDelivered.=	" lastaction";
			}
			
			$markup .= '<article class="need">';
					$markup .= '<div class="thumbnail">';
					$markup .= '<span class="photo type-2">';
					$markup	.= '<img src="'	.	base_url()	.	'photos/needs/'.$n['photo']	.	'" width="120" height="102" />';
					$markup .= '</span>';
						$markup .= '<div class="need_status_graph" id="'.$n['id'].'">';
							$markup .= '<div class="check liked '.$checkLiked.'"></div>';
							$markup .= '<div class="check shared '.$checkShared.'"></div>';
							$markup .= '<div class="check provided '.$checkProvided.'"></div>';
							$markup .= '<div class="check delivered '.$checkDelivered.'"></div>';
						$markup .= '</div>';
					$markup .= '</div>';
					$markup .= '<div class="details">';
					  $markup .= '<h2><a href="">'	.	$n['title']	.	'</a></h2>';
					  $markup .= '<div class="location"><span class="icon"></span> '	.	$n['location']	.	'</div>';
					$markup .= '</div>';
					$markup .= '<a href="javascript:void(0);" class="view-details-arrow" id="'.$n['id'].'">View Need Details</a>';
					$markup .= '<div class="needs-actions">';
					  $markup .= '<div class="needs-activity-action" id="'.$n['id'].'">';
						$markup .= '<dl>';

						$action_date 	=	'Wed, 02/01/2012 - 00:30';
						$action_text	=	'has offered to Provide <a href="#">'.$n['title'].'</a>.';
						$action_user	=	$user_data['firstname'] . ' ' . $user_data['lastname'];
		
						
						$markup .= '<div class="needs-status">';
							$markup .= '<div class="recent-activity">';
								
								$markup .= '<span class="activity-timestamp">'.$action_date.'</span>';
								$markup .= '<span class="activity-message"> ';
								$markup .= '<a href="#" class="user">'.$action_user.'</a> ';
								$markup .= $action_text;
								$markup .= '</span>';
								
							$markup .= '</div>';
						$markup .= '</div>';

						$markup .= '</dl>';
					  $markup .= '</div>';
					  
					$markup .= '</div>';
				  $markup .= '</article>';
		}
		
		$result['result']	=	$needs;
		$result['markup']	=	$markup;
		
		return $result;
		*/
		
		return array();
	}
	
	public function getInvolvedNeeds() {
		$user_id	=	(int) $_POST['user'];
		$result		=	array('status'=>'OK', 'user_id'=> $user_id, 'result' =>'');
		
		self::$CI->load->model('Needs_model');
		
		$needs	=	self::$CI->Needs_model->getActionRequireNeeds($user_id);
		
		$markup	=	"";
		$markup	.= '<h3>My Open Needs</h3>';
		
		foreach($needs as $n)
		{
			
			$checkLiked			=	'';
			$checkShared		=	'';
			$checkProvided		=	'';
			$checkDelivered		=	'';
			
			if( in_array('liked', $n['status_actions']) ) 	$checkLiked		=	'on';
			if( in_array('shared', $n['status_actions']) ) 	$checkShared	=	'on';
			
			if( in_array('provide_pending', $n['status_actions']) ) 	$checkProvided	=	'pending';
			if( in_array('deliver_pending', $n['status_actions']) ) 	$checkDelivered	=	'pending';
			
			if( in_array('provided', $n['status_actions']) ) 	$checkProvided	=	'on';
			if( in_array('delivered', $n['status_actions']) ) 	$checkDelivered	=	'on';
			
			if($n['lsa']){
				if( $n['lsa'] === "liked" ) 
						$checkLiked	.=	" lastaction";
				if( $n['lsa'] === "shared" ) 
						$checkShared	.=	" lastaction";
				if( $n['lsa'] === "provided" || $n['lsa'] === "provide_pending") 
						$checkProvided	.=	" lastaction";
				if( $n['lsa'] === "delivered" || $n['lsa'] === "deliver_pending") 
						$checkDelivered.=	" lastaction";
			}
			
			$markup .= '<article class="need">';
					$markup .= '<div class="thumbnail">';
					$markup .= '<span class="photo type-2">';
					$markup	.= '<img src="'	.	base_url()	.	'photos/needs/'.$n['photo']	.	'" width="120" height="102" />';
					$markup .= '</span>';
						$markup .= '<div class="need_status_graph" id="'.$n['id'].'">';
							$markup .= '<div class="check liked '.$checkLiked.'"></div>';
							$markup .= '<div class="check shared '.$checkShared.'"></div>';
							$markup .= '<div class="check provided '.$checkProvided.'"></div>';
							$markup .= '<div class="check delivered '.$checkDelivered.'"></div>';
						$markup .= '</div>';
					$markup .= '</div>';
					$markup .= '<div class="details">';
					  $markup .= '<h2><a href="">'	.	$n['title']	.	'</a></h2>';
					  $markup .= '<div class="location"><span class="icon"></span> '	.	$n['location']	.	'</div>';
					$markup .= '</div>';
					$markup .= '<a href="javascript:void(0);" class="view-details-arrow" id="'.$n['id'].'">View Need Details</a>';
					$markup .='<div class="fb_btn_extended">';
					$markup .='<fb:like href="http://qa.microneeds.com/#aneed_admin?n='.$n['id'].'" send="false" layout="standard" width="450" show_faces="false" font="arial"></fb:like>';
					$markup .='</div>';
					$markup .= '<div class="needs-actions">';
					  $markup .= '<div class="needs-activity-action" id="'.$n['id'].'">';
						$markup .= '<dl>';
					
						//Wed, 02/01/2012 - 00:30
						//$action_date	=	date('D, m/d/Y - h:i', $action_date);
						$action_date 	=	'Wed, 02/01/2012 - 00:30';
						$action_text	=	'has offered to Provide <a href="#">'.$n['title'].'</a>.';
						$action_user	=	'Mihai Enescu';
				// block ver start
				
				/*
			$markup .='<div class="fb_btn nth act">';
					$markup .='<fb:like href="http://dev.microneeds.com/#aneed_admin?n='.$n['id'].'" send="false" layout="standard" width="450" show_faces="false" font="arial"></fb:like>';
			$markup .='</div>';
			*/
//				
				// block ver end
						$markup .= '<div class="needs-status">';
							$markup .= '<div class="recent-activity">';
								/*
								$markup .= '<span class="activity-timestamp">'.$action_date.'</span>';
								$markup .= '<span class="activity-message"> ';
								$markup .= '<a href="#" class="user">'.$action_user.'</a> ';
								$markup .= $action_text;
								$markup .= '</span>';
								*/
								
							$markup .= '</div>';
						$markup .= '</div>';

						$markup .= '</dl>';
					  $markup .= '</div>';
					  
					$markup .= '</div>';
				  $markup .= '</article>';
		}
		
		$result['json']	=	$needs;
		$result['markup']	=	$markup;
		
		return $result;
		
	}
	
	public function getNeedOwnerInfo() {
	
		$need_id	=	(int) $_POST['need_id'];
		
		$viewData	=	array('is_need_owner' => false);
		$result		=	array(	'status'	=>		'OK',
								'need_id'	=>		$need_id,
								'result' 	=> 		null
							);
		self::$CI->load->model('Users_model');
		self::$CI->load->model('Needs_model');
		
		$oInfo		=	self::$CI->Users_model->getUserInfoByNeedId( $need_id );
		$nInfo		=	self::$CI->Needs_model->getNeedMinimalInfo( $need_id );
		
		
		if($nInfo['user_id'] == $oInfo['id']) {
			$viewData['is_need_owner'] = true;
		}
		$viewData 	= 	array('userData' => $oInfo, 
							  'viewData' => $viewData
						);
		$markup = self::$CI->load->view(AJAX_HTML_MARKUP_VIEW_PREFIX . __FUNCTION__ , $viewData, true);
		
		$result['result']	=	$oInfo;
		$result['view']		=	$markup;
		return $result;
	}
	
	public function doesUserOfferedProvision() {
		self::$CI->load->model('Needs_model');
		
		$result	=	array('isNeedOwner' => 0, 'isProvisionOffer' => 0, 'isNeedShared' => 0);
		$user	=	(int) $_POST['user'];
		$need	=	(int) $_POST['need'];
		
		$offer	=	self::$CI->Needs_model->doesUserOfferedProvision($need, $user);
		$share	=	self::$CI->Needs_model->isNeedShared($need, $user);
		
		return $result;
	}
	
	public function doesUserOfferedDelivery() {
		self::$CI->load->model('Needs_model');
		
		$result	=	array('isNeedOwner' => 0, 'isDeliveryOffer' => 0, 'isNeedShared' => 0);
		$user	=	(int) $_POST['user'];
		$need	=	(int) $_POST['need'];
		
		$offer	=	self::$CI->Needs_model->doesUserOfferedDelivery($need, $user);
		$share	=	self::$CI->Needs_model->isNeedShared($need, $user);
		
		return $result;
	}
	
	public function doesUserIsInvolvedInNeed() {
		self::$CI->load->model('Needs_model');
		
		$result	=	array( 'status' => 'OK', 'info' => array() );
		$user	=	(int) $_POST['user'];
		$need	=	(int) $_POST['need'];
		
		$offer	=	self::$CI->Needs_model->doesUserIsInvolvedInNeed($user, $need);
		if(is_array($offer)) {
			$result['info'] = $offer;
		} else {
			$result['status'] = 'ERROR';
		}
		
		return $result;
	}
}