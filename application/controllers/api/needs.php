<?php defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

class Needs extends REST_Controller {
	
	private $comments = array(
		array(
			'id' => 1,
			'username' => 'lady GooGoo',
			'content' => 'Ore everit anen idiumsen sium sedom vit lorem ipsum dolet gomenish fidder domino nonummy eluredodiv itsumolet siametel itolk ore. Folet sid amet elitolk op',
			'likes' => 2
		),
		array(
			'id' => 2,
			'username' => 'lady GooGoo',
			'content' => 'Ore everit anen idiumsen sium sedom vit lorem ipsum dolet gomenish fidder domino nonummy eluredodiv itsumolet siametel itolk ore. Folet sid amet elitolk op',
			'likes' => 0
		),
		array(
			'id' => 3,
			'username' => 'lady GooGoo',
			'content' => 'Ore everit anen idiumsen sium sedom vit lorem ipsum dolet gomenish fidder domino nonummy eluredodiv itsumolet siametel itolk ore. Folet sid amet elitolk op',
			'likes' => 0
		)
	);
	
	function index_get($id = null){
		$need = array(
			'id' => 1,
			'title' => '3 Boxes of Various Educational Supplies',
			'location' => 'New Delphi, India',
			'created' => 'October 9',
			'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula gravida lectus in hendrerit. In hac habitasse platea dictumst. Pellentesque laoreet nisi eu augue ultrices blandit. Curabitur rhoncus malesuada lacinia. Etiam in lacus ante, quis cursus tortor. Praesent non nisi mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et leo est. Nullam non convallis metus. Maecenas nec dui sapien, id tristique justo. Add something here',
			'situation' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula gravida lectus in hendrerit. In hac habitasse platea dictumst. Pellentesque laoreet nisi eu augue ultrices blandit. Curabitur rhoncus malesuada lacinia. Etiam in lacus ante, quis cursus tortor. Praesent non nisi mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et leo est. Nullam non convallis metus. Maecenas nec dui sapien, id tristique justo. Add something here',
			'list' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vehicula gravida lectus in hendrerit. In hac habitasse platea dictumst. Pellentesque laoreet nisi eu augue ultrices blandit. Curabitur rhoncus malesuada lacinia. Etiam in lacus ante, quis cursus tortor. Praesent non nisi mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et leo est. Nullam non convallis metus. Maecenas nec dui sapien, id tristique justo. Add something here',
			'category' => array(
				'title' => 'Technology',
				'image' => base_url('img/icon_badge_apple.png')
			)
		);
		
		if($need){
			$this->response($need, 200);
		}
		else{
			$this->response(array('error' => 'No need found!'), 404);
		}
	}
	
	function comments_get($id = null, $type = null){
		$response = $this->comments;
    	
        if($response){
            $this->response($response, 200); // 200 being the HTTP response code
        } else {
            $this->response(array('error' => 'No comment found!'), 404);
        }
	}
	
	/**
	 * Add a comment 
	 */
	function comments_post(){
		var_dump($this->post('comment'));
	}

}

/* End of file comments.php */
/* Location: ./application/controllers/api/comments.php */