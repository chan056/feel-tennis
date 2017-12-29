/*
Navicat MySQL Data Transfer

Source Server         : n
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-12-30 06:50:50
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for album
-- ----------------------------
DROP TABLE IF EXISTS `album`;
CREATE TABLE `album` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sport_id` int(11) unsigned NOT NULL,
  `author_id` int(10) unsigned NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `album_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='某项运动（网球）的专辑列表，专辑由不同的人制作';

-- ----------------------------
-- Records of album
-- ----------------------------
INSERT INTO `album` VALUES ('1', '1', '1', 'feel tennis', '1,2');
INSERT INTO `album` VALUES ('2', '1', '2', 'top tennis', '4,5');

-- ----------------------------
-- Table structure for feedback
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` mediumint(9) unsigned NOT NULL AUTO_INCREMENT,
  `ip` char(255) DEFAULT NULL,
  `description` text NOT NULL,
  `site` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `files` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of feedback
-- ----------------------------
INSERT INTO `feedback` VALUES ('3', '::1', 'dddddddddddddddddd', 'sd', 'dsd@dad.csd', '\\upload\\字段.txt,\\upload\\字段.txt');
INSERT INTO `feedback` VALUES ('4', '::ffff:127.0.0.1', '33333333333', '', '', '\\upload\\RESTful.docx,\\upload\\搜索技巧.docx');
INSERT INTO `feedback` VALUES ('5', '::ffff:127.0.0.1', 'xxxxxxxxxxxxx', '', '', '\\upload\\字段.txt');
INSERT INTO `feedback` VALUES ('6', '::1', 'dddddddddddddddd', '', '', '\\upload\\RESTful.docx');
INSERT INTO `feedback` VALUES ('7', '::ffff:127.0.0.1', 'dddddddddddddddddd', '', '', '\\upload\\搜索技巧.docx');
INSERT INTO `feedback` VALUES ('8', '::ffff:127.0.0.1', 'tttttttttttttt', '', '', '\\upload\\字段.txt');

-- ----------------------------
-- Table structure for maker
-- ----------------------------
DROP TABLE IF EXISTS `maker`;
CREATE TABLE `maker` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='视频制作者';

-- ----------------------------
-- Records of maker
-- ----------------------------
INSERT INTO `maker` VALUES ('1', 'Tomaz Mencinger');

-- ----------------------------
-- Table structure for sport
-- ----------------------------
DROP TABLE IF EXISTS `sport`;
CREATE TABLE `sport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sport
-- ----------------------------
INSERT INTO `sport` VALUES ('1', 'tennis');
INSERT INTO `sport` VALUES ('2', 'basketball');

-- ----------------------------
-- Table structure for stat
-- ----------------------------
DROP TABLE IF EXISTS `stat`;
CREATE TABLE `stat` (
  `v_show` int(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of stat
-- ----------------------------
INSERT INTO `stat` VALUES ('97');

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `sport_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`name`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES ('1', '网球', '1');
INSERT INTO `tag` VALUES ('2', 'piano', '1');
INSERT INTO `tag` VALUES ('3', '发球', '1');
INSERT INTO `tag` VALUES ('4', '接发球', '1');
INSERT INTO `tag` VALUES ('5', '正手', '1');

-- ----------------------------
-- Table structure for video
-- ----------------------------
DROP TABLE IF EXISTS `video`;
CREATE TABLE `video` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `album_id` int(10) unsigned NOT NULL,
  `headline` varchar(45) NOT NULL,
  `tag` varchar(45) DEFAULT NULL,
  `impression` int(8) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `tag` (`tag`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='视频列表';

-- ----------------------------
-- Records of video
-- ----------------------------
INSERT INTO `video` VALUES ('1', '1', 'How To Serve In Tennis In 7 Steps', '1,3', '1');

-- ----------------------------
-- View structure for 1
-- ----------------------------
DROP VIEW IF EXISTS `1`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `1` AS select `album`.`author_id` AS `author_id`,`album`.`tag` AS `tag`,`video`.`album_id` AS `album_id`,`video`.`headline` AS `headline`,`sport`.`name` AS `name` from ((((`sport` join `tag`) join `video`) join `maker`) join `album`) ;
