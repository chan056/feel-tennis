DROP TABLE IF EXISTS `translation`;
CREATE TABLE `translation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `en` text,
  `zh` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;