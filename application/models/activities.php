<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Activities extends CI_Model
{
	private $__tableName 		= 	'activities';
	private $__fields 			= 	array('id', 'user_id', 'need_id', 'content', 'created', 'modified', 'detect_links', 'type', 'has_file');
	private $__users_table  	= 	"users";
	private $__comment_table   	= 	"activities_comments";
	private $__like_table   	= 	"activities_likes";
	
	public function __construct()
	{
		parent::__construct();
		
		$this->load->model('Activities_comments');
		$this->load->model('Activities_likes');
	}
	
	/**
	  * @param int $need_id
	  * @param int $user_id
	  * @param string $content
	  * @param string $links Default : null
	  * @param string $type  Default : COMMENT
	  * @param string $meta_description Default : null
	  * @return boolean - true on successfully added, false on db error
	  */
	public function add($need_id, $user_id, $content, $links = null, $type	=	'COMMENT', $file = null, $meta_description = null)
	{
		$add	=	$this->db->insert($this->__tableName, array('need_id'			=>	(int)$need_id, 
																'user_id'			=>	(int)$user_id,
																'content'			=>	$content,
																'detect_links'		=>	$links,
																'type'				=>	$type,
																'has_file'			=>	$file,
																'meta_description'	=>	$meta_description
															));
		return $add ? true : false; 
	}
	
	/**
	  * @param id $user_provision_id 
	  * @param id $user_id 
	  * @param id $need_id 
	  * @return boolean - true on successfully deleted, false on db error
	  */
	public function del($activity_id, $user_id, $need_id)
	{
		$this->db->where('id',	(int) $activity_id);
		$this->db->where('user_id', (int) $user_id);
		$this->db->where('need_id', (int) $need_id);
		
		$del	=	$this->db->delete($this->__tableName);
		
		return ($del) ? true : false;
	}
	
	/**
	  * @param int $need_id
	  * @param int $limit - Default null - keep null if you want all entries
	  * @param int $offset - Default 0
	  * @return array $results
	  */
	public function getByNeedId($need_id, $limit, $offset)
	{
		$strQuery	=	"SELECT a.id AS activity_id, u.id AS act_user, u.firstname, u.lastname, u.status, u.username, u.email ,u.gender , u.photo, UNIX_TIMESTAMP(a.created) AS created_unix ,a.* FROM users u, {$this->__tableName} a WHERE a.user_id = u.id "	.
						//"AND a.type IN('COMMENT', 'SHARE_LINK', 'SOCIAL_LIKE', 'SOCIAL_SHARE') ".
						"AND	a.need_id	=	"	. (int) $need_id . ' ORDER BY a.created DESC';	

		$strQuery	.=	" LIMIT {$limit}, {$offset} ";
		
		$comments	=	$this->db->query($strQuery);
		
		$results	=	array('results'	=> $comments->result_array(), 
							  'rows'	=> $this->getCountListByNeedId($need_id));
		
		return $results;
	}
	
	/**
	  * @param int $need_id
	  * @param int $user_id - SideNote, this is needed to check if user already liked - Keep 0 if you want to display Like button anyway
	  * @param int $limit - Default null - keep null if you want all entries
	  * @param int $offset - Default 0
	  * @return array $results
	  */
	public function getByNeedIdWithInformation($need_id, $user_id ,$limit, $offset)
	{
		$strQuery	=	'SELECT `'.$this->__tableName.'`.`id` AS activity_id, 
								`'.$this->__users_table.'`.id AS act_user, 
								`'.$this->__users_table.'`.firstname, 
								`'.$this->__users_table.'`.lastname, 
								`'.$this->__users_table.'`.status, 
								`'.$this->__users_table.'`.username, 
								`'.$this->__users_table.'`.email,
								`'.$this->__users_table.'`.gender, 
								`'.$this->__users_table.'`.photo, 
								UNIX_TIMESTAMP(`'.$this->__tableName.'`.created) AS created_unix ,
								`'.$this->__tableName.'`.* ,
								(SELECT COUNT(`'.$this->__like_table.'`.`user_id`) FROM `'.$this->__like_table.'`
									WHERE `'.$this->__like_table.'`.`activity_id` = `'.$this->__tableName.'`.`id`
								) as like_count,
									
								(SELECT COUNT(`'.$this->__comment_table.'`.`id`) FROM `'.$this->__comment_table.'`
									WHERE `'.$this->__comment_table.'`.`activity_id` = `'.$this->__tableName.'`.`id`) as comment_count,
								
								IF(
								   (SELECT COUNT(`'.$this->__like_table.'`.`user_id`) 
								           FROM `'.$this->__like_table.'`
									       WHERE `'.$this->__like_table.'`.`activity_id` = `'.$this->__tableName.'`.`id`
										         AND `'.$this->__like_table.'`.`user_id` = '.(int)$user_id.'
									) > 0, 
									1, 0) as is_liked_by_current_user
						FROM `'.$this->__tableName.'`
							INNER JOIN `'.$this->__users_table.'` 
								ON `'.$this->__users_table.'`.`id` = `'.$this->__tableName.'`.`user_id`
						WHERE `'.$this->__tableName.'`.need_id	= '	. (int) $need_id . ' 
						ORDER BY `'.$this->__tableName.'`.created DESC
						';	
						
		$strQuery	.=	' LIMIT '.$limit.', '.$offset.' ';
		
		
							 
		$comments	=	$this->db->query($strQuery);
		
		$results	=	array('results'	=> $comments->result_array(), 
							  'rows'	=> $this->getCountListByNeedId($need_id));
		
		return $results;
	}
	
	/**
	  * Get entries count using the need id
	  * @param int $need_id
	  * @return int $total_entries - the number of total entries that belong to this need
	  */
	public function getCountListByNeedId($need_id){
		$strQueryAll	=	"SELECT COUNT(*) AS total FROM {$this->__users_table} u, {$this->__tableName} a WHERE a.user_id = u.id "	.
							"AND a.need_id	=	"	. (int) $need_id;
		
		$queryLimit	=	$this->db->query($strQueryAll);
		
		$queryResult = $queryLimit->result_array();
		
		$total_entries = $queryResult[0]['total'];
		
		return $total_entries;
	}
	
	/**
	  * @param int $need_id
	  * @return array $res
	  */
	public function getTypesCount($need_id)
	{
		$strQuery	=	"SELECT COUNT(id) as n , 
								type 
						 FROM {$this->__tableName} 
						 
						 WHERE need_id	=	" . (int)$need_id	.	" 
						 GROUP BY type	";
		
		$counts	=	$this->db->query($strQuery);
		$res	=	array();
		
		$counts	=	$counts->result_array();
		
		foreach($counts as $key	=>	$val)
			$res[$val['type']]	=	$val['n'];
		
		unset($counts);
		
		return $res;
	}
	
	public function getByUserId($user_id)
	{
		
	}
	
	public function getByActivityId($activity_id)
	{
		
	}
	
	/**
	  * @param string $meta
	  * @param int $need_id
	  * @param int $user_id
	  * @return array $q
	  */
	public function getMyMetaRow($meta, $need, $user)
	{
		$q	=	$this->db->get_where($this->__tableName, array('meta_description'	=> trim($meta),
															   'need_id' 			=> (int) $need,
															   'user_id'			=> (int) $user) 
										);
		$q	=	$q->result_array();
		
		return $q;
	}
}