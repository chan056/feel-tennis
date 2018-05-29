/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-05-29 18:16:08
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for competition
-- ----------------------------
DROP TABLE IF EXISTS `competition`;
CREATE TABLE `competition` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `offense` mediumint(9) DEFAULT NULL,
  `defense` mediumint(9) DEFAULT NULL,
  `offense_time` datetime DEFAULT NULL,
  `defense_time` datetime DEFAULT NULL,
  `stage` tinyint(8) DEFAULT '1' COMMENT '1 发起 2 接受  3 拒绝 4 结束',
  `offense_res` tinyint(8) DEFAULT NULL COMMENT '1 胜 2 负 3 平',
  `defense_res` tinyint(8) DEFAULT NULL COMMENT '1 胜 2 负 3 平',
  `close_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
