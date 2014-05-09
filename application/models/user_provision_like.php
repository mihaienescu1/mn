<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_provision_like extends CI_Model
{
	private $__tableName 	= 	'user_provision_like';
	private $__fields 		= 	array('id', 'provision_id', 'user_id', 'when');
	
	private $__users_table  = "users";
	
	public function __construct()
	{
		parent::__construct();
	}
	
	/**
	  * Add a User Provision Like
	  * @param $provision_id
	  * @param $user_id
	  * @return string - the status of the insertion {'LIKED' : 'PROCESSING_ERROR'}
	  */
	public function add($provision_id, $user_id)
	{
		$add_like	=	$this->db->insert($this->__tableName, array('provision_id'	=> (int) $provision_id, 'user_id' => (int) $user_id) );
		
		return $add_like ? 'LIKED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * @param int $provision_id
	  * @param int $user_id
	  * @return string - the status of the removal {'LIKE_REMOVED' : 'PROCESSING_ERROR'} 
	  */
	public function remove($provision_id, $user_id)
	{
		$this->db->where('provision_id', (int) $provision_id);
		
		if($user_id)
			$this->db->where('user_id', (int) $user_id);
		
		$remove_like	=	$this->db->delete($this->__tableName); 
		
		return $remove_like ? 'LIKE_REMOVED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Fetch all likes done to a provision
	  * @param int $provision_id
	  * @return array $get_likes - the like list that have been awarded to this provision like
	  */
	public function get($provision_id)
	{	
		$sql	=	'SELECT `'.$this->__users_table.'`.`firstname`, 
						    `'.$this->__users_table.'`.`lastname`, 
							`'.$this->__users_table.'`.`gender`, 
							`'.$this->__users_table.'`.`photo`, 
							`'.$this->__users_table.'`.`id`, 
						    `'.$this->__tableName.'`.`id` as like_id , 
						    `'.$this->__tableName.'`.`provision_id` as provision_id , 
						    UNIX_TIMESTAMP(`'.$this->__tableName.'`.`when`) AS when_unix
					FROM `'.$this->__tableName.'`
					
					LEFT JOIN `'.$this->__users_table.'` ON `'.$this->__tableName.'`.`user_id` = `'.$this->__users_table.'`.`id`
					
					WHERE `'.$this->__tableName.'`.`provision_id` = ' . (int) $provision_id;

		$get_likes	=	$this->db->query($sql);

		$get_likes	=	$get_likes->result_array();
		
		return $get_likes;
	}
	
	/**
	  * Get like count done to a provision
	  * @param int $provision_id
	  * @return array $get_likes - the like count that have been awarded to this provision like
	  */
	public function getCount($provision_id)
	{	
		$sql	=	"SELECT COUNT(u.id) AS CNT FROM {$this->__users_table} u , {$this->__tableName} l	"	.	
					"WHERE l.user_id = u.id "	.
					"AND l.provision_id = " . (int) $provision_id;
					
		$likes	=	$this->db->query($sql);
		$likes	=	$likes->result_array();
		
		$oLikes	=	(int)$likes[0]['CNT'];
		
		return $oLikes;
	}
	
	/**
	  * Check if a user has liked a provision
	  * @param int $provision_id
	  * @param int $user_id
	  * @return boolean - true if the user likes the provision, false if he doesn't like it
	  */
	public function isLiked($provision_id, $user_id)
	{
		$isLiked	=	$this->db->get_where( $this->__tableName, array('provision_id' => (int) $provision_id, 'user_id' => (int) $user_id) );
		return $isLiked->num_rows > 0 ? true : false;
	}
}