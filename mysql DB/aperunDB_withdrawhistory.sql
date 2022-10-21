-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 134.122.126.126    Database: aperunDB
-- ------------------------------------------------------
-- Server version	5.7.39-0ubuntu0.18.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `withdrawhistory`
--

DROP TABLE IF EXISTS `withdrawhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawhistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `walletaddress` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawhistory`
--

LOCK TABLES `withdrawhistory` WRITE;
/*!40000 ALTER TABLE `withdrawhistory` DISABLE KEYS */;
INSERT INTO `withdrawhistory` VALUES (1,2,'krunalmayani4@gmail.com','0xBec5000E7351c977fD8cad3c3caD9E7d3DEf8F5f',500,'2022-09-23 08:56:05'),(2,3,'krunalmayani@gmail.com','0xBec5000E7351c977fD8cad3c3caD9E7d3DEf8F5f',500,'2022-10-03 03:21:54'),(3,3,'krunalmayani@gmail.com','0xBec5000E7351c977fD8cad3c3caD9E7d3DEf8F5f',500,'2022-10-03 03:24:04'),(4,3,'krunalmayani@gmail.com','0xBec5000E7351c977fD8cad3c3caD9E7d3DEf8F5f',500,'2022-10-03 03:25:11'),(5,2,'krunalmayani4@gmail.com','0x88beb8cEcAd374FAD2d58d1196d22166D864D6a7',500,'2022-10-03 03:25:26'),(6,2,'krunalmayani4@gmail.com','0x88beb8cEcAd374FAD2d58d1196d22166D864D6a7',500,'2022-10-03 03:40:34'),(7,4,'krunalmayani12344@gmail.com','0xBec5000E7351c977fD8cad3c3caD9E7d3DEf8F5f',50,'2022-10-03 06:54:24'),(8,4,'krunalmayani12344@gmail.com','0xBec5000E7351c977fD8cad3c3caD9E7d3DEf8F5f',50,'2022-10-06 02:34:04');
/*!40000 ALTER TABLE `withdrawhistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-20  9:08:15
