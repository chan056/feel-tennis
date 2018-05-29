/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-05-29 18:15:54
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for compete_evaluate
-- ----------------------------
DROP TABLE IF EXISTS `compete_evaluate`;
CREATE TABLE `compete_evaluate` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `evaluator` int(11) DEFAULT NULL,
  `assessed` int(11) DEFAULT NULL,
  `match_id` int(11) DEFAULT NULL,
  `result` tinyint(1) DEFAULT NULL COMMENT '1 喜欢 2 不喜欢',
  `detail` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
