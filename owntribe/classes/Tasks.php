<?php
namespace owntribe\classes;

class Tasks {
	use \owntribe\traits\Response;

    private $result;

    function __construct() {
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
        $this->result = $this->respond(true, "Tasks class", $data);
	}

    public function getResult() {
        return $this->result;
    }
}