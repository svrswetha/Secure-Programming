# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.24-0ubuntu0.18.04.1)
# Database: sp_share_new
# Generation Time: 2018-11-18 19:36:01 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table entity_storage_rules_with_usage
# ------------------------------------------------------------

DROP TABLE IF EXISTS `entity_storage_rules_with_usage`;

CREATE TABLE `entity_storage_rules_with_usage` (
  `group_name` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_name` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `limit` smallint(6) unsigned zerofill NOT NULL,
  `usage` smallint(6) unsigned zerofill NOT NULL,
  `entity_type` enum('G','U','GU','F','T') COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY `FK_entity_storage_rules_with_usage_groups` (`group_name`),
  KEY `FK_entity_storage_rules_with_usage_userz` (`user_name`),
  CONSTRAINT `FK_entity_storage_rules_with_usage_groups` FOREIGN KEY (`group_name`) REFERENCES `groups` (`group_name`),
  CONSTRAINT `FK_entity_storage_rules_with_usage_userz` FOREIGN KEY (`user_name`) REFERENCES `userz` (`loginname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `entity_storage_rules_with_usage` WRITE;
/*!40000 ALTER TABLE `entity_storage_rules_with_usage` DISABLE KEYS */;

INSERT INTO `entity_storage_rules_with_usage` (`group_name`, `user_name`, `limit`, `usage`, `entity_type`)
VALUES
	(NULL,'go3swetha',001000,000000,'U'),
	('documents','go3swetha',000100,000010,'GU'),
	('documents',NULL,001020,000000,'G'),
	(NULL,NULL,003000,000100,'F'),
	('exams',NULL,002000,000000,'G'),
	(NULL,'newuser3',003000,000000,'U');

/*!40000 ALTER TABLE `entity_storage_rules_with_usage` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table files
# ------------------------------------------------------------

DROP TABLE IF EXISTS `files`;

CREATE TABLE `files` (
  `file_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `original_file_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;

INSERT INTO `files` (`file_name`, `file_id`, `timestamp`, `original_file_name`)
VALUES
	('FU-4RUeP45Sp-btc qr.png','FU-4RUeP45Sp','2018-11-18 12:06:24','btc qr.png'),
	('FU-4VfuZJvkI-btc qr.png','FU-4VfuZJvkI','2018-11-18 12:06:27','btc qr.png'),
	('FU-7-ViiZywK-ss.png','FU-7-ViiZywK','2018-11-18 06:55:02','ss.png'),
	('FU-c8MPTTwmm-btc qr.png','FU-c8MPTTwmm','2018-11-18 06:45:53','btc qr.png'),
	('FU-gqQm1ohes-Cartoon-Mario.jpg','FU-gqQm1ohes','2018-11-18 06:53:43','Cartoon-Mario.jpg'),
	('FU-Hiup_cVl_-btc qr.png','FU-Hiup_cVl_','2018-11-18 06:52:49','btc qr.png'),
	('FU-lhuaAxvZj-btc qr.png','FU-lhuaAxvZj','2018-11-18 06:45:46','btc qr.png'),
	('FU-sSVgkEnXq-btc qr.png','FU-sSVgkEnXq','2018-11-18 06:45:59','btc qr.png'),
	('FU-USYj4guvN-btc qr.png','FU-USYj4guvN','2018-11-18 12:05:35','btc qr.png'),
	('FU-uZjn5-av0-btc qr.png','FU-uZjn5-av0','2018-11-18 12:06:30','btc qr.png'),
	('FU-VNrl25Avm-btc qr.png','FU-VNrl25Avm','2018-11-18 12:05:24','btc qr.png'),
	('FU-wMuDHeASM-btc qr.png','FU-wMuDHeASM','2018-11-18 06:45:34','btc qr.png'),
	('FU-WXuIEqWcL-btc qr.png','FU-WXuIEqWcL','2018-11-18 06:46:33','btc qr.png'),
	('FU-XbF5Lzzto-btc qr.png','FU-XbF5Lzzto','2018-11-18 06:46:30','btc qr.png'),
	('FU-zVedr6qnU-btc qr.png','FU-zVedr6qnU','2018-11-18 06:45:56','btc qr.png');

/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table group_membership
# ------------------------------------------------------------

DROP TABLE IF EXISTS `group_membership`;

CREATE TABLE `group_membership` (
  `group_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_name` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAdded` tinyint(3) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `gm_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_type` enum('A','U') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'U',
  PRIMARY KEY (`group_name`,`member_name`),
  KEY `FK_group_membership_userz` (`member_name`),
  CONSTRAINT `FK_group_membership_groups` FOREIGN KEY (`group_name`) REFERENCES `groups` (`group_name`),
  CONSTRAINT `FK_group_membership_userz` FOREIGN KEY (`member_name`) REFERENCES `userz` (`loginname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `group_membership` WRITE;
/*!40000 ALTER TABLE `group_membership` DISABLE KEYS */;

INSERT INTO `group_membership` (`group_name`, `member_name`, `isAdded`, `timestamp`, `gm_id`, `member_type`)
VALUES
	('documents','go3swetha',1,'2018-11-17 13:30:15','dasdsadasda','A'),
	('documents','go4swetha',1,'2018-11-18 08:02:13','GM-WSA76B','U'),
	('movies','go4swetha',1,'2018-11-17 17:54:27','GM-zoF5AU_5b','U');

/*!40000 ALTER TABLE `group_membership` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table groups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `groups`;

CREATE TABLE `groups` (
  `group_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `group_creator` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActivated` tinyint(3) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`group_name`),
  KEY `FK_groups_userz` (`group_creator`),
  CONSTRAINT `FK_groups_userz` FOREIGN KEY (`group_creator`) REFERENCES `userz` (`loginname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;

INSERT INTO `groups` (`group_name`, `datetime`, `group_creator`, `isActivated`)
VALUES
	('documents','2018-11-17 07:26:23','go2sujeet',001),
	('exams','2018-11-18 18:55:32','go4swetha',NULL),
	('movies','2018-11-17 06:11:31','go2sujeet',001);

/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table item_sharing
# ------------------------------------------------------------

DROP TABLE IF EXISTS `item_sharing`;

CREATE TABLE `item_sharing` (
  `item_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `FK_item_sharing_items` (`item_id`),
  KEY `FK_item_sharing_groups` (`group_name`),
  CONSTRAINT `FK_item_sharing_groups` FOREIGN KEY (`group_name`) REFERENCES `groups` (`group_name`),
  CONSTRAINT `FK_item_sharing_items` FOREIGN KEY (`item_id`) REFERENCES `items` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `item_sharing` WRITE;
/*!40000 ALTER TABLE `item_sharing` DISABLE KEYS */;

INSERT INTO `item_sharing` (`item_id`, `group_name`, `creation_timestamp`)
VALUES
	('IT-Hj2ZkFjDd','documents','2018-11-18 07:35:20'),
	('IT-INSpUnBdY','documents','2018-11-18 08:00:00');

/*!40000 ALTER TABLE `item_sharing` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `items`;

CREATE TABLE `items` (
  `item_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_type` enum('FLAT','FILE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FLAT',
  `file_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_creator` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_id`),
  KEY `FK_items_userz` (`item_creator`),
  KEY `FK_items_files` (`file_id`),
  CONSTRAINT `FK_items_files` FOREIGN KEY (`file_id`) REFERENCES `files` (`file_id`),
  CONSTRAINT `FK_items_userz` FOREIGN KEY (`item_creator`) REFERENCES `userz` (`loginname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;

INSERT INTO `items` (`item_id`, `item_type`, `file_id`, `item_description`, `item_creator`, `timestamp`)
VALUES
	('IT-CYmJLsjUE','FLAT',NULL,'by g333_new Swetha','go4swetha','2018-11-18 07:33:12'),
	('IT-Hj2ZkFjDd','FILE','FU-7-ViiZywK','by g333_new Swetha','go4swetha','2018-11-18 07:35:20'),
	('IT-INSpUnBdY','FILE','FU-7-ViiZywK','by g333_new Swetha','go10swetha','2018-11-18 08:00:00'),
	('IT-Zqz5gS6PJ','FLAT',NULL,'by g333_new Swetha','go4swetha','2018-11-18 07:32:17');

/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table userz
# ------------------------------------------------------------

DROP TABLE IF EXISTS `userz`;

CREATE TABLE `userz` (
  `actualname` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loginname` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `jwt` mediumtext COLLATE utf8mb4_unicode_ci,
  `istokengenerated` tinyint(3) unsigned zerofill DEFAULT '000',
  `isvalidated` tinyint(3) unsigned zerofill DEFAULT '000',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usertype` enum('A','U','R') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'U',
  PRIMARY KEY (`loginname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `userz` WRITE;
/*!40000 ALTER TABLE `userz` DISABLE KEYS */;

INSERT INTO `userz` (`actualname`, `loginname`, `password`, `jwt`, `istokengenerated`, `isvalidated`, `timestamp`, `usertype`)
VALUES
	('swetha10','go10swetha','$2b$10$c4PIHaSlwR7Uhz7CLXP7IefC4OyBRpsDbrgimQSRt0TS8Oey5hbvi','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbm5hbWUiOiJnbzEwc3dldGhhIiwiaWF0IjoxNTQyNTI3OTY3LCJleHAiOjE1NDI2MTQzNjd9.wVEtO6c28J2GX8O7-Nfi8FAUrpWh5AxjQE__zIu6MtY',001,000,'2018-11-18 07:59:21','U'),
	('sujeetbuddiga','go2sujeet','$2b$10$zt1EACwtTh8Dw5z4Z0l3ju11FdAGV.ianN0btBntp0diCEg.xGeHG','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbm5hbWUiOiJnbzJzdWplZXQiLCJpYXQiOjE1NDI0MzY3NDAsImV4cCI6MTU0MjUyMzE0MH0.zF4p9EehygwRru0vo4s0XV-RVZDOgQ0fWE11Bd6TVp0',001,000,'2018-11-17 05:59:00','U'),
	('svr swetha3','go3swetha','$2b$10$B1Wy/T9TMZPR4n1RLvrSpO8H81Ut6/TIBPj9NQrl4gICy.llaG2pW','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbm5hbWUiOiJnbzNzd2V0aGEiLCJpYXQiOjE1NDIyODk1ODcsImV4cCI6MTU0MjM3NTk4N30.bEEmtlPq8pa0H6VrlQn2gwbF3qRnbzqd9FWyHuBMFYY',001,000,'2018-11-15 13:45:19','A'),
	('swetha','go4swetha','$2b$10$.pI7Whbyp.yQfbeCHqyITOHuKBB8fWHb7dKbjiMNvAEUMw2aMvRRi','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbm5hbWUiOiJnbzRzd2V0aGEiLCJpYXQiOjE1NDI1NjczMTcsImV4cCI6MTU0MjY1MzcxN30.IlkYRzipjoFkMDhVN7tlkX5QgXM37ZSa8UKCVYO_RB0',001,001,'2018-11-17 17:50:03','A'),
	('go5swetha','go5swetha','$2b$10$VBUX/2eI5a7SyYE3nss30uEAUjKf2E/J6L5rpao0bnBTdujUYih2C',NULL,000,000,'2018-11-17 17:59:35','U'),
	('user','newuser','$2b$10$o/k9kc3nWYdNywvxv7paFuqMhtsQQpjPBhS/PuC92UBH1Qd5FMjly',NULL,000,000,'2018-11-18 19:01:40','U'),
	('user','newuser2','$2b$10$ALnbBS1h2kETikxERJW/LeVbfGA0J3OV9sRD8EObw7tZLBVqFyIha',NULL,000,000,'2018-11-18 19:04:31','U'),
	('user','newuser3','$2b$10$L2EG.0damChmaYC7FXyB3.8BvmH9QsVX2BwIDhNNXZA/REkgjP/bW',NULL,000,000,'2018-11-18 19:07:40','U'),
	('svr swetha3','root','$2b$10$dlW5WgpFDMBkJOqsgATGp.tDXai/fCJDL.YpJUTM22UVZSTHQweyC','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbm5hbWUiOiJyb290IiwiaWF0IjoxNTQyNDc2NDU1LCJleHAiOjE1NDI1NjI4NTV9.jW83jGcxwQzgjOtJ6r1HkBDSO2r7zw_nIrKqmMLJiLI',001,000,'2018-11-17 17:40:02','R');

/*!40000 ALTER TABLE `userz` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
