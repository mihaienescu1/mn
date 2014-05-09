<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Activities_comments_likes extends CI_Model
{
	private $__tableName	=	'activities_comments_likes';
	private $__fields		=	array('id', 'user_id', 'comment_id', 'time');
	
	/**
	  * @param int $user_id
	  * @param int $comment_id
	  * @return string - Status of the insertion
	  */
	public function add($user_id, $comment_id)
	{
		$add	=	$this->db->insert($this->__tableName, array('user_id'	=> (int) $user_id, 
																 'comment_id'	=>	(int) $comment_id));
		
		return $add ? 'LIKE_ADDED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Remove a single comment like using the user_id and comment_id
	  * @param $user_id
	  * @param $comment_id
	  * @return string - status of the removal request
	  */
	public function remove($user_id, $comment_id)
	{
		$this->db->where('user_id', (int) $user_id);
		$this->db->where('comment_id', (int) $comment_id);
		
		$delete	=	$this->db->delete($this->__tableName);
		
		return $delete ? 'LIKE_REMOVED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Remove all the comment likes done to a comment id
	  * @param int $comment_id
	  * @return string - status of the removal request 
	  */
	public function removeAll($comment_id)
	{
		$this->db->where('comment_id', (int) $comment_id);
		
		$delete	=	$this->db->delete($this->__tableName);
		
		return $delete ? 'LIKES_REMOVED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Check if the user liked a comment
	  * @param int $comment_id
	  * @param int $user_id
	  * @return boolean - True if the user liked, false if not
	  */
	public function isLiked($comment_id, $user_id)
	{
		$sql	=	"SELECT count(id) as CNT FROM {$this->__tableName} WHERE user_id = ".(int) $user_id .
					" AND comment_id = " . (int) $comment_id;
					
		$query	=	$this->db->query($sql);
		$result	=	$query->result_array();
		
		$rows	=	$result[0]['CNT'];
		
		error_log(var_export($sql, true));
		
		return ($rows > 0) ? true : false;
	}
}