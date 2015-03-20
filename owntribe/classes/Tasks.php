<?php
namespace owntribe\classes;

class Tasks extends Base {

    function __construct() {
		//
	}

    public function getResult() {
        $data = array(
            array(
                'id' => 1,
                'title' => 'buy milk',
                'description' => 'bio milk',
                'expires' => '2015-03-19'
            ),
            array(
                'id' => 2,
                'title' => 'buy my wife flowers',
                'description' => '',
                'expires' => '2015-03-19'
            ),
            array(
                'id' => 3,
                'title' => 'call the architect',
                'description' => '',
                'expires' => '2015-03-20'
            )
        );
        return parent::respond(true, "Tasks class", $data);
    }
}