<?php

class Facebook_model extends CI_Model
{
    const MICRONEEDS_FACEBOOK_API_KEY	    =   '114206805353278';
    const MICRONEEDS_FACEBOOK_SECRET_KEY    =	'1a22d1d4ea396fa20ed86468dcf83eea';

    private $__allowed  =  'user_about_me,user_birthday,email';

    public function __construct()
    {
		parent::__construct();
		
		$this->load->library('Facebook', array(
						'appId'  => self::MICRONEEDS_FACEBOOK_API_KEY,
						'secret' => self::MICRONEEDS_FACEBOOK_SECRET_KEY,
						'fileUpload' => true)
				    );
    }

    public function getUser()
    {
		return $this->facebook->getUser();
    }

    public function getAccessToken()
    {
		return $this->facebook->getAccessToken();
    }

    public function getLoginUrl()
    {
		$params = array(
		    'scope' => $this->__allowed,
		);
		return $this->facebook->getLoginUrl($params);
    }

    public function getLogoutUrl()
    {
		return $this->facebook->getLogoutUrl();
    }

    public function Api()
    {
		$ui = $this->facebook_model->api('/me','GET');
		return $ui;
    }

}