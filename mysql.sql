-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hospital_project
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `admissions`
--

DROP TABLE IF EXISTS `admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admissions` (
  `an` varchar(20) NOT NULL,
  `hn` varchar(20) NOT NULL,
  `admit_date` date DEFAULT NULL,
  `room_no` varchar(10) DEFAULT NULL,
  `bed_no` varchar(10) DEFAULT NULL,
  `main_doctor` varchar(100) DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  `latest_vitals` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'admitted',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`an`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admissions`
--

LOCK TABLES `admissions` WRITE;
/*!40000 ALTER TABLE `admissions` DISABLE KEYS */;
INSERT INTO `admissions` VALUES ('','HN999','2026-02-05','901','1',NULL,NULL,NULL,'admitted','2026-02-05 15:19:10'),('AN1770200272','664821','2000-11-01','101','1','นพ.สมชาย ใจดี','','BW: 70.00 kg, HT: 180.00 cm','admitted','2026-02-04 10:17:52'),('AN1770259195','HN004','2000-11-01','101','1','นพ.สมชาย ใจดี','บลาๆๆๆๆๆๆๆๆๆๆๆๆๆๆๆๆๆๆๆๆ',NULL,'admitted','2026-02-05 02:39:55'),('AN1770305288','12209','2026-02-05','101','2','พญ.มีนา น่ารัก','awdadawdawdadaawd',NULL,'admitted','2026-02-05 15:28:08'),('AN1770373070','HN002','2026-02-06','101','1','พญ.มีนา น่ารัก','กฟกไกฟไกฟไกฟกฟไกฟไ',NULL,'admitted','2026-02-06 10:17:50'),('AN1770375969','HN888','2026-02-06','Wait','0','พญ. สวยใส ใจดี','-',NULL,'admitted','2026-02-06 11:06:09'),('AN1770438325','HN3424322','2026-02-07','Wait','0','พญ. สวยใส ใจดี','-',NULL,'admitted','2026-02-07 04:25:25'),('AN1770707415','HN0043424','2026-02-10','Wait','0','นพ.สมชาย ใจดี','dwadawdawdaw',NULL,'admitted','2026-02-10 07:10:15'),('AN1770708262','HN004121','2026-02-10','Wait','0','นพ.สมชาย ใจดี','',NULL,'admitted','2026-02-10 07:24:22'),('AN1770782867','HN004121','2026-02-09','Wait','0','นพ.สมชาย ใจดี','',NULL,'admitted','2026-02-11 04:07:47'),('AN67001','HN999','2026-02-05','901','1','นพ.ใจดี รักษาเก่ง',NULL,NULL,'admitted','2026-02-05 15:22:32');
/*!40000 ALTER TABLE `admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diet_orders`
--

DROP TABLE IF EXISTS `diet_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diet_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_date` date NOT NULL,
  `hn` varchar(20) NOT NULL,
  `patient_name` varchar(100) DEFAULT NULL,
  `ward` varchar(50) DEFAULT NULL,
  `bed` varchar(10) DEFAULT NULL,
  `food_type` varchar(50) DEFAULT NULL,
  `menu_item` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `supplement` varchar(50) DEFAULT NULL,
  `supplement_qty` int(11) DEFAULT 0,
  `calories` varchar(20) DEFAULT NULL,
  `disease_specific` varchar(50) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `additional_notes` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diet_orders`
--

LOCK TABLES `diet_orders` WRITE;
/*!40000 ALTER TABLE `diet_orders` DISABLE KEYS */;
INSERT INTO `diet_orders` VALUES (1,'2026-02-05','HN004','',NULL,'','normal',NULL,1,'none',1,'','none','','','pending','2026-02-05 14:57:12'),(2,'2026-02-05','HN004','สมจิต ใจถึง','101','1','Liquid','ข้าวต้มหมู + ไข่ลวก',2,'Ensure',1,'1500','DM','','','pending','2026-02-05 15:08:21'),(3,'2026-02-05','HN999','ทดสอบ ระบบ','901','1','Liquid','ข้าวผัดอเมริกัน',1,'Glucerna',1,'1230','HT','wdadjopawdjaopwdjopawjdopawd','awdnawdjipoawdpioawdopjawdopaw','pending','2026-02-05 15:24:35'),(4,'0000-00-00','HN999','ทดสอบ ระบบ','901','1','Normal','แกงจืดเต้าหู้หมูสับ + ข้าวสวย',1,'Glucerna',4,'1500','CKD','','','pending','2026-02-10 20:22:29');
/*!40000 ALTER TABLE `diet_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_orders`
--

DROP TABLE IF EXISTS `doctor_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hn` varchar(20) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  `qty` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_orders`
--

LOCK TABLES `doctor_orders` WRITE;
/*!40000 ALTER TABLE `doctor_orders` DISABLE KEYS */;
INSERT INTO `doctor_orders` VALUES (2,'HN004','2026-02-06','14:10:00','Continue','SoonaSona','พักผ่อน กินยา 500 g','2 tab','Pending'),(3,'HN004','2026-02-06','14:16:00','Investigation','SoonaSona','awdawdawdawd','dawdawdaw','Pending'),(4,'12209','2026-02-06','17:18:00','One Day','SoonaSona','พักผ่อน กินยา 500 g','2 tab','Pending');
/*!40000 ALTER TABLE `doctor_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_menus`
--

DROP TABLE IF EXISTS `food_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_menus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_menus`
--

LOCK TABLES `food_menus` WRITE;
/*!40000 ALTER TABLE `food_menus` DISABLE KEYS */;
INSERT INTO `food_menus` VALUES (1,'ข้าวต้มหมู + ไข่ลวก',NULL,'soft'),(2,'ข้าวผัดอเมริกัน',NULL,'normal'),(3,'แกงจืดเต้าหู้หมูสับ + ข้าวสวย',NULL,'normal'),(4,'ก๋วยเตี๋ยวไก่ตุ๋น',NULL,'normal'),(5,'ข้าวต้มปลา',NULL,'soft');
/*!40000 ALTER TABLE `food_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_results`
--

DROP TABLE IF EXISTS `lab_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hn` varchar(20) DEFAULT NULL,
  `lab_name` varchar(50) DEFAULT NULL,
  `test_name` varchar(50) DEFAULT NULL,
  `result_value` varchar(20) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `flag` varchar(10) DEFAULT NULL,
  `report_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_results`
--

LOCK TABLES `lab_results` WRITE;
/*!40000 ALTER TABLE `lab_results` DISABLE KEYS */;
INSERT INTO `lab_results` VALUES (1,'1234','CBC','Hemoglobin','11.5','g/dL','L','2026-02-05 23:50:42'),(2,'1234','CBC','WBC','12000','cells','H','2026-02-05 23:50:42');
/*!40000 ALTER TABLE `lab_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `med_orders`
--

DROP TABLE IF EXISTS `med_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `med_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_no` varchar(20) NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `type` varchar(10) DEFAULT NULL COMMENT 'IRx, TRx, EMx, ATO',
  `hn` varchar(20) DEFAULT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `recorder_name` varchar(100) DEFAULT NULL,
  `med_list` text DEFAULT NULL COMMENT 'รายการยา',
  `qty` int(11) DEFAULT 1,
  `total_price` decimal(10,2) DEFAULT 0.00,
  `status` varchar(20) DEFAULT 'รอจัดยา',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `med_orders`
--

LOCK TABLES `med_orders` WRITE;
/*!40000 ALTER TABLE `med_orders` DISABLE KEYS */;
INSERT INTO `med_orders` VALUES (4,'RX-20260205-4510','2026-02-05 23:53:33','TRx','HN004','นายสมพง','SoonaSona','ฟไกฟกฟกฟกาสไกยวฟไ่ก',1,213.00,'รอจัดยา','2026-02-05 16:53:33'),(5,'RX-20260206-8819','2026-02-06 17:17:00','TRx','12209','นายสพล เเสงสว่าง','SoonaSona','ฟกฟกฟไกกฟไกฟไกฟไก',1,0.00,'รอจัดยา','2026-02-06 10:17:00');
/*!40000 ALTER TABLE `med_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nurse_notes`
--

DROP TABLE IF EXISTS `nurse_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nurse_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hn` varchar(20) DEFAULT NULL,
  `note_time` varchar(10) DEFAULT NULL,
  `focus` varchar(50) DEFAULT NULL,
  `note_text` text DEFAULT NULL,
  `recorder` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nurse_notes`
--

LOCK TABLES `nurse_notes` WRITE;
/*!40000 ALTER TABLE `nurse_notes` DISABLE KEYS */;
INSERT INTO `nurse_notes` VALUES (1,'1234','08:00','Routine','ผู้ป่วยรู้สึกตัวดี พักผ่อนได้','Nurse Joy','2026-02-05 16:50:42'),(2,'1234','12:00','Pain','บ่นปวดแผล ให้ยาแก้ปวดแล้ว','Nurse Joy','2026-02-05 16:50:42'),(3,'664821','00:12','ปวดหัว ตัวร้อน','ไข้','SoonaSona','2026-02-05 17:13:10'),(4,'HN004','14:19','ปวดหัว ตัวร้อน','dwadawdawdwadawd','SoonaSona','2026-02-06 07:19:37');
/*!40000 ALTER TABLE `nurse_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `hn` varchar(20) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Patient',
  `bed` varchar(20) DEFAULT NULL,
  `an` varchar(20) DEFAULT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `admit_date` datetime DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`hn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES ('12209','นานาจิตตัง','สุขา',NULL,111,NULL,NULL,50.00,160.00,'Patient',NULL,NULL,NULL,NULL,NULL),('664821','ณัฐนันท์','หวังดี',NULL,20,NULL,NULL,70.00,180.00,'Patient',NULL,NULL,NULL,NULL,NULL),('HN001','สมชาย','ใจดี',NULL,45,'ชาย',NULL,NULL,NULL,'Patient',NULL,NULL,NULL,NULL,NULL),('HN002','สมหญิง','รักเรียน',NULL,32,'หญิง',NULL,NULL,NULL,'Patient',NULL,NULL,NULL,NULL,NULL),('HN004','สมจิต','ใจถึง',NULL,48,NULL,NULL,46.00,156.00,'Patient',NULL,NULL,NULL,NULL,NULL),('HN004121','dwopajdopawjddd','dawdadwad',NULL,13,NULL,NULL,999.99,999.99,'Patient',NULL,NULL,NULL,NULL,NULL),('HN0043424','dwopajdopawjdd','wadawdawd',NULL,5,NULL,NULL,130.00,999.99,'Patient',NULL,NULL,NULL,NULL,NULL),('HN1220999a','Nuttanan','Wangdee1',NULL,NULL,NULL,'9237029901',NULL,NULL,'Pre-Admit',NULL,NULL,NULL,NULL,NULL),('HN1220999aa','Nuttanan','Wangdee',NULL,20,NULL,'0991086225',NULL,NULL,'Pre-Admit',NULL,NULL,NULL,NULL,NULL),('HN999','ทดสอบ','ระบบ','1990-01-01',34,'ชาย','0812345678',NULL,NULL,'Admitted','Wait','AN1770440317','นพ. สมชาย ใจดี','2026-02-07 11:58:37',NULL);
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preadmissions`
--

DROP TABLE IF EXISTS `preadmissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preadmissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hn` varchar(20) NOT NULL,
  `admit_date` date NOT NULL,
  `patient_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `diagnosis` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preadmissions`
--

LOCK TABLES `preadmissions` WRITE;
/*!40000 ALTER TABLE `preadmissions` DISABLE KEYS */;
INSERT INTO `preadmissions` VALUES (9,'HN1220999aa','2026-02-10','Nuttanan Wangdee','0991086225','พญ.มีนา น่ารัก','','2026-02-10 08:08:06',20,NULL,NULL);
/*!40000 ALTER TABLE `preadmissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES ('034','ห้องตรวจโรค 1 (OPD 1)','1111'),('035','ห้องตรวจโรค 2 (OPD 2)','2222'),('036','ห้องกายภาพบำบัด','3333'),('037','ห้องอายุรกรรม 1 (IPD)','4444');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `role` enum('admin','doctor','nurse','staff') DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','1234','Admin System','admin','2026-02-04 07:20:43'),(2,'doctor','1234','นพ. สมชาย ใจดี','doctor','2026-02-04 07:20:43'),(3,'nurse','1234','พยาบาล จอย','nurse','2026-02-04 07:20:43'),(4,'SoonaSona','12209','ณัฐนันท์ หวังดี','admin','2026-02-05 14:55:25'),(5,'SoonaSona2','12209','Nuttanan Wangdee','doctor','2026-02-06 10:15:42'),(6,'john','12345','wdadadawdaw','doctor','2026-02-10 07:06:33'),(8,'wadwadwa','12345','Admin System','admin','2026-02-11 10:01:28');
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

-- Dump completed on 2026-02-11 17:08:33
