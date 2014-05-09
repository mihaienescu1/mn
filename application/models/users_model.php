<?php

class Users_model extends CI_Model
{
	private $__tableName 	= 	'users';
	
	public function __construct()
	{
		parent::__construct();	
	}
	
	/**
	  * Return a single entry using the id identifier
	  * @param int $id
	  * @return array user - a single entry
	  */
	public function getById($id)
	{
		$res	=	$this->db->get_where($this->__tableName, array('id'	=> (int) $id));
		$res	=	$res->result_array();
		
		if(isset($res[0]))
			$res[0]['joined']	=	'Joined ' . $res[0]['created'];
		
		return isset($res[0]) ? $res[0] : array();
	}
	
	/**
	  * Return a single entry using the email identifier
	  * @param string $email 
	  * @return array user - a single entry
	  */
	public function getByEmail($email)
	{
		$res	=	$this->db->get_where( $this->__tableName, array('email'	=>	trim($email)) );
		$res	=	$res->result_array();
		
		return isset($res[0]) ? $res[0] : array();
	}
	
	public function getUserInfoByNeedId($need_id)
	{
		$sql	 =	"SELECT u.`id`, u.`username` , u.`created` , u.`firstname`, u.`about` , ";
		$sql	.=	"u.`customize` ,u.`email` , u.`firstname` , u.`lastname` , u.`gender` , ";
		$sql	.=	"u.`edited` , u.`status` , u.`photo`, n.`id` ";
		$sql	.=	"FROM users u , needs n ";
		$sql	.=	"WHERE n.`user_id` = u.`id` ";
		$sql	.=	"AND n.`id`	=" . (int) $need_id;
		
		$res	=	$this->db->query($sql);
		$res	=	$res->result_array();
		
		return	isset($res[0]) ? $res[0] : array();
	}
	
	/**
	  * Add a facebook user {'username', 'id', 'bio', 'info', 'gender', 'first_name', 'last_name','email','photo}
	  * @param $uinfo array 
	  * @return string|array - returns an array if user was successfully added, the array will contain the user information, it will return a string 'FB_USER_ADD_ERROR' if entry could not be inserted
	  */
	public function addFacebook($uinfo	=	array())
	{
		$userdata = array();
		
		if( isset($uinfo['username']) && !empty($uinfo['username'])){
			$userdata['username']	=	$uinfo['username'];
		} else {
			$uinfo['username']		=	$uinfo['id'];
		}
		
		if( isset($uinfo['bio']) && !empty($uinfo['bio'])) {
			$userdata['about']	=	$uinfo['bio'];
		} else {
			$uinfo['about']		=	'NULL';
		}
		
		$userdata['gender']			=	$uinfo['gender'];
		$userdata['firstname']		=	$uinfo['first_name'];
		$userdata['lastname']		=	$uinfo['last_name'];
		$userdata['email']			=	$uinfo['email'];
		$userdata['photo']			=	$uinfo['photo'];
		$userdata['password']		=	str_rot13( $this->__randomPassword() );
		
		$e = $this->db->get_where($this->__tableName, array('email' => $userdata['email']) );
		if($e->num_rows > 0) {
			$eq		=	$e->result_array();
			if(count($eq[0])) return $eq[0];
		} else {
			$add		=	$this->db->insert($this->__tableName, $userdata);
			$insert_id	=	$this->db->insert_id();
			$e 			= 	$this->db->get_where($this->__tableName, array('id' => (int) $insert_id) );
			$eq			=	$e->result_array();
			if(count($eq[0])) return $eq[0];
		}
		
		return	'FB_USER_ADD_ERROR';
	}
	
	
	private	function __randomPassword() 
	{ 
		$chars = "abcdefghijkmnopqrstuvwxyz023456789"; 
		srand((double)microtime()*1000000); 
		$i = 0; 
		$pass = '' ; 

		while ($i <= 7) { 
			$num = rand() % 33; 
			$tmp = substr($chars, $num, 1); 
			$pass = $pass . $tmp; 
			$i++; 
		} 
		return $pass; 
	}
}