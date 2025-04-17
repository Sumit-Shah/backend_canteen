-- Add category_detail table
CREATE TABLE IF NOT EXISTS `category_detail` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `update_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add menu_item_detail table
CREATE TABLE IF NOT EXISTS `menu_item_detail` (
  `menu_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `is_portion_allow` tinyint(1) DEFAULT 0,
  `is_custom_ingredient_allow` tinyint(1) DEFAULT 0,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `update_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted',
  PRIMARY KEY (`menu_item_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `menu_item_detail_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category_detail` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add portion_detail table
CREATE TABLE IF NOT EXISTS `portion_detail` (
  `portion_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_item_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `addition_price` decimal(10,2) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `update_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted',
  PRIMARY KEY (`portion_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `portion_detail_ibfk_1` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_item_detail` (`menu_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add ingredient_detail table
CREATE TABLE IF NOT EXISTS `ingredient_detail` (
  `ingredient_id` int(11) NOT NULL AUTO_INCREMENT,
  `menu_item_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `addition_price` decimal(10,2) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `update_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = deleted',
  PRIMARY KEY (`ingredient_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `ingredient_detail_ibfk_1` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_item_detail` (`menu_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

