<?php
date_default_timezone_set('America/Los_Angeles');

class AJAX_UserNeedDelivery extends CI_Controller
{
	public static $CI = false;
	
	public function __construct() {
		parent::__construct();
		self::$CI = &get_instance();
		self::$CI->load->library('utils');
		self::$CI->load->model('User_need_delivery');
		self::$CI->load->model('User_need_delivery_like');
		self::$CI->load->model('User_need_delivery_comment');
		self::$CI->load->model('User_need_delivery_comment_like');
	}
	
	public function add() {
		$response		=	array('status'	=>	'');
		
		$type				=	'COMMENT';
		$need				=	$_POST['need_id'];
		$user				=	$_POST['user_id'];
		$content			=	$_POST['content'];
		$updateStatus		=	0;
		$hasLinks			=	null;
		$filepath			=	null;
		$meta_description	=	null;
		
		$regex_url	= 	"/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
		preg_match($regex_url, $content, $urls);
		
		if(count($urls)) {
			$hasLinks	=	$urls[0];
			$type		=	'SHARE_LINK';
			
			$tags = get_meta_tags($hasLinks);
			
			if( isset($tags['description']) && !empty($tags['description']) )
			{
				$meta_description	=	$tags['description'];
			}
		}
		
		if(isset($_POST['delivery_type']) && !empty($_POST['delivery_type'])) {
			$type	=	trim($_POST['delivery_type']);
		}
		
		if(isset($_POST['meta']) && !empty($_POST['meta'])) {
			$meta_description	=	trim($_POST['meta']);
		}
		
		if(isset($_POST['update_status']) && !empty($_POST['update_status'])) {
			$updateStatus	=	1;
		}
		
		$addPost	=	self::$CI->User_need_delivery->add($need, $user, $content, $hasLinks, $type, $filepath, $meta_description);
		
		$response['need_id'] = $need;
		
		if($updateStatus	>	0) {
			$response['update_status']	=	'1';
		}
		
		if($addPost)
			$response['status']		=	'POST_ADDED_OK';
		else
			$response['status']		=	'PROCESSING_ERROR';
		
		return $response;
	}
	
	public function delete() {
		$need				=	$_POST['need_id'];
		$user				=	$_POST['uid'];
		$meta				=	null;
		$delivery			=	null;
		$deletePost			=	false;
		$deleteComments		=	false;
		$deleteLikes		=	false;
		
		if (isset($_POST['meta']) && !empty($_POST['meta'])) {
			$meta		=	trim( $_POST['meta'] );
			$user_need_d		=	self::$CI->User_need_delivery->getMyMetaRow($meta, $need, $user);
			
			if( isset($user_need_d[0]) )	$delivery	=	$user_need_d[0]['id'];
		}
		else {
			$delivery	=	$_POST['delivery_id'];
		}
		
		$response	=	array('status'	=>	'', 'delivery_id'	=>	$delivery, 'need_id'	=>	$need);
		
		if (!is_null($delivery)) {
			$deletePost		=	self::$CI->User_need_delivery->del($delivery, $user, $need);
			$deleteComments	=	self::$CI->User_need_delivery_comment->del($delivery, false);
			$deleteLikes	=	self::$CI->User_need_delivery_like->remove($delivery, false);
		}
		
		if ($deletePost && $deleteComments && $deleteLikes)
			$response['status']	=	'POST_DELETED_OK';
		else
			$response['status']	=	'PROCESSING_ERROR';
			
		return $response;
	}
	
