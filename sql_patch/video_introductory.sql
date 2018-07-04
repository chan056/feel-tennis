/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-07-04 17:56:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for video_introductory
-- ----------------------------
DROP TABLE IF EXISTS `video_introductory`;
CREATE TABLE `video_introductory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `headline` varchar(45) NOT NULL,
  `headline_eng` varchar(45) DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  `video_ext` varchar(255) DEFAULT NULL,
  `update_time` bigint(13) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `tag` (`tag`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='视频列表';
