<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
define('FILE_READ_MODE', 0644);
define('FILE_WRITE_MODE', 0666);
define('DIR_READ_MODE', 0755);
define('DIR_WRITE_MODE', 0777);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/

define('FOPEN_READ',							'rb');
define('FOPEN_READ_WRITE',						'r+b');
define('FOPEN_WRITE_CREATE_DESTRUCTIVE',		'wb'); // truncates existing file data, use with care
define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE',	'w+b'); // truncates existing file data, use with care
define('FOPEN_WRITE_CREATE',					'ab');
define('FOPEN_READ_WRITE_CREATE',				'a+b');
define('FOPEN_WRITE_CREATE_STRICT',				'xb');
define('FOPEN_READ_WRITE_CREATE_STRICT',		'x+b');

define('AJAX_HTML_MARKUP_VIEW_PREFIX', "html_");
define('MICRONEEDS_FACEBOOK_API_KEY', "114206805353278");
define('MICRONEEDS_FACEBOOK_SECRET_KEY', "1a22d1d4ea396fa20ed86468dcf83eea");
define('IP_INFO_DB_API_KEY', "6f63c7c3d3aafbaf564b91e00e8cd99bc0b6ed30b4efc8516da90a4e2c67ed8a");
define('GOOGLE_MAPS_API_KEY', "AIzaSyC8rMkxtnr3Syo-tPm_n6r_9dWgbayb76c");
define('CHECK_IP_WEBSITE', "http://checkip.dyndns.org/");
define('DEFAULT_IP_MAP', "127.0.0.1");
define('DEFAULT_IP_MAP_SECOND', "::1");
define('DEFAULT_IP_MAP_HOSTMANE', "localhost");
define('GEOIP_SERVICE_LINK', "http://freegeoip.net/json/");

define('AJAX_METHOD_RETURN_GLUE_JSON', 'JSON');
define('AJAX_METHOD_RETURN_GLUE_XML', 'XML');
define('AJAX_METHOD_RETURN_GLUE_HTML', 'HTML');
define('AJAX_METHOD_NOT_FOUND_EXCEPTION', 'Remote Method Not Found.');
define('AJAX_METHOD_INVALID_RETURN_TYPE', 'The returned value from ajax node must be an array');
define('AJAX_INVALID_GLUE_VALUE_EXCEPTION', 'Invalid Response Glue Value.');
define('AJAX_DEFAULT_INSTANCE_PRFIX', 'AJAX_');

define('DEFAULT_NEED_ADD_STATUS_MESSAGE_FORMAT', '<a class="users_link" href="#users=%s">%s %s</a> created the need');
define('DEFAULT_NEED_PROVISION_NOMINATION_STATUS_MESSAGE_FORMAT', '<a class="users_link" href="#users=%s">%s %s</a> nominated %s to provide this need');
define('DEFAULT_NEED_DELIVERY_NOMINATION_STATUS_MESSAGE_FORMAT', '<a class="users_link" href="#users=%s">%s %s</a> nominated %s to deliver this need');
define('DEFAULT_NEED_SOCIAL_SHARE_STATUS_MESSAGE_FORMAT', '<a class="users_link" href="#users=%s">%s %s</a> shared this need');
define('DEFAULT_NEED_SOCIAL_LIKE_STATUS_MESSAGE_FORMAT', '<a class="users_link" href="#users=%s">%s %s</a> liked this need');

define('NO_WARNING_ICON', 'NONE');

