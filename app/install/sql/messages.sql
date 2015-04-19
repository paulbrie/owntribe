CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromuserid` int(11) NOT NULL,
  `toemails` text NOT NULL,
  `title` text NOT NULL,
  `body` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `result` text NOT NULL,
  `sent` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
