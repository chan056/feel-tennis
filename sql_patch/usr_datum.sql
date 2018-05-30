/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-05-30 11:39:46
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
  `tel` bigint(20) unsigned DEFAULT NULL,
  `level` varchar(3) DEFAULT NULL,
  `status` enum('1','2','3') DEFAULT '1' COMMENT '1 接受对战 2 修整中',
  `avatar` varchar(255) DEFAULT NULL,
  `sex` tinyint(1) DEFAULT '1' COMMENT '1 男 2 女 3 ',
  `win` mediumint(9) DEFAULT '0',
  `lose` mediumint(9) DEFAULT '0',
  `tie` mediumint(9) unsigned DEFAULT '0',
  `like` mediumint(8) unsigned DEFAULT '0',
  `unlike` mediumint(8) unsigned DEFAULT '0',
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of usr_datum
-- ----------------------------
INSERT INTO `usr_datum` VALUES ('20', '鸭蛋', 'wx_chenteng', null, '1.5', '1', '/img/avatar/20.jpg', '1', '1', '0', '8', '0', '3');
INSERT INTO `usr_datum` VALUES ('22', '鸡蛋', null, null, '2.0', '1', null, '1', '0', '0', '0', '0', '0');
INSERT INTO `usr_datum` VALUES ('25', '钢蛋', 'anothercy', '13666646794', '2.0', '1', '/img/avatar/25.jpg', '1', '0', '1', '8', '0', '0');
