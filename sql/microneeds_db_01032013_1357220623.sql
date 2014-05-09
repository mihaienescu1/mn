-- MySQL dump 10.13  Distrib 5.1.66, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: microneeds
-- ------------------------------------------------------
-- Server version	5.1.66

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `achievements` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievements`
--

LOCK TABLES `achievements` WRITE;
/*!40000 ALTER TABLE `achievements` DISABLE KEYS */;
/*!40000 ALTER TABLE `achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `achievements_users`
--

DROP TABLE IF EXISTS `achievements_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `achievements_users` (
  `user_id` int(11) unsigned NOT NULL,
  `achievement_id` int(11) unsigned NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`achievement_id`),
  KEY `achievements` (`achievement_id`) USING BTREE,
  CONSTRAINT `achievements_users_ibfk_1` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `achievements_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievements_users`
--

LOCK TABLES `achievements_users` WRITE;
/*!40000 ALTER TABLE `achievements_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `achievements_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `need_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT NULL,
  `detect_links` varchar(2000) DEFAULT NULL,
  `type` enum('DELIVER_ACCEPTED','DELIVER_NOMINATION','PROVIDER_ACCEPTED','PROVIDER_NOMINATION','SHARE','COMMENT','SOCIAL_LIKE','SOCIAL_SHARE','SHARE_LINK') NOT NULL DEFAULT 'COMMENT',
  `has_file` varchar(1000) DEFAULT NULL,
  `meta_description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (3,4,2,'626191349_475023472540827','2012-12-04 15:06:10',NULL,NULL,'SOCIAL_SHARE',NULL,'http://qa.microneeds.com/#aneed_admin?n=2'),(4,4,2,'This seems worthy.  For anyone in and around Park City and the greater SLC area, I\'m happy to gather the books and consolidate them into one box.','2012-12-04 15:16:59',NULL,NULL,'COMMENT',NULL,NULL),(5,4,2,'','2012-12-04 15:17:14',NULL,NULL,'PROVIDER_NOMINATION',NULL,'need:2,user:4'),(6,4,2,'','2012-12-04 15:17:18',NULL,NULL,'PROVIDER_NOMINATION',NULL,'need:2,user:4'),(43,4,1,'','2012-12-14 12:52:28',NULL,NULL,'SOCIAL_LIKE',NULL,'http://qa.microneeds.com/#aneed_admin?n=1'),(44,4,1,'626191349_564301703596535','2012-12-14 12:56:25',NULL,NULL,'SOCIAL_SHARE',NULL,'http://qa.microneeds.com/#aneed_admin?n=1'),(48,2,4,'','2013-01-02 16:04:59',NULL,NULL,'SOCIAL_LIKE',NULL,'http://qa.microneeds.com/#aneed_admin?n=4'),(52,2,4,'','2013-01-02 17:17:07',NULL,NULL,'SOCIAL_LIKE',NULL,'http://qa.microneeds.com/#aneed_admin?n=4');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activities_comments`
--

DROP TABLE IF EXISTS `activities_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `when` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities_comments`
--

