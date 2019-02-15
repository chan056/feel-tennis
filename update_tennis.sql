/*
Navicat MySQL Data Transfer

Source Server         : yitube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : tennis

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2019-02-15 17:51:42
*/

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
  `age` tinyint(4) DEFAULT NULL,
  `residence` varchar(255) DEFAULT NULL,
  `turn_pro` varchar(4) DEFAULT NULL,
  `birthdate` varchar(30) DEFAULT NULL,
  `height` double DEFAULT NULL COMMENT 'cm',
  `weight` double DEFAULT NULL COMMENT 'kg',
  `plays` tinyint(1) DEFAULT NULL COMMENT '右手0(默认） 左手1 ',
  `experience` tinyint(4) DEFAULT '0' COMMENT '转职业选手年数',
  `ytd_win_single` tinyint(4) DEFAULT NULL,
  `ytd_win_double` tinyint(4) DEFAULT NULL COMMENT '年初至今赢的次数',
  `website` varchar(255) DEFAULT NULL COMMENT '个人站点',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8;