	public function getByNeed() {
	
		$response			=	array('status'	=>	'', 'delivery_html' => '', 'delivery_json' =>	'');
		$need				=	$_POST['need_id'];
		$user				=	$_POST['user_id'];
		$limit				=	$_POST['limit'];
		$offset				=	$_POST['offset'];
		$comments			=	self::$CI->User_need_delivery->getByNeedIdWithInformation($need, $user, $limit, $offset);
		$current			=	0;
		$html				=	"";
		
		foreach ($comments['results'] as $c) { 
		
			$img_url			=	!empty($c['detect_links']) ? 'http://open.thumbshots.org/image.aspx?url='.$c['detect_links'] : '../img/shared_photo_sample.jpg';
			$comment			=	trim($c['content']);
			$actionText			=	'commented';
			$comments_count		=	$c['comment_count'];
			$likes_count		=	$c['like_count'];
			$is_liked			=	$c['is_liked_by_current_user'];
			$publish			=	array();
			$first				=	'';
			
			if($c['type'] == "COMMENT" || $c['type'] == "SHARE_LINK")
			{
				if($current == 0) {
					$html .='<section id="section-need-comments-'.$c['delivery_id'].'" class="comments-list first-line">';
				} else {
					$html .='<section id="section-need-comments-'.$c['delivery_id'].'" class="comments-list">';
				}
				$html .='<article>';
					$html .='<div class="profile-icon">';
					if($c['photo'])
					{
						$html .='<div class="picture_frame">';
						$html .= '<img src="'. $c['photo'] .'?width=90&height=80" width="90" height="80" class="user_pic">';
						$html .='</div>';
					}
					else
					{
						$html .='<div class="picture comment_pic '.$c['gender'].'"></div>';
					}	
					$html .='</div>';
					$html .='<div class="info">';
						if($c['type'] == "SHARE_LINK") 
						{
							$html 		.= '<div class="shared_photo"><div class="img" style="background-image:url(' . $img_url . ');"></div></div>';
							$comment	 =	self::$CI->utils->autolinks($c['content']);
							$actionText	 = 'shared a <a href="'.$c['detect_links'].'">link</a>';
						}
						$html .= '<div class="content">';
						$html .='<h4><a href="">'. $c['firstname'] . '&nbsp;' . $c['lastname'] .'</a> ' . $actionText . '</h4>';
						$html .='<p>'. $comment .'</p>';
						$html .='<div class="actions">';
							$html .='<span class="posted">'. self::$CI->utils->time_since( $c['created_unix'] ) .' ago' .'</span>';
							if($is_liked){
								$html .='<a href="javascript:void(0);" class="add_action unlike first" id="'.$c['delivery_id'].'">UnLike</a>';
							}	
							else{
								$html .='<a href="javascript:void(0);" class="add_action like first" id="'.$c['delivery_id'].'">Like</a>';
							}
							$html .='<a href="javascript:void(0);" class="add_action comment" id="'.$c['delivery_id'].'">Comment</a>';
							$html .='<a href="javascript:void(0);" class="add_action share" id="'.$c['delivery_id'].'">Share</a>';
							if($c['act_user'] == $user)
							{
								$html .='<a href="javascript:void(0);" class="add_action delete" id="'.$c['delivery_id'].'">Delete</a>';
							}
						$html .='</div>';
							if($is_liked)
							{
								$html .='<a class="icon comments like on unlinke_thumbs" id="'.$c['delivery_id'].'"><span></span>Like</a>';
							}
							else
							{
								$html .='<a class="icon comments like" id="'.$c['delivery_id'].'"><span></span>Like</a>';
							}
							$html .='<a class="icon comments comment" id="'.$c['delivery_id'].'"><span></span>Comment</a>';
						$html .='</div>';
						$html .='<div style="clear:both; height:4px;"></div>';
								if($likes_count > 0 || $comments_count > 0)
								{
									$html .='<section class="comments-like" id="'.$c['delivery_id'].'">';
										$html .='<div class="left">';
											if($likes_count > 0)
											{
												$html .='<a href="javascript:void(0);" class="icon view-like cm" id="'.$c['delivery_id'].'">';
													$html .='<span></span>';
													$html .='<strong class="likes_count_'.$c['delivery_id'].'">' . $likes_count . ' People</strong> <b>like this</b>';
												$html .='</a>';
											}
											else
											{
												$html .='<a href="javascript:void(0);" class="icon view-like cm dontShow" id="'.$c['delivery_id'].'">';
													$html .='<span></span>';
													$html .='<strong class="likes_count_'.$c['delivery_id'].'">' . $likes_count . ' People</strong> <b>like this</b>';
												$html .='</a>';
											}
											
											if($comments_count > 0)
											{
											
												$text  =  $comments_count . ' Comments';
												if($comments_count == 1) { $text = $comments_count . ' Comment'; }
												
												$html .= '<a href="javascript:void(0);" class="icon view-comments cm" id="'.$c['delivery_id'].'">';
													$html .= '<span></span>';
													$html .= '<strong class="comments_count_'.$c['delivery_id'].'">' . $text . '</strong>';
												$html .= '</a>';
											}
											else
											{
												
												$html .= '<a href="javascript:void(0);" class="icon view-comments cm dontShow" id="'.$c['delivery_id'].'">';
													$html .= '<span></span>';
													$html .= '<strong class="comments_count_'.$c['delivery_id'].'"></strong>';
												$html .= '</a>';
											}
										$html .='</div>';
										$html .='<div class="right">';
											
										$html .='</div>';
									$html .='</section>';
								}
								
								if($likes_count == 0 && $comments_count == 0)
								{
									$html .='<section class="comments-like dontShow" id="'.$c['delivery_id'].'">';
									$html .='<div class="left">';
									
										$html .='<a href="javascript:void(0);" class="icon view-like cm dontShow" id="'.$c['delivery_id'].'">';
											$html .='<span></span>';
											$html .='<strong class="likes_count_'.$c['delivery_id'].'">' . $likes_count . ' People</strong> <b>like this</b>';
										$html .='</a>';
										
										$html .= '<a href="javascript:void(0);" class="icon view-comments cm dontShow" id="'.$c['delivery_id'].'">';
											$html .= '<span></span>';
											$html .= '<strong class="comments_count_'.$c['delivery_id'].'"></strong>';
										$html .= '</a>';
										
									$html .='</div>';
										$html .='<div class="right">';
														
										$html .='</div>';
									$html .='</section>';
								}
								
								$html .='<div class="delivery_comments" id="ac_' . $c['delivery_id'] . '">';
								$html .='<a href="javascript:void(0);" class="show_more_sub" id="'.$c['delivery_id'].'" limit="">show previous comments...</a>';
								$html .='</div>';
							$html .='<div class="comments_add_wrapper" id="cax_' . $c['delivery_id'] . '">';
								$html .='<input type="text" class="comments_add_box" default="Add comment..." value="" id="' . $c['delivery_id'] . '">';
							$html .='</div>';
					$html .= '</div>';
				$html .='</article>';
			}
			else {
				$actionText	=	'*';
				if($c['type'] == "SOCIAL_SHARE") {
					$actionText = 	'shared this need on facebook';
				}
				elseif($c['type'] == "SOCIAL_LIKE") {
					$actionText	=	'likes this need on facebook';
				}
				elseif($c['type'] == "PROVIDER_NOMINATION") {
					$actionText	=	'offered to provide solution for this need';
				}
				elseif($c['type'] == "PROVIDER_ACCEPTED") {
				
					self::$CI->load->model('Users_model');					
					self::$CI->load->model('Provisions');
					$pv	=	self::$CI->Provisions->getAcceptedProvisions($need);
					$fn	=	$pv[0]['firstname'];
					$ln	=	$pv[0]['lastname'];
					$usr_name	=	$fn . '&nbsp;' . $ln;	
					
					if($user == $pv[0]['pv_user'])	$usr_name	=	'you';
					
					$actionText	=	'selected <a href="javascript:void(0);">' . $usr_name . '</a> to provide this need';
				}
				elseif($c['type']	== "DELIVER_NOMINATION") {
					$actionText	=	'offered to deliver this need';
				}
				elseif($c['type']	== "DELIVER_ACCEPTED") {
				
					self::$CI->load->model('Users_model');					
					self::$CI->load->model('Deliveries');
					$pv	=	self::$CI->Deliveries->getAcceptedDeliveries($need);
					$fn	=	$pv[0]['firstname'];
					$ln	=	$pv[0]['lastname'];
					$usr_name	=	$fn . '&nbsp;' . $ln;	
					
					if($user == $pv[0]['pv_user'])	$usr_name	=	'you';
					
					$actionText	=	'selected <a href="javascript:void(0);">' . $usr_name . '</a> to deliver this need';
				}
					
					if($current == 0) {
						$html .='<section id="section-need-comments-'.$c['delivery_id'].'" class="comments-list first-line">';
					} else {
						$html .='<section id="section-need-comments-'.$c['delivery_id'].'" class="comments-list">';
					}
				
					$html .= '<div class="general">';
						$html .='<div class="gaicon"></div>';
							$html .='<div class="cnt">';
								$html .='<h4><a href="javascript:void(0);">'. $c['firstname'] . '&nbsp;' . $c['lastname'] .'</a> ' . $actionText . '</h4>';
							$html .='</div>';
						$html .='<div class="time">'. self::$CI->utils->time_since( $c['created_unix'] ) .' ago' .'</div>';
					$html .= '</div>';
				$html .='</section>';
			}
				
				$publish['picture'] 	= 	'http://dev.microneeds.com/img/shared_photo_sample.jpg';
				$publish['link']		=	$c['detect_links'];
				$publish['description']	=	$c['content'];
				$publish['name']		=	$c['firstname'] . '&nbsp;' . $c['lastname'];
				$publish['caption']		=	'';
				$publish['type']		=	$c['type'];
				$publish['user_id']		=	$c['act_user'];
				
				$html.='<div id="publish_info_'.$c['delivery_id'].'">';
				foreach($publish as $k => $v) {
					$html.='<input type="hidden" class="share_data" name="'.$k.'" value="'.$v.'">';
				}
				$html.='</div>';
			
			$html .= '</section>';
			$current++;
		}
		
		$response['limit']			=	$_POST['limit'];
		$response['offset']			=	$_POST['offset'];
		$response['rows']			=	$comments['rows'];
		$response['delivery_html']	=	$html; unset($html);
		$response['delivery_json']	=	json_encode($comments);
		$response['status']			=	'OK';
		
		return $response;
	}
	
