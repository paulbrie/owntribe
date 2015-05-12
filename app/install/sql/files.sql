CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `size` int(11) NOT NULL,
  `mimetype` varchar(20) NOT NULL,
  `userid` int(11) NOT NULL,
  `valid` int(1) DEFAULT '0',
  `hash` varchar(40) DEFAULT NULL,
  `share` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(2) DEFAULT '0',
  `time` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
