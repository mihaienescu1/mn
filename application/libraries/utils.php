<?php

class Utils {
	
	function __construct() {
		
	}
	
	function time_since($original) {
		$chunks = array(
			array(60 * 60 * 24 * 365 , 'year'),
			array(60 * 60 * 24 * 30 , 'month'),
			array(60 * 60 * 24 * 7, 'week'),
			array(60 * 60 * 24 , 'day'),
			array(60 * 60 , 'hour'),
			array(60 , 'minute'),
		);
		
		$today = time();
		$since = $today - $original;
		for ($i = 0, $j = count($chunks); $i < $j; $i++) {
			
			$seconds = $chunks[$i][0];
			$name = $chunks[$i][1];
			if (($count = floor($since / $seconds)) != 0) 
			{
				break;
			}
		}
		
		$print = ($count == 1) ? '1 '.$name : "$count {$name}s";
		if ($i + 1 < $j) {
			$seconds2 = $chunks[$i + 1][0];
			$name2 = $chunks[$i + 1][1];

			if (($count2 = floor(($since - ($seconds * $count)) / $seconds2)) != 0) 
			{
				$print .= ($count2 == 1) ? ', 1 '.$name2 : ", $count2 {$name2}s";
			}
		}
		if(trim($print) == "0 minutes") return "a few seconds";
		else return $print;
	}
	
	function autolinks($text) {
		$pattern = "/(((http[s]?:\/\/)|(www\.))(([a-z][-a-z0-9]+\.)?[a-z][-a-z0-9]+\.[a-z]+(\.[a-z]{2,2})?)\/?[a-z0-9._\/~#&=;%+?-]+[a-z0-9\/#=?]{1,1})/is";
		$text = preg_replace($pattern, " <a target=\"_blank\" class=\"autolinks\" href='$1'>$1</a>", $text);
		$text = preg_replace("/href='www/", "href='http://www", $text);

		return $text;
	}
}
