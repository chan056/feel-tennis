/*
Navicat MySQL Data Transfer

Source Server         : yitube
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : n

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2019-01-24 14:10:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for athlete
-- ----------------------------
DROP TABLE IF EXISTS `athlete`;
CREATE TABLE `athlete` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sport_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `en_name` varchar(255) DEFAULT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1男 2女 3其他',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of athlete
-- ----------------------------
INSERT INTO `athlete` VALUES ('1', '1', '西蒙娜·哈勒普', null, '2');
INSERT INTO `athlete` VALUES ('2', '1', '斯隆·斯蒂芬斯', null, '2');
INSERT INTO `athlete` VALUES ('3', '1', '佩特拉·科维托娃', null, '2');
INSERT INTO `athlete` VALUES ('4', '1', '大坂直美', null, '2');
INSERT INTO `athlete` VALUES ('5', '1', '安吉丽克·科贝尔', null, '2');
INSERT INTO `athlete` VALUES ('6', '1', '叶琳娜·斯维托丽娜', null, '2');
INSERT INTO `athlete` VALUES ('7', '1', '卡洛琳娜·普利斯科娃', null, '2');
INSERT INTO `athlete` VALUES ('8', '1', '姬姬·贝尔滕斯', null, '2');
INSERT INTO `athlete` VALUES ('9', '1', '卡洛琳·沃兹尼亚奇', null, '2');
INSERT INTO `athlete` VALUES ('10', '1', '阿莉娜·萨巴兰卡', null, '2');
INSERT INTO `athlete` VALUES ('11', '1', '达利亚·卡萨特金娜', null, '2');
INSERT INTO `athlete` VALUES ('12', '1', '阿纳斯塔西娅·塞瓦斯托娃', null, '2');
INSERT INTO `athlete` VALUES ('13', '1', '塞蕾娜·威廉姆斯', null, '2');
INSERT INTO `athlete` VALUES ('14', '1', '阿什莉·巴蒂', null, '2');
INSERT INTO `athlete` VALUES ('15', '1', '茱莉亚·格尔格斯', null, '2');
INSERT INTO `athlete` VALUES ('16', '1', '加比妮·穆古鲁扎', null, '2');
INSERT INTO `athlete` VALUES ('17', '1', '麦迪逊·凯斯', null, '2');
INSERT INTO `athlete` VALUES ('18', '1', '王蔷', null, '2');
INSERT INTO `athlete` VALUES ('19', '1', '卡洛琳·加西亚', null, '2');
INSERT INTO `athlete` VALUES ('20', '1', '安妮特·康塔维特', null, '2');
INSERT INTO `athlete` VALUES ('21', '1', '伊莉丝·梅尔滕斯', null, '2');
INSERT INTO `athlete` VALUES ('22', '1', '叶莲娜·奥斯塔彭科', null, '2');
INSERT INTO `athlete` VALUES ('23', '1', '莱西亚·图萨伦科', null, '2');
INSERT INTO `athlete` VALUES ('24', '1', '卡拉·苏亚雷斯-纳瓦罗', null, '2');
INSERT INTO `athlete` VALUES ('25', '1', '米哈埃拉·布扎内斯库', null, '2');
INSERT INTO `athlete` VALUES ('26', '1', '多米尼卡·齐布尔科娃', null, '2');
INSERT INTO `athlete` VALUES ('27', '1', '卡米拉·吉奥尔吉', null, '2');
INSERT INTO `athlete` VALUES ('28', '1', '多娜·维基奇', null, '2');
INSERT INTO `athlete` VALUES ('29', '1', '谢淑薇', null, '2');
INSERT INTO `athlete` VALUES ('30', '1', '玛丽亚·莎拉波娃', null, '2');
INSERT INTO `athlete` VALUES ('31', '1', '阿莱雅克珊德拉·萨斯诺维奇', null, '2');
INSERT INTO `athlete` VALUES ('32', '1', '丹妮尔·科林斯', null, '2');
INSERT INTO `athlete` VALUES ('33', '1', '佩特拉·马尔蒂奇', null, '2');
INSERT INTO `athlete` VALUES ('34', '1', '维纳斯·威廉姆斯', null, '2');
INSERT INTO `athlete` VALUES ('35', '1', '索菲亚·科宁', null, '2');
INSERT INTO `athlete` VALUES ('36', '1', '玛利亚·萨卡里', null, '2');
INSERT INTO `athlete` VALUES ('37', '1', '凯特琳娜·斯尼亚科娃', null, '2');
INSERT INTO `athlete` VALUES ('38', '1', '约翰娜·孔塔', null, '2');
INSERT INTO `athlete` VALUES ('39', '1', '尤利娅·普汀塞娃', null, '2');
INSERT INTO `athlete` VALUES ('40', '1', '阿纳斯塔西娅·帕芙柳琴科娃', null, '2');
INSERT INTO `athlete` VALUES ('41', '1', '郑赛赛', null, '2');
INSERT INTO `athlete` VALUES ('42', '1', '张帅', null, '2');
INSERT INTO `athlete` VALUES ('43', '1', '本琳达·本西奇', null, '2');
INSERT INTO `athlete` VALUES ('44', '1', '克里斯蒂娜·梅拉德诺维奇', null, '2');
INSERT INTO `athlete` VALUES ('45', '1', '维多利亚·库兹莫娃', null, '2');
INSERT INTO `athlete` VALUES ('46', '1', '达利亚·加芙里洛娃', null, '2');
INSERT INTO `athlete` VALUES ('47', '1', '阿基拉·汤姆利亚诺维奇', null, '2');
INSERT INTO `athlete` VALUES ('48', '1', '芭芭拉·斯特里索娃', null, '2');
INSERT INTO `athlete` VALUES ('49', '1', '阿里泽·科内', null, '2');
INSERT INTO `athlete` VALUES ('50', '1', '维多利亚·阿扎伦卡', null, '2');
INSERT INTO `athlete` VALUES ('51', '1', '达亚娜·亚斯特列姆斯卡', null, '2');
INSERT INTO `athlete` VALUES ('52', '1', '艾莉森·范-乌伊凡克', null, '2');
INSERT INTO `athlete` VALUES ('53', '1', '泡林·帕门蒂尔', null, '2');
INSERT INTO `athlete` VALUES ('54', '1', '艾莉森·里斯克', null, '2');
INSERT INTO `athlete` VALUES ('55', '1', '克斯汀·菲利普肯斯', null, '2');
INSERT INTO `athlete` VALUES ('56', '1', '翁斯·贾贝乌尔', null, '2');
INSERT INTO `athlete` VALUES ('57', '1', '莫妮卡·普伊格', null, '2');
INSERT INTO `athlete` VALUES ('58', '1', '阿莱克珊德拉·克鲁尼奇', null, '2');
INSERT INTO `athlete` VALUES ('59', '1', '丽贝卡·彼得森', null, '2');
INSERT INTO `athlete` VALUES ('60', '1', '王雅繁', null, '2');
INSERT INTO `athlete` VALUES ('61', '1', '叶卡捷琳娜·马卡洛���', null, '2');
INSERT INTO `athlete` VALUES ('62', '1', '维拉·拉普科', null, '2');
INSERT INTO `athlete` VALUES ('63', '1', '安娜-卡洛琳娜·施米德洛娃', null, '2');
INSERT INTO `athlete` VALUES ('64', '1', '提米亚·巴博斯', null, '2');
INSERT INTO `athlete` VALUES ('65', '1', '安德里娅·佩特科维奇', null, '2');
INSERT INTO `athlete` VALUES ('66', '1', '约翰娜·拉尔森', null, '2');
INSERT INTO `athlete` VALUES ('67', '1', '马格达莱纳·莱巴里科娃', null, '2');
INSERT INTO `athlete` VALUES ('68', '1', '阿曼达·阿尼西莫娃', null, '2');
INSERT INTO `athlete` VALUES ('69', '1', '伊琳娜-卡米莉亚·贝古', null, '2');
INSERT INTO `athlete` VALUES ('70', '1', '叶甫根尼娅·罗迪娜', null, '2');
INSERT INTO `athlete` VALUES ('71', '1', '马尔凯塔·万卓索娃', null, '2');
INSERT INTO `athlete` VALUES ('72', '1', '塔季扬娜·玛利亚', null, '2');
INSERT INTO `athlete` VALUES ('73', '1', '塔玛拉·齐丹塞克', null, '2');
INSERT INTO `athlete` VALUES ('74', '1', '萨曼莎·斯托瑟', null, '2');
INSERT INTO `athlete` VALUES ('75', '1', '尤金妮·布沙尔', null, '2');
INSERT INTO `athlete` VALUES ('76', '1', '叶卡捷琳娜·亚历山德洛娃', null, '2');
INSERT INTO `athlete` VALUES ('77', '1', '阿纳斯塔西娅·波塔波娃', null, '2');
INSERT INTO `athlete` VALUES ('78', '1', '麦迪逊·布伦格尔', null, '2');
INSERT INTO `athlete` VALUES ('79', '1', '玛格丽塔·加斯帕艳', null, '2');
INSERT INTO `athlete` VALUES ('80', '1', '达利拉·雅库波维奇', null, '2');
INSERT INTO `athlete` VALUES ('81', '1', '露西卡·库姆淳', null, '2');
INSERT INTO `athlete` VALUES ('82', '1', '萨拉·索里贝斯-托莫', null, '2');
INSERT INTO `athlete` VALUES ('83', '1', '莫娜·巴特尔', null, '2');
INSERT INTO `athlete` VALUES ('84', '1', '贝纳达·佩拉', null, '2');
INSERT INTO `athlete` VALUES ('85', '1', '斯黛凡妮·沃伊格勒', null, '2');
INSERT INTO `athlete` VALUES ('86', '1', '凯亚·卡内皮', null, '2');
INSERT INTO `athlete` VALUES ('87', '1', '凯蒂·博尔特', null, '2');
INSERT INTO `athlete` VALUES ('88', '1', '比昂卡·安德莱斯库', null, '2');
INSERT INTO `athlete` VALUES ('89', '1', '克里斯蒂娜·普利斯科娃', null, '2');
INSERT INTO `athlete` VALUES ('90', '1', '索拉娜·科斯蒂亚', null, '2');
INSERT INTO `athlete` VALUES ('91', '1', '波洛娜·赫尔科格', null, '2');
INSERT INTO `athlete` VALUES ('92', '1', '拉腊·阿鲁阿巴莱娜', null, '2');
INSERT INTO `athlete` VALUES ('93', '1', '泰勒·汤森德', null, '2');
INSERT INTO `athlete` VALUES ('94', '1', '安娜·布林科娃', null, '2');
INSERT INTO `athlete` VALUES ('95', '1', '凯特琳娜·库兹洛娃', null, '2');
INSERT INTO `athlete` VALUES ('96', '1', '扎丽娜·迪亚斯', null, '2');
INSERT INTO `athlete` VALUES ('97', '1', '维拉·兹沃娜列娃', null, '2');
INSERT INTO `athlete` VALUES ('98', '1', '玛格达·里纳特', null, '2');
INSERT INTO `athlete` VALUES ('99', '1', '菲昂娜·费罗', null, '2');
INSERT INTO `athlete` VALUES ('100', '1', '安娜·博格丹', null, '2');
INSERT INTO `athlete` VALUES ('101', '1', '诺瓦克·德约科维奇', null, '1');
INSERT INTO `athlete` VALUES ('102', '1', '拉菲尔·纳达尔', null, '1');
INSERT INTO `athlete` VALUES ('103', '1', '亚历山大·兹韦列夫', null, '1');
INSERT INTO `athlete` VALUES ('104', '1', '胡安-马丁·德尔波特罗', null, '1');
INSERT INTO `athlete` VALUES ('105', '1', '凯文·安德森', null, '1');
INSERT INTO `athlete` VALUES ('106', '1', '罗杰·费德勒', null, '1');
INSERT INTO `athlete` VALUES ('107', '1', '多米尼克·蒂姆', null, '1');
INSERT INTO `athlete` VALUES ('108', '1', '锦织圭', null, '1');
INSERT INTO `athlete` VALUES ('109', '1', '约翰·伊斯内尔', null, '1');
INSERT INTO `athlete` VALUES ('110', '1', '马林·西里奇', null, '1');
INSERT INTO `athlete` VALUES ('111', '1', '卡伦·卡恰诺夫', null, '1');
INSERT INTO `athlete` VALUES ('112', '1', '博纳·丘里奇', null, '1');
INSERT INTO `athlete` VALUES ('113', '1', '法比奥·弗格尼尼', null, '1');
INSERT INTO `athlete` VALUES ('114', '1', '斯蒂芬诺斯·西西帕斯', null, '1');
INSERT INTO `athlete` VALUES ('115', '1', '米洛斯·拉奥尼奇', null, '1');
INSERT INTO `athlete` VALUES ('116', '1', '马可·塞齐纳托', null, '1');
INSERT INTO `athlete` VALUES ('117', '1', '丹尼尔·梅德韦杰夫', null, '1');
INSERT INTO `athlete` VALUES ('118', '1', '迭戈·施瓦茨曼', null, '1');
INSERT INTO `athlete` VALUES ('119', '1', '尼克洛斯·巴斯拉什维利', null, '1');
INSERT INTO `athlete` VALUES ('120', '1', '大卫·戈芬', null, '1');
INSERT INTO `athlete` VALUES ('121', '1', '罗伯托·布蒂斯塔-阿古特', null, '1');
INSERT INTO `athlete` VALUES ('122', '1', '帕布洛·卡雷尼奥-布斯塔', null, '1');
INSERT INTO `athlete` VALUES ('123', '1', '格里戈尔·迪米特洛夫', null, '1');
INSERT INTO `athlete` VALUES ('124', '1', '费尔南多·沃达斯科', null, '1');
INSERT INTO `athlete` VALUES ('125', '1', '理查德·加斯奎', null, '1');
INSERT INTO `athlete` VALUES ('126', '1', '亚历克斯·德米纳尔', null, '1');
INSERT INTO `athlete` VALUES ('127', '1', '丹尼斯·沙波瓦洛夫', null, '1');
INSERT INTO `athlete` VALUES ('128', '1', '凯尔·埃德蒙德', null, '1');
INSERT INTO `athlete` VALUES ('129', '1', '吉勒·西蒙', null, '1');
INSERT INTO `athlete` VALUES ('130', '1', '卢卡·普伊', null, '1');
INSERT INTO `athlete` VALUES ('131', '1', '菲利普·科尔什雷伯', null, '1');
INSERT INTO `athlete` VALUES ('132', '1', '盖尔·孟菲尔斯', null, '1');
INSERT INTO `athlete` VALUES ('133', '1', '斯蒂夫·约翰森', null, '1');
INSERT INTO `athlete` VALUES ('134', '1', '弗兰西斯·蒂亚菲', null, '1');
INSERT INTO `athlete` VALUES ('135', '1', '杰瑞米·查迪', null, '1');
INSERT INTO `athlete` VALUES ('136', '1', '约翰·米尔曼', null, '1');
INSERT INTO `athlete` VALUES ('137', '1', '安德里亚斯·塞皮', null, '1');
INSERT INTO `athlete` VALUES ('138', '1', '马丁·克里赞', null, '1');
INSERT INTO `athlete` VALUES ('139', '1', '若昂·索萨', null, '1');
INSERT INTO `athlete` VALUES ('140', '1', '尼古拉斯·雅里', null, '1');
INSERT INTO `athlete` VALUES ('141', '1', '杜尚·拉约维奇', null, '1');
INSERT INTO `athlete` VALUES ('142', '1', '马莱克·贾兹里', null, '1');
INSERT INTO `athlete` VALUES ('143', '1', '马休·伊布登', null, '1');
INSERT INTO `athlete` VALUES ('144', '1', '艾德里安·马纳里诺', null, '1');
INSERT INTO `athlete` VALUES ('145', '1', '马顿·福索维斯', null, '1');
INSERT INTO `athlete` VALUES ('146', '1', '山姆·奎里', null, '1');
INSERT INTO `athlete` VALUES ('147', '1', '皮埃尔-雨果·赫伯特', null, '1');
INSERT INTO `athlete` VALUES ('148', '1', '泰勒·弗里茨', null, '1');
INSERT INTO `athlete` VALUES ('149', '1', '莱昂纳多·梅耶尔', null, '1');
INSERT INTO `athlete` VALUES ('150', '1', '郑泫', null, '1');
INSERT INTO `athlete` VALUES ('151', '1', '扬-伦纳德·施特鲁夫', null, '1');
INSERT INTO `athlete` VALUES ('152', '1', '达米尔·德祖赫', null, '1');
INSERT INTO `athlete` VALUES ('153', '1', '马泰奥·贝雷蒂尼', null, '1');
INSERT INTO `athlete` VALUES ('154', '1', '罗宾·哈泽', null, '1');
INSERT INTO `athlete` VALUES ('155', '1', '米哈伊尔·库库什金', null, '1');
INSERT INTO `athlete` VALUES ('156', '1', '马吕斯·柯皮尔', null, '1');
INSERT INTO `athlete` VALUES ('157', '1', '斯坦·瓦林卡', null, '1');
INSERT INTO `athlete` VALUES ('158', '1', '贝努瓦·帕尔雷', null, '1');
INSERT INTO `athlete` VALUES ('159', '1', '丹尼斯·库德拉', null, '1');
INSERT INTO `athlete` VALUES ('160', '1', '圭多·佩拉', null, '1');
INSERT INTO `athlete` VALUES ('161', '1', '乔丹·汤普森', null, '1');
INSERT INTO `athlete` VALUES ('162', '1', '皮特·高约夫茨克', null, '1');
INSERT INTO `athlete` VALUES ('163', '1', '菲里西亚诺·洛佩兹', null, '1');
INSERT INTO `athlete` VALUES ('164', '1', '卡莫隆·诺里', null, '1');
INSERT INTO `athlete` VALUES ('165', '1', '阿利亚兹·贝德内', null, '1');
INSERT INTO `athlete` VALUES ('166', '1', '西冈良仁', null, '1');
INSERT INTO `athlete` VALUES ('167', '1', '尼克·克耶高斯', null, '1');
INSERT INTO `athlete` VALUES ('168', '1', '米沙·兹韦列夫', null, '1');
INSERT INTO `athlete` VALUES ('169', '1', '丹尼尔太郎', null, '1');
INSERT INTO `athlete` VALUES ('170', '1', '圭多·安德雷奥兹', null, '1');
INSERT INTO `athlete` VALUES ('171', '1', '阿尔伯特·拉莫斯-比尼奥拉斯', null, '1');
INSERT INTO `athlete` VALUES ('172', '1', '休伯特·赫克奇', null, '1');
INSERT INTO `athlete` VALUES ('173', '1', '罗伯托·卡巴勒斯-巴耶纳', null, '1');
INSERT INTO `athlete` VALUES ('174', '1', '特尼斯·杉德格伦', null, '1');
INSERT INTO `athlete` VALUES ('175', '1', '马克西米利安·马特勒', null, '1');
INSERT INTO `athlete` VALUES ('176', '1', '费德里科·德尔波内斯', null, '1');
INSERT INTO `athlete` VALUES ('177', '1', '伊沃·卡洛维奇', null, '1');
INSERT INTO `athlete` VALUES ('178', '1', '乌梅·穆纳尔', null, '1');
INSERT INTO `athlete` VALUES ('179', '1', '伊利亚·伊瓦什卡', null, '1');
INSERT INTO `athlete` VALUES ('180', '1', '巴勃罗·安度阿尔', null, '1');
INSERT INTO `athlete` VALUES ('181', '1', '麦肯齐·麦克唐纳', null, '1');
INSERT INTO `athlete` VALUES ('182', '1', '菲利普·克拉吉诺维奇', null, '1');
INSERT INTO `athlete` VALUES ('183', '1', '厄内斯特·古尔比斯', null, '1');
INSERT INTO `athlete` VALUES ('184', '1', '托马斯·法比亚诺', null, '1');
INSERT INTO `athlete` VALUES ('185', '1', '伯纳德·托米奇', null, '1');
INSERT INTO `athlete` VALUES ('186', '1', '布拉德利·卡拉恩', null, '1');
INSERT INTO `athlete` VALUES ('187', '1', '瓦谢克·波斯皮希尔', null, '1');
INSERT INTO `athlete` VALUES ('188', '1', '拉斯罗·杰雷', null, '1');
INSERT INTO `athlete` VALUES ('189', '1', '约瑟夫·科瓦里克', null, '1');
INSERT INTO `athlete` VALUES ('190', '1', '拉杜·阿尔伯特', null, '1');
INSERT INTO `athlete` VALUES ('191', '1', '于戈·安贝尔', null, '1');
INSERT INTO `athlete` VALUES ('192', '1', '帕布罗·奎瓦斯', null, '1');
INSERT INTO `athlete` VALUES ('193', '1', '瑞恩·哈里森', null, '1');
INSERT INTO `athlete` VALUES ('194', '1', '克里斯蒂安·加林', null, '1');
INSERT INTO `athlete` VALUES ('195', '1', '叶甫根尼·东斯科伊', null, '1');
INSERT INTO `athlete` VALUES ('196', '1', '伊日·维塞利', null, '1');
INSERT INTO `athlete` VALUES ('197', '1', '托马斯·伯蒂奇', null, '1');
INSERT INTO `athlete` VALUES ('198', '1', '雷利·奥佩尔卡', null, '1');
INSERT INTO `athlete` VALUES ('199', '1', '米尔扎·巴西奇', null, '1');
INSERT INTO `athlete` VALUES ('200', '1', '安德烈·卢布列夫', null, '1');