	public function like() {
		$user_id	        =	$_POST['uid'];
		$delivery_id		=	$_POST['delivery_id'];
		$result		=	array('status'	=>	'', 'delivery_id' => $delivery_id);
		
		$result['status']	=	self::$CI->User_need_delivery_like->add($delivery_id, $user_id);
		$result['total']	=	self::$CI->User_need_delivery_like->getCount($delivery_id);
		
		return $result;
	}
	
	public function unlike() {
		$user_id	=	$_POST['uid'];
		$act_id		=	$_POST['delivery_id'];
		$result		=	array('status'	=>	'', 'delivery_id' => $act_id);
		
		$result['status']	=	self::$CI->User_need_delivery_like->remove($act_id, $user_id);
		$result['total']	=	self::$CI->User_need_delivery_like->getCount($act_id);
		
		return $result;
	}
	
	public function commentLike() {
		$user_id	=	$_POST['uid'];
		$comment_id	=	$_POST['comment_id'];
		
		$result		=	array('status'	=>	'',	'comment_id'	=> $comment_id);
		
		$result['status']	=	self::$CI->User_need_delivery_comment_like->add($user_id, $comment_id);
		
		return $result;
	}
	
	public function commentUnlike() {
		$user_id	=	$_POST['uid'];
		$comment_id	=	$_POST['comment_id'];
		
		$result		=	array('status'	=>	'',	'comment_id'	=> $comment_id);
		
		$result['status']	=	self::$CI->User_need_delivery_comment_like->remove($user_id, $comment_id);
		
		return $result;
	}
	
