<?php
namespace owntribe\classes;
class Main {
    private $version = 0.1;
    private $config = 0;
    private $class;

    function __construct($config)
    {
		$this->config = $config;
        $this->config['debug'] === true ? ini_set('display_errors', 1) : ini_set('display_errors', 0);
        $this->init();
	}

    /**
     * this function will try to instantiate the corresponding class/method depending on the URI request
     * if it does not found the class corresponding to the resource it will give a default error
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
                $this->class = new $class_name($this->config);
                $this->output($this->class->getResult());
            } else {
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
        header('Content-Type: application/json');
        // inject extra data
        $result['_version'] = $this->version;
        if($this->config['debug'] === true) {
            $result['_memory_peak_usage'] = memory_get_peak_usage();
            $result['_memory_peak_usage_real'] = memory_get_peak_usage(true);
            $result['_duration'] = round(microtime(true) - $this->config['start'], 3) . " sec";
        }

        echo json_encode($result);
    }
}