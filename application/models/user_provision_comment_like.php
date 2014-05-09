<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_provision_comment_like extends CI_Model
{
	private $__tableName	=	'user_provision_comment_like';
	private $__fields		=	array('id', 'user_id', 'comment_id', 'time');
	
	/**
	  * Add a user provision comment like
	  * @param int $user_id
	  * @param int $comment_id
	  * @return string add_status - returns the status of the add insertion request {LIKE_ADDED : PROCESSING_ERROR}
	  */
	public function add($user_id, $comment_id)
	{
		$add	=	$this->db->insert($this->__tableName, array('user_id'		=>  (int) $user_id, 
																'comment_id'	=>	(int) $comment_id));
		
		return $add ? 'LIKE_ADDED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * @param int $user_id
	  * @param int $comment_id
	  * @return string - string with the status of the removal {LIKE_REMOVED : PROCESSING_ERROR}
	  */
	public function remove($user_id, $comment_id)
	{
		$this->db->where('user_id', (int) $user_id);
		$this->db->where('comment_id', (int) $comment_id);
		
		$delete	=	$this->db->delete($this->__tableName);
		
		return ($delete) ? 'LIKE_REMOVED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Remove all the comment likes using the comment id
	  * @param int $comment_id
	  * @return string remove_status - string with the status of the removal {LIKES_REMOVED : PROCESSING_ERROR}
	  */
	public function removeAll($comment_id)
	{
		$this->db->where('comment_id', (int) $comment_id);
		
		$delete	=	$this->db->delete($this->__tableName);
		
		return $delete ? 'LIKES_REMOVED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Check if a comment is liked by the uer
	  * @param int $comment_id
	  * @param int $user_id
	  * @return boolean, true if the user liked the comment, false if not
	  */
	public function isLiked($comment_id, $user_id)
	{
		$sql	=	"SELECT count(id) as CNT FROM {$this->__tableName} WHERE user_id = ".(int) $user_id .
					" AND comment_id = " . (int) $comment_id;
					
		$query	=	$this->db->query($sql);
		$result	=	$query->result_array();
		
		$rows	=	$result[0]['CNT'];
		
		error_log(var_export($sql, true));
		
		return $rows > 0 ? true : false;
	}
}