	public function addComment() {
		$user_id	=	$_POST['uid'];
		$act_id		=	$_POST['delivery_id'];
		$ctext		=	$_POST['cText'];
		$result		=	array('status'	=>	'', 'delivery_id'	=>	$act_id);
		
		$result['status']				=	self::$CI->User_need_delivery_comment->add($act_id, $user_id, $ctext);
		$result['total_comments']		=	self::$CI->User_need_delivery_comment->getCount($act_id);
		$result['total_likes']			=	self::$CI->User_need_delivery_like->getCount($act_id);	
		
		return $result;
	}
	
	public function delComment() {
		$user_id	=	$_POST['uid'];
		$comment	=	$_POST['comment_id'];
		$delivery	=	$_POST['delivery_id'];
		
		$result		=	array('status'	=>	'', 'comment_id' => $comment, 'delivery_id'	=> $delivery);
		
		$result['status']		=	self::$CI->User_need_delivery_comment->del($user_id, $comment);
		$result['total']		=	self::$CI->User_need_delivery_comment->getCount($delivery);
		$result['total_likes']	=	self::$CI->User_need_delivery_like->getCount($delivery);
	
		return $result;
	}
	
	
	public function getComments() {	
		$user_id	=	$_POST['uid'];
		$act_id		=	$_POST['delivery_id'];
		$limit		=  	'none';
		$offset		=	'none';
		$order		=	'DESC';
	
		if( array_key_exists ('limit', $_POST) ) 	$limit		= (int) $_POST['limit'];
		if( array_key_exists ('offset', $_POST) ) 	$offset		= (int) $_POST['offset'];
		if( array_key_exists ('order', $_POST) ) 	$order		= trim($_POST['order']);
		
		$result		=	array('status'	=>	'', 'count'	=>	'', 'json'	=>	'', 'markup' => '');
		
		$comments	=	self::$CI->User_need_delivery_comment->get($act_id, $limit, $offset, $order);
		$count		=	count($comments['results']);
		
		$result['status']		=	'OK';
		$result['json']			=	$comments['results'];
		$result['count']		=	$count;
		$result['total']		=	$comments['total'];
		$result['total_likes']	=	self::$CI->User_need_delivery_like->getCount($act_id);
		
		$html	=	"";
		foreach($comments['results'] as $c) {
			$liked	=	self::$CI->User_need_delivery_comment_like->isLiked($c['id'], $user_id);
			
			$html .='<div class="line" id="'.$c['id'].'">';
					if($c['gender'])
					{
						$html .='<div class="user_pic_small_frame"><img src="'.$c['photo'].'?width=70&height=60" width="70" height="60"></div>';
					}
					else
					{
						$html .='<div class="user_pic_small '.$c['gender'].'"></div>';
					}
					$html .='<div class="user_line_content" id="'.$c['id'].'">';
						$html .= '<p class="user"><span>'.$c['firstname'] . ' ' . $c['lastname'] .'</span> commented</p>';
						$html .= '<p class="comment">'.$c['comment'].'</p>';
						$html .= '<p class="timestamp"><small>' . self::$CI->utils->time_since($c['comment_date_unix']) . ' ago</small>';	
							if($liked)
							{
								$html .= '<a href="javascript:void(0);" class="sub_comments_unlike" rel="'.$c['id'].'">UnLike</a>';
							}
							else
							{
								$html .= '<a href="javascript:void(0);" class="sub_comments_like" rel="'.$c['id'].'">Like</a>';
							}
							if($user_id == $c['user_id'])
							{
								$html .= '<a href="javascript:void(0);" class="sub_comments_delete" rel="'.$c['id'].'" delivery="'.$act_id.'">Delete</a>';
							}
						$html .= '</p>';
					$html .='</div>';
			$html .='</div>';
		}

		$result['markup']			=	$html;
		$result['delivery_id']		=	$act_id;
		$result['limit']			=	$limit;
		$result['offset']			=	$offset;
		
		return $result;
	}
	
