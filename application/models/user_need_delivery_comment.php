<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_need_delivery_comment extends CI_Model
{
	private $__tableName 	= 	'user_need_delivery_comment';
	private $__fields 		= 	array('id', 'delivery_id', 'user_id', 'when', 'comment');
	
	public function __construct() {
		parent::__construct();
		
		$this->load->model('User_need_delivery_comment_like');
	}
	
	/**
	  * Add a new comment
	  * @param int $delivery_id
	  * @param int $user_id
	  * @param string $commentText - This will be trimmed
	  * @return string $status - The status of the operation text
	  */
	public function add($delivery_id, $user_id, $commentText)
	{
		$add_comment	=	$this->db->insert($this->__tableName, array('delivery_id'	=> (int) $delivery_id, 
																		'user_id' 		=> (int) $user_id,
																		'comment' 		=> trim($commentText) ) 
										);
		
		$status = $add_comment ? 'COMMENT_ADDED' : 'PROCESSING_ERROR';
		
		return $status;
	}
	
	/**
	  * Delete a comment, using comment_id and user_id for more security
	  * @param int $user_id
	  * @param int $comment_id
	  * @return string $status - The status of the operation text
	  */
	public function del($user_id, $comment_id)
	{
		if($user_id) 
			$this->db->where('user_id', (int) $user_id);
			
		if($comment_id)
			$this->db->where('id', (int) $comment_id);
			
		$del_comment	=	$this->db->delete($this->__tableName); 
		$del_likes		=	$this->User_need_delivery_comment_like->removeAll($comment_id);
		
		$status = ($del_comment && $del_likes)	? 'COMMENT_DELETED' : 'PROCESSING_ERROR';
		
		return $status;
	}
	
	/**
	  * Get All Comments that belong to a delivery
	  * @param int $delivery_id
	  * @param int $limit - Default value (string) 'none' - Keep this value to fetch all entries
	  * @param int $offset - Default value (string) 'none' - Keep this value to fetch all entries with no offset
	  * @param string $order - Default value (string) 'DESC'
	  * @return array $comments
	  */
	public function get($delivery_id, $limit = 'none', $offset = 'none', $order	=	'DESC')
	{
		$sql		=	"SELECT cm.delivery_id, cm.user_id, cm.when, cm.comment, cm.id,	UNIX_TIMESTAMP(cm.when) as comment_date_unix, "	.	
						"u.username, u.firstname, u.lastname, u.gender, u.photo, u.id as user_id "	.
						"FROM {$this->__tableName} cm, users u "	.
						"WHERE cm.user_id = u.id "	.
						"AND cm.delivery_id = " . (int) $delivery_id . " ORDER BY cm.when {$order} ";
	
		if($limit !== 'none' && $offset !== 'none')
			$sql.= " LIMIT {$limit}, {$offset} ";
		
		$query = $this->db->query($sql);
		
		$comments['results']	=	$query->result_array();
		$comments['total']		=	$this->getCount($delivery_id);
		
		return $comments; 
	}
	
	/**
	  * Get the Number of comments of a delivery
	  * @param int $delivery_id
	  * @return int $cCount - The Number of comments
	  */
	public function getCount($delivery_id)
	{
		$sql		=	"SELECT cm.delivery_id, COUNT(cm.id) AS comments_count "	.	
						"FROM {$this->__tableName} cm, users u "	.
						"WHERE cm.user_id = u.id "	.
						"AND cm.delivery_id = " . (int) $delivery_id;
		
		$query	=	$this->db->query($sql);
		$cCount	=	$query->result_array();
		
		$cCount	=	(int)$cCount[0]['comments_count'];
		
		return $cCount;
	}
	
}