<?php
namespace owntribe\classes;
class Main {
    private $version = 0.1;

    function __construct() {
		$this->init();
	}

    /**
     * the init() function will try to instantiate the corresponding class/method depending on the URI request
     *
     * @author  Paul BRIE
     */
    private function init() {
		if(substr($_SERVER['REQUEST_URI'], 0, 5) === '/api/') {
			$request = strtolower(substr($_SERVER['REQUEST_URI'],5));
			$segments = explode('/', $request);
			$resource = isset($segments[0]) ? $segments[0] : null;
            $class_name = __NAMESPACE__ . '\\' . ucfirst($resource);
            $file = getPathFromNamespace($class_name);
            if(file_exists($file)) {
                $Class = new $class_name;
                $this->output($Class->getResult());
            } else {
                $class_name = __NAMESPACE__ . '\\Error';
                $Class = new $class_name;
                $this->output (array('msg' => 'Oops! We don\'t have this resource: ' . $resource ));
            }
		} else {
			// this is not an API call
            die();
		}
	}

    /**
     * @param array $result
     */
    protected function output($result) {
        //var_dump($result);
        // inject extra data
        $result['_version'] = $this->version;

        header('Content-Type: application/json');
        echo json_encode($result);
    }
}