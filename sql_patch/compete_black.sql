/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-05-29 18:16:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for compete_black
-- ----------------------------
DROP TABLE IF EXISTS `compete_black`;
CREATE TABLE `compete_black` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usr_id` int(10) unsigned DEFAULT NULL,
  `recorder_id` int(10) unsigned DEFAULT NULL,
  `match_id` int(10) unsigned DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
