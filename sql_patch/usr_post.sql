/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 80012
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 80012
File Encoding         : 65001

Date: 2018-12-26 02:13:10
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `usr_post`
-- ----------------------------
DROP TABLE IF EXISTS `usr_post`;
CREATE TABLE `usr_post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usr_id` mediumint(9) NOT NULL,
  `video_id` mediumint(9) NOT NULL,
  `type` tinyint(1) NOT NULL COMMENT '1 视频 2 字幕',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `readers` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '',
  `checkor` mediumint(9) DEFAULT NULL,
  `check_time` datetime DEFAULT NULL,
  `check_result` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='用户上传 视频、字幕的记录';

-- ----------------------------
-- Records of usr_post
-- ----------------------------

