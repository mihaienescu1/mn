<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_need_delivery_like extends CI_Model
{
	private $__tableName 	= 	'user_need_delivery_like';
	private $__fields 		= 	array('id', 'delivery_id', 'user_id', 'when');
	
	private $__users_table = "users";
	
	public function __construct()
	{
		parent::__construct();
	}
	
	public function add($delivery_id, $user_id)
	{
		$add_like	=	$this->db->insert($this->__tableName, array('delivery_id'	=> (int) $delivery_id, 'user_id' => (int) $user_id) );
		
		return ($add_like) ? 'LIKED' : 'PROCESSING_ERROR';
	}
	
	public function remove($delivery_id, $user_id)
	{
		$this->db->where('delivery_id', (int) $delivery_id);
		
		if($user_id)
			$this->db->where('user_id', (int) $user_id);
		
		$remove_like	=	$this->db->delete($this->__tableName); 
		
		return ($remove_like) ? 'LIKE_REMOVED' : 'PROCESSING_ERROR';
	}
	
	public function get($delivery_id)
	{	
		$sql	=	'SELECT `'.$this->__users_table.'`.`firstname`, 
						    `'.$this->__users_table.'`.`lastname`, 
							`'.$this->__users_table.'`.`gender`, 
							`'.$this->__users_table.'`.`photo`, 
							`'.$this->__users_table.'`.`id`, 
						    `'.$this->__tableName.'`.`id` as like_id , 
						    `'.$this->__tableName.'`.`delivery_id` as delivery_id , 
						    UNIX_TIMESTAMP(`'.$this->__tableName.'`.`when`) AS when_unix
					FROM `'.$this->__tableName.'`
					
					LEFT JOIN `'.$this->__users_table.'` ON `'.$this->__tableName.'`.`user_id` = `'.$this->__users_table.'`.`id`
					
					WHERE `'.$this->__tableName.'`.`delivery_id` = ' . (int) $delivery_id;

		$get_likes	=	$this->db->query($sql);

		$get_likes	=	$get_likes->result_array();
		
		return $get_likes;
	}
	
	public function getCount($delivery_id)
	{	
		$sql	=	'SELECT COUNT(u.id) AS CNT 
					 FROM '.$this->__users_table.' u , 
					      '.$this->__tableName.' l	
					 WHERE l.user_id = u.id
					   AND l.delivery_id = ' . (int) $delivery_id;
					
		$likes	=	$this->db->query($sql);
		$likes	=	$likes->result_array();
		
		$oLikes	=	(int)$likes[0]['CNT'];
		
		return $oLikes;
	}
	
	public function isLiked($delivery_id, $user_id)
	{
		$isLiked	=	$this->db->get_where( $this->__tableName, 
											  array(
												'delivery_id' => (int) $delivery_id, 
												'user_id' => (int) $user_id
												) 
											);
		
		return ($isLiked->num_rows > 0)	? true : false;
	}
}