<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Activities_comments extends CI_Model
{
	private $__tableName 	= 	'activities_comments';
	private $__fields 		= 	array('id', 'activity_id', 'user_id', 'when', 'comment');
	
	public function __construct()
	{
		parent::__construct();
	}
	
	/**
	  * Add a new comment
	  * @param int $activity_id
	  * @param int $user_id
	  * @param string $commentText - This will be trimmed
	  * @return string $status - The status of the operation text
	  */
	public function add($activity_id, $user_id, $commentText)
	{
		$add_comment	=	$this->db->insert($this->__tableName, array('activity_id'	=> (int) $activity_id, 
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
		$del_likes		=	$this->Activities_comments_likes->removeAll($comment_id);
		
		$status = ($del_comment && $del_likes)	? 'COMMENT_DELETED' : 'PROCESSING_ERROR';
		
		return $status;
	}
	
	/**
	  * Get All Comments that belong to a activity
	  * @param int $activity_id
	  * @param int $limit - Default value (string) 'none' - Keep this value to fetch all entries
	  * @param int $offset - Default value (string) 'none' - Keep this value to fetch all entries with no offset
	  * @param string $order - Default value (string) 'DESC'
	  * @return array $comments
	  */
	public function get($activity_id, $limit = 'none', $offset = 'none', $order	=	'DESC')
	{
		$sql		=	'SELECT cm.activity_id, 
								cm.user_id, 
								cm.when, 
								cm.comment, 
								cm.id,	
								UNIX_TIMESTAMP(cm.when) as comment_date_unix,
								u.username, 
								u.firstname, 
								u.lastname, 
								u.gender, 
								u.photo, 
								u.id as user_id
						FROM '.$this->__tableName.' cm, users u 
						WHERE cm.user_id = u.id 
							AND cm.activity_id = ' . (int) $activity_id	. '
     					ORDER BY cm.when '.$order.' ';
	
		if($limit !== 'none' && $offset !== 'none') {
			$sql.= " LIMIT {$limit}, {$offset} ";
		}
		
		$query		=	$this->db->query($sql);
		
		$comments['results']	=	$query->result_array();
		$comments['total']		=	$this->getCount($activity_id);
		
		return $comments; 
	}
	
	/**
	  * Get the Number of comments of a activity
	  * @param int $activity_id
	  * @return int $cCount - The Number of comments
	  */
	public function getCount($activity_id)
	{
		$sql		=	"SELECT cm.activity_id, COUNT(cm.id) AS comments_count "	.	
						"FROM {$this->__tableName} cm, users u "	.
						"WHERE cm.user_id = u.id "	.
						"AND cm.activity_id = " . (int) $activity_id;
		
		$query	=	$this->db->query($sql);
		$cCount	=	$query->result_array();
		
		$cCount	=	(int)$cCount[0]['comments_count'];
		
		return $cCount;
	}
	
}