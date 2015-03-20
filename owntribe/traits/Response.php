<?php
namespace owntribe\traits;
/**
 * trait Response
 * defines the response format the REST API
 *
 * @package owntribe\traits
 * @author  Paul BRIE
 */
trait Response
{
    /**
     * defines the format of the responses sent back by classes of the api
     *
     * @param boolean   $result
     * @param string    $msg
     * @param mixed     $data
     *
     * @return array
     * @author Paul BRIE
     */
    public function respond($result, $msg = "", $data = array())
    {
        if(is_bool($result) && is_string($msg) && is_array($data))
        {
            return array(
                'result' => $result,
                'msg' => $msg,
                'data' => $data
            );
        } else {
            return array(
                'result' => false,
                'msg' => "Response has a format error",
                'data' => array()
            );
        }
    }
}