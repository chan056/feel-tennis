/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-05-28 16:07:04
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for inmail
-- ----------------------------
DROP TABLE IF EXISTS `inmail`;
CREATE TABLE `inmail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender` mediumint(9) DEFAULT NULL,
  `receiver` mediumint(9) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `readed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='站内信\r\n发起者：系统、个人、组织\r\n接收者：个人、组织';
