/*
Navicat MySQL Data Transfer

Source Server         : chantube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-06-19 14:40:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for video
-- ----------------------------
DROP TABLE IF EXISTS `video`;
CREATE TABLE `video` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `album_id` int(10) unsigned NOT NULL,
  `headline` varchar(45) NOT NULL,
  `headline_eng` varchar(45) DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  `impression` int(8) unsigned NOT NULL DEFAULT '0',
  `video_ext` varchar(255) DEFAULT NULL,
  `update_time` bigint(13) DEFAULT NULL,
  `support_time` mediumint(9) DEFAULT '0',
  `degrade_time` mediumint(9) DEFAULT '0',
  `translated` tinyint(1) DEFAULT '0',
  `duration` float(8,2) DEFAULT '11.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `tag` (`tag`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COMMENT='视频列表';
