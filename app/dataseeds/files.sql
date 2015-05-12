CREATE DATABASE  IF NOT EXISTS `owntribe` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `owntribe`;
-- MySQL dump 10.13  Distrib 5.6.11, for osx10.6 (i386)
--
-- Host: localhost    Database: owntribe
-- ------------------------------------------------------
-- Server version	5.5.38

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
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `size` int(11) NOT NULL,
  `mimetype` varchar(20) NOT NULL,
  `userid` int(11) NOT NULL,
  `valid` int(1) DEFAULT '0',
  `hash` varchar(40) DEFAULT NULL,
  `share` tinyint(1) NOT NULL DEFAULT '0',
  `time` timestamp NULL DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (1,'cedd.tar',183336960,'application/x-tar',3,0,NULL,0,NULL,NULL),(2,'chat-screen3.png',116367,'image/png',3,0,NULL,0,NULL,'2015-04-30 21:39:45'),(3,'Dad E P at Turners.jpg',1728600,'image/jpeg',3,0,NULL,0,NULL,'2015-04-30 21:41:50'),(4,'Dad E P at Turners.jpg',1728600,'image/jpeg',3,0,NULL,0,NULL,'2015-04-30 21:42:05'),(5,'contrat confidentialite.pdf',2353593,'application/pdf',3,0,NULL,0,NULL,'2015-04-30 21:43:18'),(6,'FT_BG - 2013 3 - August Release_Update_72413 review Paul.pptx',2706273,'application/vnd.open',3,0,NULL,0,NULL,'2015-04-30 21:49:54'),(7,'Ciel Gestion 18.5.exe',92154514,'application/x-msdown',3,0,NULL,0,NULL,'2015-04-30 21:50:47'),(8,'cleverbridge.pdf',29446,'application/pdf',3,0,NULL,0,NULL,'2015-05-02 20:27:25'),(9,'cleverbridge.pdf',29446,'application/pdf',3,0,NULL,0,NULL,'2015-05-02 20:32:25'),(10,'THANKSGIVING 2009 (6).jpg',217243,'image/jpeg',3,0,NULL,0,NULL,'2015-05-02 20:33:54'),(11,'Numériser 1.jpeg',582808,'image/jpeg',3,0,NULL,0,NULL,'2015-05-05 13:06:16'),(12,'Numériser 6 3.pdf',296143,'application/pdf',3,0,NULL,0,NULL,'2015-05-05 13:06:50'),(13,'Numériser 2.jpeg',1954435,'image/jpeg',3,0,NULL,0,NULL,'2015-05-05 13:08:04'),(14,'Golden Mountains.AAF',196096,'application/octet-st',3,0,NULL,0,NULL,'2015-05-05 13:08:35');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-05-05 17:56:57