	public function getLikes() {
		$user_id	=	$_POST['uid'];
		$act_id		=	$_POST['delivery_id'];
		$result		=	array('status'	=>	'', 'markup' => '');
		
		$get_likes	=	self::$CI->User_need_delivery_like->get($act_id);
		$get_count	=	self::$CI->User_need_delivery_like->getCount($act_id);
		
		$htmlLikes	=	'<div class="display_likes">';
		
		foreach($get_likes as $like)
		{
			$htmlLikes .= '<div class="like_line">';
				$htmlLikes .='<div class="image"><img src="' . $like['photo'] . '?width=50&height=50" /></div>';
				$htmlLikes .='<div class="cnt">';
				$htmlLikes .='<a href="javascript:void(0);" class="name">' . $like['firstname'] . ' ' . $like['lastname'] . '</a>';
				$htmlLikes .='<span class="when">' . self::$CI->utils->time_since($like['when_unix']) . ' ago</span>';
				$htmlLikes .='</div>';
			$htmlLikes .= '</div>';
		}
		
		$htmlLikes 	.=	'</div>';
		
		$result['status']			=	'OK';
		$result['json']				=	json_encode($get_likes);
		$result['markup']			=	$htmlLikes;
		$result['total_comments']	=	self::$CI->User_need_delivery_comment->getCount($act_id);
		$result['total_likes']		=	$get_count;
		return $result;
	}
	
	public function likeCommentsNumber() {
		$act_id		=	$_POST['delivery_id'];
		$user_id	=	$_POST['uid'];
		
		$result	=	array(
						  'status'		=>		'OK' , 
						  'delivery_id' => 		$act_id,
						  'user_id'		=>		$user_id,
						  'comments'	=>		self::$CI->User_need_delivery_comment->getCount($act_id),
						  'likes'		=>		self::$CI->User_need_delivery_like->getCount($act_id)
					);
		
		return $result;
	}
	
	public function getProvisionOffers() {
		$need	=	(int) $_POST['need'];
		$result	=	array('status'	=>	'OK', 'result'	=> array());
		self::$CI->load->model('Provisions');
		
		$all	=	self::$CI->Provisions->getProvisions($need);
		
		$markup	=	'<div class="display_likes s">';
		
		foreach($all as $pv)
		{
			$markup .= '<div class="like_line">';
				$markup .='<div class="image"><img src="' . $pv['photo'] . '?width=50&height=50" /></div>';
				$markup .='<div class="cnt">';
				$markup .='<a href="javascript:void(0);" class="name">' . $pv['firstname'] . ' ' . $pv['lastname'] . '</a>';
				$markup .='<span class="when">' . self::$CI->utils->time_since($pv['created_date']) . ' ago</span>';
				$markup .='<button class="thin nominate_provider" id="'.$pv['pv_id'].'" need_id="'.$pv['pv_need'].'">Select</button>';
				$markup .='</div>';
			$markup .= '</div>';
		}
		
		$markup .= '</div>';
		
		$result['markup']	=	$markup;
		$result['result']	=	$all;
		
		return $result;
	}
	
	public function getDeliveryOffers() {
		$need	=	(int) $_POST['need'];
		$result	=	array('status'	=>	'OK', 'result'	=> array());
		self::$CI->load->model('Deliveries');
		
		$all	=	self::$CI->Deliveries->getDeliveries($need);
		
		$markup	=	'<div class="display_likes s">';
		
		foreach($all as $dv)
		{
			$markup .= '<div class="like_line">';
				$markup .='<div class="image"><img src="' . $dv['photo'] . '?width=50&height=50" /></div>';
				$markup .='<div class="cnt">';
				$markup .='<a href="javascript:void(0);" class="name">' . $dv['firstname'] . ' ' . $dv['lastname'] . '</a>';
				$markup .='<span class="when">' . self::$CI->utils->time_since($dv['created_date']) . ' ago</span>';
				$markup .='<button class="thin nominate_deliverer" id="'.$dv['pv_id'].'" need_id="'.$dv['pv_need'].'">Select</button>';
				$markup .='</div>';
			$markup .= '</div>';
		}
		
		$markup .= '</div>';
		
		$result['markup']	=	$markup;
		$result['result']	=	$all;
		
		return $result;
	}
	
