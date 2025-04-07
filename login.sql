-- phpMyAdmin SQL Dump
-- Host: localhost
-- Generation Time: Apr 04, 2025 at 10:00 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.0

SET time_zone = "+05:45";

-- Drop the database if it exists and create a new one
DROP DATABASE IF EXISTS `canteen_app`;
CREATE DATABASE `canteen_app`;
USE `canteen_app`;

-- Table structure for table `user_detail`
CREATE TABLE `user_detail` (
    `user_id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `mobile` VARCHAR(20) NOT NULL,
    `address` VARCHAR(500) NOT NULL,
    `image` VARCHAR(100) NOT NULL DEFAULT '',
    `device_type` VARCHAR(10) NOT NULL DEFAULT 'I' COMMENT 'I = iOS, A = Android, W = Web',
    `push_token` VARCHAR(100) NOT NULL DEFAULT '',
    `auth_token` VARCHAR(255) DEFAULT NULL,
    `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `update_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `reset_code` VARCHAR(10) DEFAULT NULL,
    `status` INT(1) NOT NULL DEFAULT '1' COMMENT '1 = active, 2 = deleted',
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `user_detail` (
    `name`, `email`, `password`, `mobile`, `address`, `image`, 
    `device_type`, `push_token`, `auth_token`, `reset_code`, 
    `status`
) VALUES (
    'John Doe', 
    'john.doe@example.com', 
    'password123', 
    '1234567890', 
    '123 Main St, City, Country', 
    'user/john_doe.jpg', 
    'A', 
    'push_token_123', 
    'auth_abc123xyz', 
    '987654', 
    1
);

COMMIT;
