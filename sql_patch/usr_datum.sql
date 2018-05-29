/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-05-29 18:16:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for usr_datum
-- ----------------------------
DROP TABLE IF EXISTS `usr_datum`;
CREATE TABLE `usr_datum` (
  `usr_id` int(11) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(30) DEFAULT '',
  `wechat` varchar(255) DEFAULT '',
  `level` varchar(3) DEFAULT NULL,
  `status` enum('1','2','3') DEFAULT '1' COMMENT '1 接受对战 2 修整中',
  `avatar` varchar(255) DEFAULT NULL,
  `win` mediumint(9) DEFAULT '0',
  `lose` mediumint(9) DEFAULT '0',
  `tie` mediumint(9) unsigned DEFAULT '0',
  `sex` tinyint(1) DEFAULT '1' COMMENT '1 男 2 女 3 ',
  `like` mediumint(8) unsigned DEFAULT '0',
  `unlike` mediumint(8) unsigned DEFAULT '0',
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
