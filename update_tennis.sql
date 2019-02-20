/*
Navicat MySQL Data Transfer

Source Server         : yitube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : tennis

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2019-02-20 17:50:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for h2h
-- ----------------------------
DROP TABLE IF EXISTS `h2h`;
CREATE TABLE `h2h` (
  `id` int(11) NOT NULL,
  `p1` smallint(6) DEFAULT NULL,
  `p2` smallint(6) DEFAULT NULL,
  `win` smallint(6) DEFAULT NULL,
  `lose` smallint(6) DEFAULT NULL,
  `expire` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of h2h
-- ----------------------------
INSERT INTO `h2h` VALUES ('1', '532', '471', '1', '2', '2019-02-21 17:36:09');