LOCK TABLES `activities_comments` WRITE;
/*!40000 ALTER TABLE `activities_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `activities_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activities_comments_likes`
--

DROP TABLE IF EXISTS `activities_comments_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities_comments_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities_comments_likes`
--

LOCK TABLES `activities_comments_likes` WRITE;
/*!40000 ALTER TABLE `activities_comments_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `activities_comments_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activities_likes`
--

DROP TABLE IF EXISTS `activities_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `when` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities_likes`
--

LOCK TABLES `activities_likes` WRITE;
/*!40000 ALTER TABLE `activities_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `activities_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deliveries` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `need_id` int(11) unsigned NOT NULL,
  `provision_id` int(11) unsigned NOT NULL,
  `content` text,
  `accepted` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` varchar(50) DEFAULT NULL,
  `accepted_date` varchar(50) DEFAULT NULL,
  `finalized` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_deliveries` (`user_id`) USING BTREE,
  KEY `need_deliveries` (`need_id`) USING BTREE,
  KEY `delivery_provision` (`provision_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

LOCK TABLES `deliveries` WRITE;
/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `levels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `experience` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `need_items`
--

DROP TABLE IF EXISTS `need_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `need_items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `need_id` int(11) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `need_items`
--

LOCK TABLES `need_items` WRITE;
/*!40000 ALTER TABLE `need_items` DISABLE KEYS */;
INSERT INTO `need_items` VALUES (1,1,'Cartoon'),(2,2,'Junie B. Jones books, as many as you can amass!'),(3,3,'a1'),(4,3,'a2'),(5,4,'a1'),(6,4,'a2');
/*!40000 ALTER TABLE `need_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `need_phases`
--

DROP TABLE IF EXISTS `need_phases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `need_phases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  `comment` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `need_phases`
--

LOCK TABLES `need_phases` WRITE;
/*!40000 ALTER TABLE `need_phases` DISABLE KEYS */;
/*!40000 ALTER TABLE `need_phases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `need_status_messages`
--

DROP TABLE IF EXISTS `need_status_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `need_status_messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `action_text` varchar(200) NOT NULL,
  `action_msg_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `action_msg_time_unix` int(11) NOT NULL,
  `need_id` int(11) NOT NULL,
  `warning` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `need_status_messages`
--

LOCK TABLES `need_status_messages` WRITE;
/*!40000 ALTER TABLE `need_status_messages` DISABLE KEYS */;
INSERT INTO `need_status_messages` VALUES (1,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> created the need','2012-11-10 16:52:52',1352562752,1,'NONE'),(2,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> shared this need','2012-11-10 16:52:54',1352562993,1,'NONE'),(3,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> shared this need','2012-11-10 16:52:55',1352563141,1,'NONE'),(4,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> shared this need','2012-11-10 16:52:57',1352563156,1,'NONE'),(5,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-11-10 16:52:58',1352563164,1,'NONE'),(6,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-11-10 16:53:04',1352563256,1,'NONE'),(7,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> shared this need','2012-11-11 13:18:42',1352639922,1,'NONE'),(8,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> nominated herself to provide this need','2012-11-11 19:38:48',1352662728,1,'NONE'),(9,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> shared this need','2012-11-11 19:39:22',1352662762,1,'NONE'),(10,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> shared this need','2012-11-16 18:47:42',1353091662,1,'NONE'),(11,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-11-24 17:09:19',1353776959,1,'NONE'),(12,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> created the need','2012-12-04 14:56:14',1354632974,2,'NONE'),(13,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> shared this need','2012-12-04 15:06:10',1354633570,2,'NONE'),(14,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> shared this need','2012-12-04 15:16:59',1354634219,2,'NONE'),(15,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> nominated himself to provide this need','2012-12-04 15:17:14',1354634234,2,'NONE'),(16,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> nominated himself to provide this need','2012-12-04 15:17:18',1354634238,2,'NONE'),(17,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> shared this need','2012-12-08 15:57:05',1354982225,1,'NONE'),(18,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> shared this need','2012-12-08 16:07:22',1354982842,1,'NONE'),(19,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> created the need','2012-12-11 19:29:04',1355254144,3,'NONE'),(20,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> created the need','2012-12-11 19:35:03',1355254503,4,'NONE'),(21,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:19:26',1355257166,3,'NONE'),(22,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:20:34',1355257234,3,'NONE'),(23,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:21:45',1355257305,3,'NONE'),(24,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:24:06',1355257446,3,'NONE'),(25,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:25:32',1355257532,3,'NONE'),(26,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:27:28',1355257648,4,'NONE'),(27,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:31:58',1355257918,4,'NONE'),(28,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:35:25',1355258125,3,'NONE'),(29,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:35:35',1355258135,4,'NONE'),(30,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:36:38',1355258198,4,'NONE'),(31,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:38:27',1355258307,3,'NONE'),(32,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:39:21',1355258361,4,'NONE'),(33,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-11 20:40:00',1355258400,4,'NONE'),(34,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 07:27:57',1355470077,4,'NONE'),(35,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 07:29:26',1355470166,4,'NONE'),(36,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 07:30:33',1355470233,3,'NONE'),(37,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 07:32:57',1355470377,3,'NONE'),(38,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 07:39:30',1355470770,3,'NONE'),(39,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 07:42:45',1355470965,4,'NONE'),(40,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 08:07:50',1355472470,3,'NONE'),(41,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 08:07:57',1355472477,4,'NONE'),(42,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 08:11:59',1355472719,4,'NONE'),(43,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 08:12:47',1355472767,3,'NONE'),(44,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 08:14:50',1355472890,4,'NONE'),(45,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 08:43:48',1355474628,4,'NONE'),(46,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 08:47:47',1355474867,4,'NONE'),(47,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 08:50:18',1355475018,3,'NONE'),(48,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 09:04:13',1355475853,4,'NONE'),(49,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 09:08:18',1355476098,3,'NONE'),(50,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 11:08:57',1355483337,4,'NONE'),(51,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 11:09:01',1355483341,3,'NONE'),(52,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 11:09:16',1355483356,4,'NONE'),(53,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-14 11:09:46',1355483386,3,'NONE'),(54,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> shared this need','2012-12-14 12:51:31',1355489491,1,'NONE'),(55,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> shared this need','2012-12-14 12:52:28',1355489548,1,'NONE'),(56,'<a class=\"users_link\" href=\"#users=4\">Jim Banister</a> shared this need','2012-12-14 12:56:25',1355489785,1,'NONE'),(57,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> shared this need','2012-12-14 18:03:03',1355508183,3,'NONE'),(58,'<a class=\"users_link\" href=\"#users=1\">Corina Vasile</a> shared this need','2012-12-16 14:36:14',1355668574,4,'NONE'),(59,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2012-12-29 22:14:54',1356819294,3,'NONE'),(60,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2013-01-02 16:04:59',1357142699,4,'NONE'),(61,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2013-01-02 16:05:52',1357142752,3,'NONE'),(62,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2013-01-02 16:06:57',1357142817,3,'NONE'),(63,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2013-01-02 17:16:33',1357146993,4,'NONE'),(64,'<a class=\"users_link\" href=\"#users=2\">Mihai Enescu</a> shared this need','2013-01-02 17:17:07',1357147027,4,'NONE');
/*!40000 ALTER TABLE `need_status_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `need_statuses`
--

DROP TABLE IF EXISTS `need_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `need_statuses` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `comments` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `need_statuses`
--

LOCK TABLES `need_statuses` WRITE;
/*!40000 ALTER TABLE `need_statuses` DISABLE KEYS */;
INSERT INTO `need_statuses` VALUES (1,'liked','One or more Likes'),(2,'shared','One or more Shares'),(3,'provided','Provision has been offered AND accepted / - Provision happens, then Need Owner has explicitly acknowledged Provision'),(4,'delivered','Delivery has been offered, and Need Owner has explicitly approved the Delivered /- Solution has been delivered to the Needee, and Need Owner has explicitly confirmed in the system '),(5,'none','No action was taken on this need.'),(6,'provide_pending','Provision has been offered AND not yet accepted'),(7,'deliver_pending','Delivey has been offered, and Not yet confirmed');
/*!40000 ALTER TABLE `need_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `need_types`
--

DROP TABLE IF EXISTS `need_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `need_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `need_types`
--

LOCK TABLES `need_types` WRITE;
/*!40000 ALTER TABLE `need_types` DISABLE KEYS */;
INSERT INTO `need_types` VALUES (1,'Technology'),(2,'Textiles'),(3,'Clean Water'),(4,'Education'),(5,'Household'),(6,'Healthcare');
/*!40000 ALTER TABLE `need_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `needs`
--

DROP TABLE IF EXISTS `needs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `needs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `type_id` int(11) unsigned DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `situation` text,
  `location` text,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '5',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `phase` int(11) NOT NULL DEFAULT '1',
  `co_owner_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `needs`
--

LOCK TABLES `needs` WRITE;
/*!40000 ALTER TABLE `needs` DISABLE KEYS */;
INSERT INTO `needs` VALUES (1,1,4,'Cartoons','A cartoon poster.','I am a designer and I need Cartoon Posters to Play with.','411 Trails End Ln, Park City, UT 84060, USA',40.6376272,-111.4798042,'edaa59611c__dsc01735.jpg',5,'2012-11-10 15:52:32',1,NULL),(2,4,4,'Junie B. Jones Books','We are an extracurricular reading program for grade schoolers, and we need books suitable for that age group.  Junie B. Jones books are particular well liked.','We are a 501(c)3 with very limited budget.  We can use all the help we can get.','941 Cutter Lane, Park City, UT',40.707733,-111.527478,'86d3ba64ff__junie_b_jones.gif',5,'2012-12-04 14:56:14',1,NULL),(3,2,1,'Los Angeles','Test 1','Ax','Los Angeles, CA',34.0522342,-118.2436849,'b416b9884d__screenshotfrom2012-12-1121:02:09.png',5,'2012-12-11 19:29:04',1,NULL),(4,2,2,'Los Angeles - Need Name','asdfg','aass','Los Angeles, CA',34.0522342,-118.2436849,'e55ad636b8__screenshotfrom2012-12-1121:02:09.png',5,'2012-12-11 19:35:03',1,NULL);
/*!40000 ALTER TABLE `needs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `needs_status_actions`
--

DROP TABLE IF EXISTS `needs_status_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `needs_status_actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `need_id` int(11) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `needs_status_actions`
--

LOCK TABLES `needs_status_actions` WRITE;
/*!40000 ALTER TABLE `needs_status_actions` DISABLE KEYS */;
INSERT INTO `needs_status_actions` VALUES (3,2,'shared','2012-12-04 15:06:10'),(31,4,'liked','2012-12-14 08:47:47'),(37,1,'liked','2012-12-14 12:52:28'),(38,1,'shared','2012-12-14 12:56:26');
/*!40000 ALTER TABLE `needs_status_actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `content` varchar(255) NOT NULL,
  `new` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_notification` (`user_id`) USING BTREE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_fields`
--

DROP TABLE IF EXISTS `profile_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_fields` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_fields`
--

LOCK TABLES `profile_fields` WRITE;
/*!40000 ALTER TABLE `profile_fields` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_values`
--

DROP TABLE IF EXISTS `profile_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile_values` (
  `field_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`field_id`,`user_id`),
  KEY `user_fields` (`user_id`) USING BTREE,
  CONSTRAINT `profile_values_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `profile_fields` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `profile_values_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_values`
--

LOCK TABLES `profile_values` WRITE;
/*!40000 ALTER TABLE `profile_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provisions`
--

DROP TABLE IF EXISTS `provisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `provisions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `need_id` int(11) unsigned NOT NULL,
  `content` text,
  `accepted` tinyint(1) NOT NULL DEFAULT '0',
  `created_date` varchar(50) DEFAULT 'CURRENT_TIMESTAMP',
  `accepted_date` varchar(50) DEFAULT NULL,
  `finalized` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_provisions` (`user_id`) USING BTREE,
  KEY `need_provisions` (`need_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provisions`
--

LOCK TABLES `provisions` WRITE;
/*!40000 ALTER TABLE `provisions` DISABLE KEYS */;
INSERT INTO `provisions` VALUES (1,4,2,NULL,0,'1354634234',NULL,0),(2,4,2,NULL,0,'1354634238',NULL,0);
/*!40000 ALTER TABLE `provisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_messages`
--

DROP TABLE IF EXISTS `user_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) unsigned NOT NULL,
  `receiver_id` int(11) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `new` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_sender` (`sender_id`) USING BTREE,
  KEY `user_receiver` (`receiver_id`) USING BTREE,
  CONSTRAINT `user_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_messages`
--

LOCK TABLES `user_messages` WRITE;
/*!40000 ALTER TABLE `user_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_need_delivery`
--

DROP TABLE IF EXISTS `user_need_delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_need_delivery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `need_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT NULL,
  `detect_links` varchar(2000) DEFAULT NULL,
  `type` enum('DELIVER_ACCEPTED','DELIVER_NOMINATION','PROVIDER_ACCEPTED','PROVIDER_NOMINATION','SHARE','COMMENT','SOCIAL_LIKE','SOCIAL_SHARE','SHARE_LINK') NOT NULL DEFAULT 'COMMENT',
  `has_file` varchar(1000) DEFAULT NULL,
  `meta_description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_need_delivery`
--

LOCK TABLES `user_need_delivery` WRITE;
/*!40000 ALTER TABLE `user_need_delivery` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_need_delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_need_delivery_comment`
--

DROP TABLE IF EXISTS `user_need_delivery_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_need_delivery_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `delivery_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `when` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_need_delivery_comment`
--

LOCK TABLES `user_need_delivery_comment` WRITE;
/*!40000 ALTER TABLE `user_need_delivery_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_need_delivery_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_need_delivery_comment_like`
--

DROP TABLE IF EXISTS `user_need_delivery_comment_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_need_delivery_comment_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_need_delivery_comment_like`
--

LOCK TABLES `user_need_delivery_comment_like` WRITE;
/*!40000 ALTER TABLE `user_need_delivery_comment_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_need_delivery_comment_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_need_delivery_like`
--

DROP TABLE IF EXISTS `user_need_delivery_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_need_delivery_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `delivery_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `when` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_need_delivery_like`
--

LOCK TABLES `user_need_delivery_like` WRITE;
/*!40000 ALTER TABLE `user_need_delivery_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_need_delivery_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_points`
--

DROP TABLE IF EXISTS `user_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_points` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `type` int(1) unsigned NOT NULL DEFAULT '0',
  `amount` int(11) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `types` (`type`) USING BTREE,
  KEY `user_points` (`user_id`) USING BTREE,
  CONSTRAINT `user_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_points`
--

LOCK TABLES `user_points` WRITE;
/*!40000 ALTER TABLE `user_points` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_provision`
--

DROP TABLE IF EXISTS `user_provision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_provision` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `need_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT NULL,
  `detect_links` varchar(2000) DEFAULT NULL,
  `type` enum('DELIVER_ACCEPTED','DELIVER_NOMINATION','PROVIDER_ACCEPTED','PROVIDER_NOMINATION','SHARE','COMMENT','SOCIAL_LIKE','SOCIAL_SHARE','SHARE_LINK') NOT NULL DEFAULT 'COMMENT',
  `has_file` varchar(1000) DEFAULT NULL,
  `meta_description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_provision`
--

LOCK TABLES `user_provision` WRITE;
/*!40000 ALTER TABLE `user_provision` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_provision` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_provision_comment`
--

DROP TABLE IF EXISTS `user_provision_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_provision_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provision_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `when` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_provision_comment`
--

LOCK TABLES `user_provision_comment` WRITE;
/*!40000 ALTER TABLE `user_provision_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_provision_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_provision_comment_like`
--

DROP TABLE IF EXISTS `user_provision_comment_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_provision_comment_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_provision_comment_like`
--

LOCK TABLES `user_provision_comment_like` WRITE;
/*!40000 ALTER TABLE `user_provision_comment_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_provision_comment_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_provision_like`
--

DROP TABLE IF EXISTS `user_provision_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_provision_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provision_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `when` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_provision_like`
--

LOCK TABLES `user_provision_like` WRITE;
/*!40000 ALTER TABLE `user_provision_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_provision_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_relationships`
--

DROP TABLE IF EXISTS `user_relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_relationships` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `friend_id` int(11) unsigned NOT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_relation` (`user_id`) USING BTREE,
  KEY `user_friend` (`friend_id`) USING BTREE,
  CONSTRAINT `user_relationships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_relationships_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_relationships`
--

LOCK TABLES `user_relationships` WRITE;
/*!40000 ALTER TABLE `user_relationships` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_relationships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_sessions` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(16) NOT NULL DEFAULT '0',
  `user_agent` varchar(50) NOT NULL,
  `last_activity` int(10) unsigned NOT NULL DEFAULT '0',
  `user_data` text NOT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES ('3a34fe07a4f9c95aec885bb5badf81ba','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164007,''),('d9dff77306771bfffa2ed1f3871b34ca','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164006,''),('35cfb2acd9cf5561cba1f1c2a4ad8974','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164006,''),('e0736fc2058e50e08832a7e000726c19','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164006,''),('001bf116d2a98ebfacb9fe82133492ee','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164006,''),('5b5fb7d6b7928b269d513137ca287d5d','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164006,''),('af0d6f030afcb969a9268e8a57bd7a25','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164006,''),('c1802b05377de1ad7970ddeae7f21bd3','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164006,''),('b1e6f3e0f07a0cd5dc302bf270997f03','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164004,''),('399808fda265c8919402a5c2b4eec04f','66.220.152.2','facebookexternalhit/1.1 (+http://www.facebook.com/',1357164004,''),('47d83edc5a4cf422f55249be374b0df7','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163981,''),('a46447abcde9050c19e12771126a2612','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163981,''),('566160a2c54cd1376e685a02faed5c85','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163981,''),('17e448369ed1f49218795091ff143ff4','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163981,''),('10c80ef4b68b8735f16dd8a0f2f75910','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163941,''),('eefc51dd019fbea0de4a1ff97e8b42f0','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163941,''),('ba6ffb878507a20392e89d1b5dfac1c8','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163941,''),('8c3047edc4dfcf0cb3c847150b7d4730','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163940,''),('40f59c4a2766568c70ffd7f009d25d93','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163940,''),('ac89afd6c250a0d3c513b950a82b8a04','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163940,''),('f9f9a2f9439e119146f70874ba5b0da3','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163940,''),('07dafebd045955b3ffa4bcea29a9080d','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163940,''),('405080098644deaa138357c749b17133','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163940,''),('f59901a5a16f904bc8226557392801fd','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163940,''),('fdcd161dd0e72f24e2a838fbc80b66d7','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163938,''),('825c12e299bfd19665d48319589d3da6','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163933,''),('d6bead33bedc53df925bc953c0aa5888','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163933,''),('90e912f4dd57b0a6c1c5eef9acdaa53d','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163933,''),('f0c96d5213c39b561ff5c779be153947','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163932,''),('bace3ea07ba3345a0211062b3c33b52e','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163932,''),('66baf00c17e2015aa7e302d2e1ca5cca','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163932,''),('d1247024840ba3d57adedc1410bbe417','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163932,''),('4b20afbe47ff6b5fc6a172da4ddeddd3','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163932,''),('b6c5c1601685736e49f48dc4c677e3f8','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163932,''),('4b8cb3e300b8184f1923ce26bbcac006','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163932,''),('87bdba821b893bd4c1688c8aa43d2a8b','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163930,''),('b07ec9264e3c9f40656696e0c4a195f2','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163889,''),('4ef252e8d92f42dde368bf32e6002a32','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163889,''),('47c5d17d794730745d2ddaaec074ad44','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163889,''),('178af96ed7029c3da7791c9bbc072372','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163889,''),('291411ed7eea1315aa30748b82245879','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163885,''),('faaea48620aafe8cd9eadfcc62aa8a3a','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163885,''),('e8c7e32f03d392a5361f8c02bac8c8a1','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163885,''),('b9eeec545058c0b7ad296958fb2dc416','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163885,''),('3912aa7858f90f819af3915a6f8b6c34','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163885,''),('60ad6d79127038ab0e6c1c5a76712d87','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163885,''),('8c4ad4410f963840f5dae9ef52a28166','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163885,''),('f9236614e1c63992df6a781265c2666b','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163884,''),('36e4b371fa01149db52ec0b98865e23b','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163884,''),('6a6f70a0676c258b7145adef083ff216','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163884,''),('c862a952a687e56ca6b367017af70d85','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163883,''),('6751b296f621e52ee7c7d97fc13f17c2','69.171.247.113','facebookexternalhit/1.1 (+http://www.facebook.com/',1357163766,''),('ef4a4f39cd64cc47024848cf3821787b','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163742,''),('857a40c32d6a28411e29e19ed5df9b2c','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163742,''),('7fe60f7d869fdd96d6fc0e34394c5092','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163742,''),('8a5991780983b60a1ac49aaa188926b1','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163742,''),('8f0fbceedc8dfb373f835292d1bcfb63','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163742,''),('86bf220486ed42b32120e70d48947e53','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163742,''),('c60d1c6ff37c7ae643045f210b36080f','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163742,''),('ac7ff639b7227e750c9fd0d82bfab138','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163741,''),('9622cfeb5277c931c724c6c60f216ca5','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163741,''),('3e9b095a91ada6da7b95a3eb8237c301','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163741,''),('b97e977601fddd20b192392c06d9ded6','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163740,''),('87474db40e521bfb6fb3171caccfd429','65.52.0.210','Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',1357163725,''),('17d539ea813bfa6df18b111dc1fac041','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163717,''),('d0e3e40f15bd4a512309751d629ef034','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163717,''),('28c66ed20516438235932ddb497e212d','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163717,''),('6ae1f5065babd53e2ca1b8d37e352cac','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163717,''),('1f857cef5116619b4586d9a2515f1e97','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163708,''),('c3d43004c0d980d3f0e72e58176e9ea3','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163708,''),('b98ab21bd178d11d2fb023bc5bcd6e1b','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163708,''),('ae32a2413f54bb71c3ec7ce4b64300c0','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163707,''),('a726b796c11c46a3943d8ecebf2bd830','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163707,''),('ec41c59318b6efee607237be7ededbf8','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163707,''),('4fd97667646aa3991a27262296b43602','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163707,''),('379440d4cf4b19dd812ecfde9262a9bd','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163707,''),('b2c2e0d99ab8126fbb77d01136f6226f','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163707,''),('c75d03973f985d6e01214247b890ac51','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163707,''),('7f47439bc4a17bb2602381742d9cd3f4','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163705,''),('9d7d997a459a9fe44d085e1e375de616','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163611,''),('bf7bfc9077ca8bc0f08c54e71ca2a4bd','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163611,''),('17ea07ad9173ace053a2b8c9e95f2569','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163611,''),('c0f613ffe730a836ea6e3b2d1f8bf8dd','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163610,''),('9565c09863613de5499dab304f1ebd22','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163610,''),('b138418a0cf39fa79170ee7eacdbe1d0','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163610,''),('1c4b82d91e9ef5ebba073477c04362d7','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163610,''),('63848365f84d4634d7d764688322f39e','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163609,''),('cbfceb27b7f52b26741e5d797762c182','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163609,''),('26ce2a531d82e58ad1790fdd46ee8689','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163609,''),('63726f0c1223c0cf50bc2aef7dda02b4','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357163608,''),('ed4df11ab006205318e722cef9069826','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160292,''),('8a52428ed2adbdaf285f786b8332b800','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160292,''),('8214917463c26d4a4123870bd64312a8','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160292,''),('c9516d0ae2ef9a48a6a649417ae0e0ef','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160292,''),('f54a35b1974a67df64f44a2e965593d4','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160292,''),('1d904e956b371c805efc4594a5c4000a','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160292,''),('2794735521d68e954fa5c35c48435ee0','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160292,''),('7593ae96aed4818336fbe84a6092ac5a','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160291,''),('5499078b73d43c4fd2dff7e677ebc7b6','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160291,''),('0eaeb0ba0e967df68b676ec31bb78171','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160291,''),('413b652ef7087fe493c24dd214aedcd1','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357160290,''),('dc92258a4d84801795a0a2b5b39e03a9','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164924,''),('482e31b0ae725594b07cc9f83f85f943','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164924,''),('4ca27a420ee0264bd7c7e6537550245c','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164924,''),('88acbfb7db17f7215a1c45c602394a49','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164922,''),('4d58e071866bed8240d0a1199be4b233','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164922,''),('acbc9e1f70675d3398b310558386784f','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164922,''),('5477d2015987c20d7c5c7659c9366f8d','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164922,''),('67498386c557365834b639b77f408f2e','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164922,''),('baf112baf6461be6ff5f02a79da0cde2','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164922,''),('d896c55cae86824e7aa649c931b5a19a','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164922,''),('3126f312f8f38c71df8ccbf198b6cf72','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164920,''),('f36f69cc374aa7834d0646734d359da7','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164858,''),('a006bc956e9a6209422b98ac7e841c66','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164858,''),('c52f1c3ef7d3530c0fde9ca14b2f6699','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164858,''),('c0c2461db1ccfc8e36e87821d1ed2801','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164858,''),('6de37f6188e9cd8dc4247a6282f3644a','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164719,''),('6ef6e5efdeae5986e98b6252a6f756d1','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164719,''),('54ff69ba7290f1da51bd3bfedd271d89','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164716,''),('4102e86b25f1a565db08402b72669bc8','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164719,''),('7b6df3c0ffd8f958bf52b65809136a74','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164716,''),('a086d63c27b6a5328041c300063c7ad6','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164716,''),('d77391318c667af2b935a5a299ef7ac0','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164716,''),('c982d1adf0735bc406c3b1bc1ce25403','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164715,''),('97439f706e40d16a7f8b2d5462320154','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164715,''),('586e2af85c0dcce4947f0f7a61b0175a','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164715,''),('f385eafde76cfa144925544ea098f1fc','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164713,''),('2d1382702487fc0de1050eb4870238b1','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164566,''),('a257d0296bd937be9fb0dd157b72a7cb','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164566,''),('0748637cf291fc390830680fc76b01ca','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164566,''),('9f1dfaed298daaf2fe6a7149d3bcdba8','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164566,''),('6cef480d97481304da75d12a318f802f','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164562,''),('8556391a4d2c15dc68c2b6a9e6263c1a','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164562,''),('064b8c7ae31fe6b3342a0587ce912b4b','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164562,''),('15757bf5ec35ec92a0d2b74988474af0','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164561,''),('54dc9aee91216cf153021118645464c9','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164561,''),('2e42fadb6e425bee52ba10379bbcab8a','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164561,''),('1c5eb07605517974f589d066838dd865','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164561,''),('5b5ced4ca59806d74c6e131fdd5b00ba','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164560,''),('0baa95690ffcf2540129dda1dd789a65','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164560,''),('64c73154b701fde7be2025c59da82e9c','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164560,''),('5d69e326e294b0dca92b799ea3705c5c','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164558,''),('1f444c5b2d7fc79a97f4041aea28a69d','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164546,''),('f5f4386ac7caee1680dcc2ec41a66233','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164546,''),('24e6f28242c237d8889409add3823a30','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164546,''),('bd393ca707b02dbffdb135c3939a7a8f','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164545,''),('d54fe75a893916104b8a12474828ce5b','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164545,''),('0cbb6caae1d60e35a5c185ae8cbddc63','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164545,''),('6641a0fad40310505a40f7783c3852ec','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164545,''),('8d29f52b08d5922fef2b17fc602cba31','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164545,''),('3d462317e83b9a0b3bf1aff90fcdfe28','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164545,''),('68c157d44edb8e7f6a4d120948aba489','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164545,''),('294d06952c132f82f2c225747c7471af','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164543,''),('7a5452e86696bd113f37c0a4f88c1970','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164527,''),('13279c2e626bc94cec66e03a0cc09343','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164527,''),('0c92f3992bfcf86d9379e6b4144ed819','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164527,''),('e2452f26724a3763ca4335c82a410788','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164526,''),('fd951262abd4f5b9332b547cadcb8db1','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164526,''),('c612a968d034546cb1ada470f40f5748','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164526,''),('a83a9a3f7dd556a85bba4339eac2ea6f','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164526,''),('8788ec707ce1aa328b8ba1c68a82fd8e','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164526,''),('f1c3acbe2ec1c219eb336ef23392fb4b','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164526,''),('39a9e98d5232e781c1ad327e65f28299','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164526,''),('3e2d5b84205a3bfae6d1168db48f7fd7','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164524,''),('22d8d5f2af869f76fb87704c0eba3d68','173.252.110.116','facebookexternalhit/1.1 (+http://www.facebook.com/',1357164524,''),('2910a3643cf99db1678dc7893e592a96','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164435,''),('60edde8265e35553ae5aaf5908c25fa3','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164435,''),('8e54cc1699805a93bd4d975913d6f792','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164435,''),('d86ddf778cac8c6b86459b7ca18310fa','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164435,''),('f1d2dd9bc853c8236e21ad7b62409677','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164427,''),('7a5f8fc972f3a41dcc30503a291b9616','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164427,''),('db6d3ab555a3867c495564c9bb85b668','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164427,''),('987c3bfb087ef745b1f9b0a1d5fc8596','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164425,''),('109ebed8051081b79f9620f4cff29ee8','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164425,''),('3825c56294f60861a8c05282a004bde6','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164425,''),('c5345286de7958bd51d12e9775ffccde','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164425,''),('aed3a9d4aba52f8fe9b3935fe65a9be2','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164425,''),('e1b8118f87e17d854ccd27123aec2009','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164425,''),('14c896b88203fe2467be29e1364e36ad','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164425,''),('d26e1cf613f26642aef9c2b3965402d8','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164422,''),('2af72129a8aaf14fbd6f22c79badd7f4','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164007,''),('b7b72cd40ccacd8716a76be70e90bf1e','5.12.114.46','Mozilla/5.0 (Windows NT 6.1; WOW64; rv:16.0) Gecko',1357164007,'');
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(32) NOT NULL,
  `status` int(2) unsigned NOT NULL DEFAULT '0',
  `experience` int(11) unsigned NOT NULL DEFAULT '0',
  `points` int(11) unsigned NOT NULL DEFAULT '0',
  `level_id` int(11) unsigned DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `edited` int(11) DEFAULT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `about` text,
  `customize` enum('N','Y') DEFAULT 'N',
  `gender` enum('female','male') DEFAULT NULL,
  `photo` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_level` (`level_id`) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'corryna21','corryna_21@yahoo.com','63tqqvtq',0,0,0,NULL,'2012-11-10 13:10:42',NULL,'Corina','Vasile','Seasoned web and desktop applications developer with 4+ years experience in IT Programming, I am seeking for an entry or medium level position that enables me to demonstrate my ability to develop and maintain web or multi-platform applications.','N','female','https://graph.facebook.com/100000825160835/picture'),(2,'mihu87','m.enescu@ymail.com','50vtkr7e',0,0,0,NULL,'2012-11-10 13:29:53',NULL,'Mihai','Enescu','System Developer ( for web and desktop , enterprise applications ) with over 4+ years of experience.','N','male','https://graph.facebook.com/100000766901491/picture'),(3,'joshdeford','joshdeford@gmail.com','tisxe0lb',0,0,0,NULL,'2012-11-14 22:00:10',NULL,'Joshua','DeFord','Recently transplanted to Park City, UT.  Best powder around and endless summer fun!','N','male','https://graph.facebook.com/500169619/picture'),(4,'banister','jimbanister@gmail.com','otdbb3am',0,0,0,NULL,'2012-11-16 18:46:47',NULL,'Jim','Banister','Jim Banister is Co-Founder and Chief Development Officer for SaySo (http://say.so), a revolutionary market research company currently in stealth mode.  Jim also serves as the Head of Product Development for MicroNeeds (http://microneeds.com), working with a group of incredible people doing incredible social good by matching solutions with needs around the world. \n\nJim continues also does project work as Creative Director for Matriculate, an appification and gamification studio in Park City, Utah; and he was former CEO of SpectrumDNA, also based in Park City, Utah, a studio developing web and wireless apps including the SXSW-award winning wordplay engine, The Addictionary.\n\nJim is the author of “Word of Mouse: The New Age of Networked Media” (Agate Fine Print, August 2004).  The common thread of Jim’s career is in engaging audiences through a mix of content and technology, and generating revenue doing it.\n\nOver his career, he created and managed TRW’s Engineering Visualization Center; produced award-winning television and film programming; designed and built the multi-media and post-production system for Steven Spielberg’s “Survivors of the Shoah Visual History Project” and created the XQuest television/cross-media franchise.  Jim also spent five years at Warner Bros. Online, where he was a prime-mover in the company’s digital media strategy and programming development, first as VP Production & Technology, and ultimately as Chief Development Officer.\n\nJim embraces and perpetuates a life-long pedagogical bent, having designed and offered courses on the nature of narrative, social media, gamification and entrepreneurship for institutions of higher learning like The Wharton Graduate School of Business, UCLA Anderson, The Academy of Art University and others.  He has also workshopped on similar subjects for major commercial enterprises, including American Express, BBC Worldwide, Allen & Co., and the William Morris Agency.','N','male','https://graph.facebook.com/626191349/picture'),(5,'vikilaboy','victor@niculae.net','pbn78xiq',0,0,0,NULL,'2012-12-30 02:09:09',NULL,'El','Niño',NULL,'N','male','https://graph.facebook.com/1087364658/picture');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-01-03  8:43:43
