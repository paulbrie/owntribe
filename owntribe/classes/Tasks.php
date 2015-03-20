<?php
namespace owntribe\classes;

class Tasks extends Base {

    function __construct($config) {
		parent::__construct($config);
	}

    public function getResult() {
        return parent::respond(true, "Tasks class", $this->getTasks());
    }

    /**
     * return all the available tasks
     * @return  array
     */
    private function getTasks() {
        $sth = $this->db->prepare("SELECT * FROM tasks");
        $sth->execute();
        return $sth->fetchAll(\PDO::FETCH_ASSOC);
    }
}
