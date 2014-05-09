<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Activities_likes extends CI_Model
{
	private $__tableName 	= 	'activities_likes';
	private $__fields 		= 	array('id', 'activity_id', 'user_id', 'when');
	
	private $__users_table = "users";
	
	public function __construct()
	{
		parent::__construct();
	}
	/**
	  * Add a new activity like
	  * @param int $activity_id
	  * @param int $user_id
	  * @return string - status of the insertion request
	  */
	public function add($activity_id, $user_id)
	{
		$add_like	=	$this->db->insert($this->__tableName, array('activity_id'	=> (int) $activity_id, 'user_id' => (int) $user_id) );
				
		if($add_like) {
			return 'LIKED';
		} else {
			return 'PROCESSING_ERROR';
		}
	}
	
	/**
	  * Remove an activity like
	  * @param int $activity_id
	  * @param int $user_id
	  * @return string - status of the activity like removal
	  */
	public function remove($activity_id, $user_id)
	{
		$this->db->where('activity_id', (int) $activity_id);
		
		if($user_id)
			$this->db->where('user_id', (int) $user_id);
		
		$remove_like	=	$this->db->delete($this->__tableName); 
		
		return $remove_like ? 'LIKE_REMOVED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Get all the activity likes using the activity id
	  * @param int $activity_id
	  * @return int $get_likes - the information about the likes the activity has gained
	  */
	public function get($activity_id)
	{	
		$sql	=	'SELECT `'.$this->__users_table.'`.`firstname`, 
						    `'.$this->__users_table.'`.`lastname`, 
							`'.$this->__users_table.'`.`gender`, 
							`'.$this->__users_table.'`.`photo`, 
							`'.$this->__users_table.'`.`id`, 
						    `'.$this->__tableName.'`.`id` as like_id , 
						    `'.$this->__tableName.'`.`activity_id` as activity_id , 
						    UNIX_TIMESTAMP(`'.$this->__tableName.'`.`when`) AS when_unix
					FROM `'.$this->__tableName.'`
					
					LEFT JOIN `'.$this->__users_table.'` ON `'.$this->__tableName.'`.`user_id` = `'.$this->__users_table.'`.`id`
					
					WHERE `'.$this->__tableName.'`.`activity_id` = ' . (int) $activity_id;

		$get_likes	=	$this->db->query($sql);

		$get_likes	=	$get_likes->result_array();
		
		return $get_likes;
	}
	
	/**
	  * Get all the activity likes count using the activity id
	  * @param int $activity_id
	  * @return int $get_likes - the count of the likes the activity has gained
	  */
	public function getCount($activity_id)
	{	
		$sql	=	"SELECT COUNT(u.id) AS CNT FROM users u , activities_likes l	"	.	
					"WHERE l.user_id = u.id "	.
					"AND l.activity_id = " . (int) $activity_id;
					
		$likes	=	$this->db->query($sql);
		$likes	=	$likes->result_array();
		
		$oLikes	=	(int)$likes[0]['CNT'];
		
		return $oLikes;
	}
	
	/**
	  * Check if a user liked an activity
	  * @param int $activity_id
	  * @param int $user_id
	  * @return boolean - true if the user liked the activity, false if not
	  */
	public function isLiked($activity_id, $user_id)
	{
		$isLiked	=	$this->db->get_where( $this->__tableName, array('activity_id' => (int) $activity_id, 'user_id' => (int) $user_id) );
		
		return ($isLiked->num_rows > 0)	? true : false;
	}
}