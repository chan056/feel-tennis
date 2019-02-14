/*
Navicat MySQL Data Transfer

Source Server         : yitube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : tennis

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2019-02-14 15:57:20
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
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1男 2女 3其他',
  `ranking` mediumint(9) DEFAULT NULL,
  `prev_ranking` mediumint(9) DEFAULT NULL,
  `point` mediumint(9) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `state_abbreviation` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8;
