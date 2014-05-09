<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_provision_comment extends CI_Model
{
	private $__tableName 	= 	'user_provision_comment';
	private $__fields 		= 	array('id', 'provision_id', 'user_id', 'when', 'comment');
	
	public function __construct() {
		parent::__construct();
	}
	
	/**
	  * Add a new provision comment
	  * @param int $provision_id
	  * @param int $user_id
	  * @param string $commentText
	  * @return string - the status of the add request {COMMENT_ADDED : PROCESSING_ERROR}
	  */
	public function add($provision_id, $user_id, $commentText)
	{
		$add_comment	=	$this->db->insert($this->__tableName, array('provision_id'	=> (int) $provision_id, 
																		'user_id' 		=> (int) $user_id,
																		'comment' 		=> trim($commentText) ) 
										);
		
		return $add_comment ? 'COMMENT_ADDED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Delete a provision comment
	  * @param int $user_id
	  * @param int $comment_id
	  * @return string - the status of the delete request
	  */
	public function del($user_id, $comment_id)
	{
		if($user_id) 
			$this->db->where('user_id', (int) $user_id);
			
		if($comment_id)
			$this->db->where('id', (int) $comment_id);
			
		$del_comment	=	$this->db->delete($this->__tableName); 
		$del_likes		=	$this->User_provision_comment_like->removeAll($comment_id);
		
		return ($del_comment && $del_likes)	? 'COMMENT_DELETED' : 'PROCESSING_ERROR';
	}
	
	/**
	  * Get the comment list of a provision
	  * @param int $provision_id
	  * @param int $limit - Default 'none'
	  * @param int $offset - Default 'none'
	  * @param string $order - Default DESC
	  * @return array $comments - bidimensional array {results , total}
	  */
	public function get($provision_id, $limit = 'none', $offset = 'none', $order	=	'DESC')
	{
		$sql		=	"SELECT cm.provision_id, cm.user_id, cm.when, cm.comment, cm.id,	UNIX_TIMESTAMP(cm.when) as comment_date_unix, "	.	
						"u.username, u.firstname, u.lastname, u.gender, u.photo, u.id as user_id "	.
						"FROM {$this->__tableName} cm, users u "	.
						"WHERE cm.user_id = u.id "	.
						"AND cm.provision_id = " . (int) $provision_id . " ORDER BY cm.when {$order} ";
	
		if($limit !== 'none' && $offset !== 'none')
			$sql.= " LIMIT {$limit}, {$offset} ";
		
		$query = $this->db->query($sql);
		
		$comments['results']	=	$query->result_array();
		$comments['total']		=	$this->getCount($provision_id);
		
		return $comments; 
	}
	
	/**
	  * Return the number of comments done on a specific provision
	  * @param int $provision_id
	  * @return int $cCount - returns the number of comments that have been done on this provision
	  */
	public function getCount($provision_id)
	{
		$sql		=	"SELECT cm.provision_id, COUNT(cm.id) AS comments_count "	.	
						"FROM {$this->__tableName} cm, users u "	.
						"WHERE cm.user_id = u.id "	.
						"AND cm.provision_id = " . (int) $provision_id;
		
		$query	=	$this->db->query($sql);
		$cCount	=	$query->result_array();
		
		$cCount	=	(int)$cCount[0]['comments_count'];
		
		return $cCount;
	}
	
}