	public function getNeedProvisionInfo() {
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Provisions');
		
		$need		=	(int)	$_POST['need_id'];
		$result		=	array('status'=>'OK', 'result'	=>	array(), 'need_id'	=>	$need);
		$need_info	=	self::$CI->Needs_model->getNeed($need);
		$statusText	=	'New';
		$lsa_time	=	self::$CI->utils->time_since($need_info['created_unix']) . ' ago';
		
		$checkLiked			=	'';
		$checkShared		=	'';
		$checkProvided		=	'';
		$checkDelivered		=	'';
		
		if (in_array('liked', $need_info['status_actions'])) {
			$checkLiked = 'on';
		}
		if( in_array('shared', $need_info['status_actions']) ) {
			$checkShared	=	'on';
		}
		
		if (in_array('provide_pending', $need_info['status_actions'])) {
			$checkProvided 	= 	'pending';
			$statusText		=	'Pending provider selection.';
		}
		
		if (in_array('deliver_pending', $need_info['status_actions'])) {
			$checkDelivered = 	'pending';
			$statusText		=	'';
		}
		
		if (in_array('provided', $need_info['status_actions'])) {
			$checkProvided 	= 	'on';
			$statusText		=	'Provision Completed.';
		}
		
		if (in_array('delivered', $need_info['status_actions'])) {
			$checkDelivered = 'on';
		}
		
		if( $need_info['lsa'] ){
			if( $need_info['lsa'] === "liked" ) {
					$checkLiked	.=	" lastaction";
			}
			if( $need_info['lsa'] === "shared" ) {
					$checkShared	.=	" lastaction";
			}
			if( $need_info['lsa'] === "provided" || $need_info['lsa'] === "provide_pending") {
					$checkProvided	.=	" lastaction";
			}	
			if( $need_info['lsa'] === "delivered" || $need_info['lsa'] === "deliver_pending") {
					$checkDelivered.=	" lastaction";
			}
					
		}
		
		$pv			=	self::$CI->Provisions->getAcceptedProvisions($need);
		$markup	 	= 	'';
		
		if(isset($pv[0])) {
			$pv	=	$pv[0];
			
			$fullname	=	$pv['firstname'].'&nbsp'.$pv['lastname'];
			$accepted	=	date("H:i A F j, Y", $pv['accepted_date']);
			$picture	=	$pv['photo'].'?width=90&height=75';
			
			
			$markup	.= '<article id="owner_info">';
	            $markup	.= '<div class="profile-icon">';
	                $markup	.= '<div class="picture_frame">';
					$markup	.= '<img id="pv_user_photo" src="'.$picture.'" alt="" title="View user profile." width="90" height="75">';
					$markup	.= '</div>';
	            $markup	.= '</div>';
	            $markup	.= '<div class="info">';
	                $markup	.= '<h5><a href="javascript:void(0);" id="pv_user_fullname">'.$fullname.'</a></h5>';
	                $markup	.= '<h4><a href="javascript:void(0);">Provider of this Need</a></h4>';
	                $markup	.= '<span class="date">';
						$markup	.= '<strong>Accepted:</strong>';
						$markup	.= '<span id="pv_user_accepted">&nbsp;'.$accepted.'</span>';
					$markup	.= '</span>';
	            $markup	.= '</div>';
	            $markup	.= '<button class="default" type="button">Message Provider</button> ';
	        $markup	.= '</article>';
		}
			$markup	.= '<article id="status_info">';
			
	            $markup	.= '<div class="need_status_graph large">';
	         		$markup	.=	'<div class="check liked '.$checkLiked.'"></div>';
					$markup	.=	'<div class="check shared '.$checkShared.'"></div>';
					$markup	.=	'<div class="check provided '.$checkProvided.'"></div>';
					$markup	.=	'<div class="check delivered '.$checkDelivered.'"></div>';
	            $markup	.= '</div>';
				
			
				if(!empty($need_info['lsa_time'])) {
					$lsa_time	=	self::$CI->utils->time_since($need_info['lsa_time']) . ' ago';
				}
			
				$markup	.= '<div class="info main history">';
		           $markup	.= '<h5>Status : '.$statusText.'</h5>';
		           $markup	.= '<span class="date">'. $lsa_time .'</span>';
			    $markup	.= '</div>';
				
				$markup	.= '<section class="history_lines">';
				
			if (count($need_info['status_actions'])) {
				$need_info['status_actions']	=	array_reverse($need_info['status_actions'], true);
				
				$s	=	1;
				foreach ($need_info['status_actions'] as $sta) {
					$text	=	'';
					$date	=	'';
					
					$snd	=	'one';
					
					if($s == 2) $snd	=	'two';
					if($s == 3)	$snd	=	'three';
					
					switch($sta) {
						case 'provide_pending' :
							$text	=	'Provision offers available.';
							$date	=	$need_info['pv_selected_date'];
							
							$date	=	self::$CI->utils->time_since($date) . ' ago';
					
							$markup	.= '<div class="info_history">';
								$markup	.= '<div class="line">';
									$markup	.= '<div class="icon_state '.$snd.'"></div>';
									$markup	.= '<h5>'.$text.'</h5>';
									$markup	.= '<span class="date">'.$date.'</span>';
								$markup	.= '</div>';
							$markup	.= '</div>';
						break;
						
						case 'provided' :
							$text	=	'Provider selected, solution acquired.';
							$date	=	$need_info['pv_provided_date'];
							$date	=	self::$CI->utils->time_since($date) . ' ago';
					
							$markup	.= '<div class="info_history">';
								$markup	.= '<div class="line">';
									$markup	.= '<div class="icon_state '.$snd.'"></div>';
									$markup	.= '<h5>'.$text.'</h5>';
									$markup	.= '<span class="date">'.$date.'</span>';
								$markup	.= '</div>';
							$markup	.= '</div>';
						break;
						
						default :
						break;
					}
					
					$s++;
				}
				
			}
					
				$markup	.= '</section>';
				$markup	.= '<button class="default" type="button" id="pv_show_history">Show History</button>';
				
			$markup	.= '</article>';
		
		$result['markup']	=	$markup;
		$result['result']	=	$pv;
		
		return $result;
		
	}
	
