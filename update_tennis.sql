DROP TABLE IF EXISTS `tournament`;
CREATE TABLE `tournament` (
  `sid` int(11) NOT NULL,
  `status` tinyint(1) DEFAULT NULL COMMENT '-1 recent, 0 current, 1 upcoming',
  `name` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `year` smallint(6) DEFAULT NULL,
  `start_time` bigint(20) DEFAULT NULL,
  `end_time` bigint(20) DEFAULT NULL,
  `expire` datetime DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
