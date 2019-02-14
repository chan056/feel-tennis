
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for athlete
-- ----------------------------
DROP TABLE IF EXISTS `athlete`;
CREATE TABLE `athlete` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tennis_com` int(11) DEFAULT NULL COMMENT 'id in tennis.com',
  `name` varchar(255) NOT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1男 2女 3其他',
  `ranking` mediumint(9) DEFAULT NULL,
  `prev_ranking` mediumint(9) DEFAULT NULL,
  `point` mediumint(9) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `state_abbreviation` varchar(5) DEFAULT NULL,
  `residence` varchar(255) DEFAULT NULL,
  `turn_pro` varchar(4) DEFAULT NULL,
  `birthdate` datetime DEFAULT NULL,
  `weight` double DEFAULT NULL COMMENT 'kg',
  `plays` tinyint(1) DEFAULT NULL COMMENT '左手 右手',
  `experience` tinyint(4) DEFAULT '0' COMMENT '转职业选手年数',
  `ytd_win` tinyint(4) DEFAULT NULL COMMENT '年初至今赢的次数',
  `website` varchar(255) DEFAULT NULL COMMENT '个人站点',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8;