	public function getNeedDeliveryInfo() {
	
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Deliveries');
		
		$need		=	(int)	$_POST['need_id'];
		$result		=	array('status'=>'OK', 'result'	=>	array(), 'need_id'	=>	$need);
		$need_info	=	self::$CI->Needs_model->getNeed($need);
		$statusText	=	'New';
		$lsa_time	=	self::$CI->utils->time_since($need_info['created_unix']) . ' ago';
		
		$checkLiked			=	'';
		$checkShared		=	'';
		$checkProvided		=	'';
		$checkDelivered		=	'';
		
		if (in_array('liked', $need_info['status_actions'])) {
			$checkLiked = 'on';
		}
		if( in_array('shared', $need_info['status_actions']) ) {
			$checkShared	=	'on';
		}
		
		if (in_array('provide_pending', $need_info['status_actions'])) {
			$checkProvided 	= 	'pending';
			$statusText		=	'Pending Deliverer selection.';
		}
		
		if (in_array('deliver_pending', $need_info['status_actions'])) {
			$checkDelivered = 	'pending';
			$statusText		=	'Delivery offers available';
		}
		
		if (in_array('provided', $need_info['status_actions'])) {
			$checkProvided 	= 	'on';
		}
		
		if (in_array('delivered', $need_info['status_actions'])) {
			$checkDelivered = 'on';
			$statusText		=	'Delivery Completed.';
		}
		
		if( $need_info['lsa'] ){
			if( $need_info['lsa'] === "liked" ) {
					$checkLiked	.=	" lastaction";
			}
			if( $need_info['lsa'] === "shared" ) {
					$checkShared	.=	" lastaction";
			}
			if( $need_info['lsa'] === "provided" || $need_info['lsa'] === "provide_pending") {
					$checkProvided	.=	" lastaction";
			}	
			if( $need_info['lsa'] === "delivered" || $need_info['lsa'] === "deliver_pending") {
					$checkDelivered.=	" lastaction";
			}
					
		}
		
		$pv			=	self::$CI->Deliveries->getAcceptedDeliveries($need);
		$markup	 	= 	'';
		
		if(isset($pv[0])) {
			$pv	=	$pv[0];
			
			$fullname	=	$pv['firstname'].'&nbsp'.$pv['lastname'];
			$accepted	=	date("H:i A F j, Y", $pv['accepted_date']);
			$picture	=	$pv['photo'].'?width=90&height=75';
			
			$markup	.= '<article id="owner_info">';
	            $markup	.= '<div class="profile-icon">';
	                $markup	.= '<div class="picture_frame">';
					$markup	.= '<img id="pv_user_photo" src="'.$picture.'" alt="" title="View user profile." width="90" height="75">';
					$markup	.= '</div>';
	            $markup	.= '</div>';
	            $markup	.= '<div class="info">';
	                $markup	.= '<h5><a href="javascript:void(0);" id="pv_user_fullname">'.$fullname.'</a></h5>';
	                $markup	.= '<h4><a href="javascript:void(0);">Deliverer of this Need</a></h4>';
	                $markup	.= '<span class="date">';
						$markup	.= '<strong>Accepted:</strong>';
						$markup	.= '<span id="pv_user_accepted">&nbsp;'.$accepted.'</span>';
					$markup	.= '</span>';
	            $markup	.= '</div>';
	            $markup	.= '<button class="default" type="button">Message Deliverer</button> ';
	        $markup	.= '</article>';
		}
			$markup	.= '<article id="status_info">';
			
	            $markup	.= '<div class="need_status_graph large">';
	         		$markup	.=	'<div class="check liked '.$checkLiked.'"></div>';
					$markup	.=	'<div class="check shared '.$checkShared.'"></div>';
					$markup	.=	'<div class="check provided '.$checkProvided.'"></div>';
					$markup	.=	'<div class="check delivered '.$checkDelivered.'"></div>';
	            $markup	.= '</div>';
				
				if(!empty($need_info['lsa_time'])){
					$lsa_time	=	self::$CI->utils->time_since($need_info['lsa_time']) . ' ago';
				}
				
			
				$markup	.= '<div class="info main history">';
		           $markup	.= '<h5>Status : '.$statusText.'</h5>';
		           $markup	.= '<span class="date">'. $lsa_time .'</span>';
			    $markup	.= '</div>';
				
				$markup	.= '<section class="history_lines">';
				
			if (count($need_info['status_actions'])) {
				$need_info['status_actions']	=	array_reverse($need_info['status_actions'], true);
				
				$s	=	1;
				
				foreach( $need_info['status_actions'] as $sta )
				{
					$text	=	'';
					$date	=	'';
					
					$snd	=	'one';
					
					if($s == 2) $snd	=	'two';
					if($s == 3)	$snd	=	'three';
					
					switch($sta)
					{
						case 'deliver_pending' :
							$text	=	'Delivery offers available.';
							$date	=	$need_info['pv_selected_date'];
							
							$date	=	self::$CI->utils->time_since($date) . ' ago';
					
							$markup	.= '<div class="info_history">';
								$markup	.= '<div class="line">';
									$markup	.= '<div class="icon_state '.$snd.'"></div>';
									$markup	.= '<h5>'.$text.'</h5>';
									$markup	.= '<span class="date">'.$date.'</span>';
								$markup	.= '</div>';
							$markup	.= '</div>';
						break;
						
						case 'delivered' :
							$text	=	'Deliverer selected.';
							$date	=	$need_info['pv_provided_date'];
							
							$date	=	self::$CI->utils->time_since($date) . ' ago';
					
							$markup	.= '<div class="info_history">';
								$markup	.= '<div class="line">';
									$markup	.= '<div class="icon_state '.$snd.'"></div>';
									$markup	.= '<h5>'.$text.'</h5>';
									$markup	.= '<span class="date">'.$date.'</span>';
								$markup	.= '</div>';
							$markup	.= '</div>';
						break;
						
						default :
						break;
					}
					
					$s++;
				}
				
			}
					
				$markup	.= '</section>';
				$markup	.= '<button class="default" type="button" id="pv_show_history">Show History</button>';
				
			$markup	.= '</article>';
		
		$result['markup']	=	$markup;
		$result['result']	=	$pv;
		
		return $result;
		
	}
	
	public function getDeliveryHeader() {
	
		$need						=	(int)	$_REQUEST['need_id'];
		$user						=	(int)	$_REQUEST['user_id'];
		
		self::$CI->load->model('Needs_model');
		self::$CI->load->model('Needs_status_actions');
		
		$userActionsCount 	= 	self::$CI->Needs_model->doesUserIsInvolvedInNeed($user, $need);
		$needStatusAction	=	self::$CI->Needs_status_actions->getStatusesText($need);
		$isUserInvolved		=	$userActionsCount['is_involved'];
		
		$result						=	array('status'=>'OK', 'result'	=>	array(), 'need_id'	=>	$need, 'markup' => array());
		$handler 					= 	array('is_involved' => $isUserInvolved, 'need_id' => $need, 'status_actions' => $needStatusAction);		
		$result['markup']			=	self::$CI->load->view(AJAX_HTML_MARKUP_VIEW_PREFIX . __FUNCTION__ , $handler, true);
		
		return $result;
	}
}