<?php
namespace owntribe\classes {
    /**
     * Class Base
     * This class is defining the low level capabilities of all other classes of the package owntribe\classes
     *
     * @package owntribe\classes
     * @author  Paul BRIE
     */
    class Base {

        protected $db;

        use \owntribe\traits\Response;

        function __construct($config)
        {
            try {
                $this->db = new \PDO(
                    'mysql:host=localhost;dbname=' . $config['dbname'] . ';charset=utf8',
                    $config['dbuser'],
                    $config['dbpass']
                );
            } catch (PDOException $e) {
                $e->getMessage();
            }
        }
    }
}