/*
Navicat MySQL Data Transfer

Source Server         : Localhost
Source Server Version : 100414
Source Host           : localhost:3306
Source Database       : ftu

Target Server Type    : MYSQL
Target Server Version : 100414
File Encoding         : 65001

Date: 2020-10-29 01:50:38
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `admin_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` tinyint(1) DEFAULT 1 COMMENT '0: admin, 1: employee',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('1', 'admin', 'manager', 'testadmin@email.com', '$2a$10$oLZX5Bqf.rrErK6JEk083Oj6kmm/rHxiip9Hs7.8xAJxs867Sj3ZW', '0');
INSERT INTO `admin` VALUES ('4', 'Rodrigo', 'K', 'rodrigo@gmail.com', '$2a$10$kFKUx1WW4pL1wXEvyieCleDkEKNYQcpeH2G69h7dpCB5ce4X1UjSS', '1');
INSERT INTO `admin` VALUES ('5', 'Chase', 'Chase', 'chase@gmail.com', '$2a$10$qExYdvR4d7YVdaqMP7LAPuGMRaBLBdSsBjTabMPtj/uGV2cqgroLO', '1');
INSERT INTO `admin` VALUES ('6', 'employee1', 'test', 'employee1@email.com', '$2a$10$HKMp2QhlWl0exr/9ImkA8eiHdnMCa9fcAIHZWTYU2w5rNo.fbuK/q', '1');

-- ----------------------------
-- Table structure for customer
-- ----------------------------
DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `cust_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cust_fn` varchar(50) DEFAULT NULL COMMENT 'customer first name',
  `cust_ln` varchar(50) DEFAULT NULL COMMENT 'customer last name',
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`cust_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of customer
-- ----------------------------
INSERT INTO `customer` VALUES ('2', 'Daniel', 'Ovieda', 'danieldev51@gmail.com', '12345678');
INSERT INTO `customer` VALUES ('3', 'Harry', 'Kane', 'harry@gmail.com', '234234');

-- ----------------------------
-- Table structure for customer_address
-- ----------------------------
DROP TABLE IF EXISTS `customer_address`;
CREATE TABLE `customer_address` (
  `address_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `address_1` varchar(255) DEFAULT NULL,
  `address_2` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `cust_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `fk_cust_addr` (`cust_id`),
  CONSTRAINT `fk_cust_addr` FOREIGN KEY (`cust_id`) REFERENCES `customer` (`cust_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of customer_address
-- ----------------------------
INSERT INTO `customer_address` VALUES ('8', '8 ste', 'a', 'Dover', '123456', 'Delware', '2');
INSERT INTO `customer_address` VALUES ('9', 'sec addr1', 'sec addr2', 'sec city', '22222', 'sec state', '2');
INSERT INTO `customer_address` VALUES ('10', '', '', '', '', '', '3');

-- ----------------------------
-- Table structure for repair
-- ----------------------------
DROP TABLE IF EXISTS `repair`;
CREATE TABLE `repair` (
  `repair_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cust_id` int(11) unsigned DEFAULT NULL,
  `staff_id` int(11) unsigned DEFAULT NULL,
  `service_id` int(11) unsigned DEFAULT NULL,
  `store_id` int(11) unsigned DEFAULT NULL,
  `make` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `repair_comments` varchar(255) DEFAULT NULL,
  `status_id` int(11) unsigned DEFAULT NULL,
  `date_in` datetime DEFAULT NULL,
  `date_out` datetime DEFAULT NULL,
  PRIMARY KEY (`repair_id`),
  KEY `fk_cust_id` (`cust_id`),
  KEY `fk_staff_id` (`staff_id`),
  KEY `fk_service_id` (`service_id`),
  KEY `fk_store_id` (`store_id`),
  KEY `fk_repair_status` (`status_id`),
  CONSTRAINT `fk_cust_id` FOREIGN KEY (`cust_id`) REFERENCES `customer` (`cust_id`),
  CONSTRAINT `fk_repair_status` FOREIGN KEY (`status_id`) REFERENCES `repair_status` (`status_id`),
  CONSTRAINT `fk_service_id` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`),
  CONSTRAINT `fk_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`),
  CONSTRAINT `fk_store_id` FOREIGN KEY (`store_id`) REFERENCES `store_location` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of repair
-- ----------------------------
INSERT INTO `repair` VALUES ('1', '2', '1', '1', '1', 'make1', 'model1', 'test comment', '2', '2020-10-29 00:00:00', null);

-- ----------------------------
-- Table structure for repair_status
-- ----------------------------
DROP TABLE IF EXISTS `repair_status`;
CREATE TABLE `repair_status` (
  `status_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) DEFAULT NULL,
  `status_desc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of repair_status
-- ----------------------------
INSERT INTO `repair_status` VALUES ('1', 'Completed', 'This is the complete status');
INSERT INTO `repair_status` VALUES ('2', 'Pending', 'This is the pending status');

-- ----------------------------
-- Table structure for service
-- ----------------------------
DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
  `service_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `service_name` varchar(50) DEFAULT NULL,
  `service_desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of service
-- ----------------------------
INSERT INTO `service` VALUES ('1', 'Service1', 'This is the test service');

-- ----------------------------
-- Table structure for staff
-- ----------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `staff_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `staff_fn` varchar(50) DEFAULT NULL COMMENT 'staff first name',
  `staff_ln` varchar(50) DEFAULT NULL COMMENT 'staff last name',
  `staff_email` varchar(255) DEFAULT NULL,
  `staff_status_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`staff_id`),
  KEY `staff_status_id` (`staff_status_id`),
  CONSTRAINT `fk_staff_status` FOREIGN KEY (`staff_status_id`) REFERENCES `staff_status` (`staff_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of staff
-- ----------------------------
INSERT INTO `staff` VALUES ('1', 'John', 'Doe', 'john@gmail.com', '1');
INSERT INTO `staff` VALUES ('2', 'Michael', 'Gross', 'michael@gmail.com', '1');

-- ----------------------------
-- Table structure for staff_status
-- ----------------------------
DROP TABLE IF EXISTS `staff_status`;
CREATE TABLE `staff_status` (
  `staff_status_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `staff_status_name` varchar(50) DEFAULT NULL,
  `staff_status_desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`staff_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of staff_status
-- ----------------------------
INSERT INTO `staff_status` VALUES ('1', 'Active', 'This is the active status');
INSERT INTO `staff_status` VALUES ('2', 'Inactive', 'This is the inactive status');

-- ----------------------------
-- Table structure for store_location
-- ----------------------------
DROP TABLE IF EXISTS `store_location`;
CREATE TABLE `store_location` (
  `store_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `store_location` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of store_location
-- ----------------------------
INSERT INTO `store_location` VALUES ('1', 'test store location1');
SET FOREIGN_KEY_CHECKS=1;
