
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for athlete
-- ----------------------------
DROP TABLE IF EXISTS `athlete`;
CREATE TABLE `athlete` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sport_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `en_name` varchar(255) DEFAULT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1男 2女 3其他',
  `ranking` mediumint(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8;