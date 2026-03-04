-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 11, 2026 at 10:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eduswap_fixed`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `Adm_id` int(11) UNSIGNED NOT NULL,
  `Adm_name` varchar(255) NOT NULL,
  `Adm_email` varchar(255) NOT NULL,
  `Adm_password` varchar(255) NOT NULL,
  `Adm_phone` varchar(20) DEFAULT NULL,
  `Adm_created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `Adm_last_login` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ads`
--

CREATE TABLE `ads` (
  `Ads_id` int(11) UNSIGNED NOT NULL,
  `Ads_title` varchar(255) NOT NULL,
  `Ads_description` text DEFAULT NULL,
  `It_id` int(11) UNSIGNED NOT NULL,
  `Us_id` int(11) UNSIGNED NOT NULL,
  `Ads_start_date` datetime NOT NULL DEFAULT current_timestamp(),
  `Ads_end_date` datetime NOT NULL,
  `Ads_status` enum('active','expired','paused') NOT NULL DEFAULT 'active',
  `Ads_impressions` int(11) DEFAULT 0,
  `Ads_clicks` int(11) DEFAULT 0,
  `Ads_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `Cat_id` int(11) UNSIGNED NOT NULL,
  `Cat_name` varchar(100) NOT NULL,
  `Cat_name_en` varchar(100) NOT NULL,
  `Cat_description` text DEFAULT NULL,
  `Cat_icon` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`Cat_id`, `Cat_name`, `Cat_name_en`, `Cat_description`, `Cat_icon`, `is_active`) VALUES
(1, 'كتب دراسية', 'textbooks', 'الكتب الدراسية والمراجع الأكاديمية', NULL, 1),
(2, 'أدوات مكتبية', 'stationery', 'أدوات الكتابة والمكتبية', NULL, 1),
(3, 'أجهزة إلكترونية', 'electronics', 'الأجهزة الإلكترونية التعليمية', NULL, 1),
(4, 'ملابس مدرسية', 'uniforms', 'الملابس والزي المدرسي', NULL, 1),
(5, 'حقائب ومستلزمات', 'bags', 'الحقائب والمستلزمات المدرسية', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `Ch_id` int(11) UNSIGNED NOT NULL,
  `sender_id` int(11) UNSIGNED NOT NULL,
  `receiver_id` int(11) UNSIGNED NOT NULL,
  `Ch_text` text NOT NULL,
  `Ch_read` tinyint(1) NOT NULL DEFAULT 0,
  `Ch_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `Fav_id` int(11) UNSIGNED NOT NULL,
  `Us_id` int(11) UNSIGNED NOT NULL,
  `It_id` int(11) UNSIGNED NOT NULL,
  `Fav_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `It_id` int(11) UNSIGNED NOT NULL,
  `It_name` varchar(255) NOT NULL,
  `Cat_id` int(11) UNSIGNED NOT NULL,
  `It_description` text DEFAULT NULL,
  `It_condition` enum('new','like_new','good','fair','poor') NOT NULL DEFAULT 'good',
  `It_price` decimal(10,2) NOT NULL,
  `It_quantity` int(11) NOT NULL DEFAULT 1,
  `seller_id` int(11) UNSIGNED NOT NULL,
  `It_views` int(11) DEFAULT 0,
  `It_status` enum('available','sold','reserved','deleted') NOT NULL DEFAULT 'available',
  `It_created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `It_updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_images`
--

CREATE TABLE `item_images` (
  `Img_id` int(11) UNSIGNED NOT NULL,
  `It_id` int(11) UNSIGNED NOT NULL,
  `Img_path` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `Img_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `Order_id` int(11) UNSIGNED NOT NULL,
  `buyer_id` int(11) UNSIGNED NOT NULL,
  `seller_id` int(11) UNSIGNED NOT NULL,
  `Order_total` decimal(10,2) NOT NULL,
  `Order_status` enum('pending','confirmed','paid','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `Order_notes` text DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `Order_created_at?` datetime NOT NULL DEFAULT current_timestamp(),
  `Order_updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `OrderItem_id` int(11) UNSIGNED NOT NULL,
  `Order_id` int(11) UNSIGNED NOT NULL,
  `It_id` int(11) UNSIGNED NOT NULL,
  `Item_quantity` int(11) NOT NULL DEFAULT 1,
  `Item_price` decimal(10,2) NOT NULL,
  `Item_subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `order_items`
--
DELIMITER $$
CREATE TRIGGER `calculate_orderitem_subtotal` BEFORE INSERT ON `order_items` FOR EACH ROW BEGIN
    SET NEW.`Item_subtotal` = NEW.`Item_quantity` * NEW.`Item_price`;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `otp_codes`
--

INSERT INTO `otp_codes` (`id`, `email`, `otp_hash`, `expires_at`, `used`, `created_at`) VALUES
(1, 'mohamed12hegazy11@gmail.com', '$2b$10$a8PW.SBuFQvfSplCSkVGO.RxEPbiXOa73cvOGoOOgp80J5Bl9.F.2', '2026-02-11 19:54:23', 1, '2026-02-11 19:44:23');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `Rev_id` int(11) UNSIGNED NOT NULL,
  `reviewer_id` int(11) UNSIGNED NOT NULL,
  `reviewed_user_id` int(11) UNSIGNED NOT NULL,
  `Order_id` int(11) UNSIGNED DEFAULT NULL,
  `It_id` int(11) UNSIGNED DEFAULT NULL,
  `Rev_rating` tinyint(1) NOT NULL CHECK (`Rev_rating` between 1 and 5),
  `Rev_comment` text DEFAULT NULL,
  `Rev_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `reviews`
--
DELIMITER $$
CREATE TRIGGER `update_user_rating_after_review` AFTER INSERT ON `reviews` FOR EACH ROW BEGIN
    UPDATE `users` 
    SET 
        `Us_rating` = (
            SELECT AVG(`Rev_rating`) 
            FROM `reviews` 
            WHERE `reviewed_user_id` = NEW.`reviewed_user_id`
        ),
        `Us_total_reviews` = (
            SELECT COUNT(*) 
            FROM `reviews` 
            WHERE `reviewed_user_id` = NEW.`reviewed_user_id`
        )
    WHERE `Us_id` = NEW.`reviewed_user_id`;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE `types` (
  `Ty_id` int(11) UNSIGNED NOT NULL,
  `Ty_name` varchar(50) NOT NULL,
  `Ty_name_en` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`Ty_id`, `Ty_name`, `Ty_name_en`) VALUES
(1, 'بائع', 'seller'),
(2, 'مشتري', 'buyer'),
(3, 'بائع ومشتري', 'both');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Us_id` int(11) UNSIGNED NOT NULL,
  `Us_name` varchar(255) NOT NULL,
  `Us_email` varchar(255) NOT NULL,
  `Us_password` varchar(255) NOT NULL,
  `Us_phone` varchar(20) DEFAULT NULL,
  `Us_address` text DEFAULT NULL,
  `Us_city` varchar(100) DEFAULT NULL,
  `Us_profile_picture` varchar(255) DEFAULT NULL,
  `Us_rating` decimal(3,2) DEFAULT 0.00,
  `Us_total_reviews` int(11) DEFAULT 0,
  `Ty_id` int(11) UNSIGNED NOT NULL DEFAULT 2,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `Us_created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `Us_updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `Us_last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Us_id`, `Us_name`, `Us_email`, `Us_password`, `Us_phone`, `Us_address`, `Us_city`, `Us_profile_picture`, `Us_rating`, `Us_total_reviews`, `Ty_id`, `is_verified`, `is_active`, `Us_created_at`, `Us_updated_at`, `Us_last_login`) VALUES
(1, 'أحمد محمد', 'ahmed@example.com', '$2b$10$kSu51pvA6WEPp.RlV3c.QepCeHlEk.LvJXYT7IAifW4YwygTswj6u', '01012345678', NULL, 'Cairo', NULL, 0.00, 0, 3, 1, 1, '2026-02-11 17:25:28', NULL, NULL),
(2, 'فاطمة علي', 'fatima@example.com', '$2b$10$kSu51pvA6WEPp.RlV3c.QepCeHlEk.LvJXYT7IAifW4YwygTswj6u', '01098765432', NULL, 'Alexandria', NULL, 0.00, 0, 2, 1, 1, '2026-02-11 17:25:28', NULL, NULL),
(3, 'mohamed mahmoud ali', 'mohamed12hegazy11@gmail.com', '$2b$10$tV3H2hSaVxhOQyRAbKInS.Hzx7gkp47hjwwyGL43zA/5SGkJ4e7JO', '0101511442428', NULL, NULL, NULL, 0.00, 0, 2, 0, 1, '2026-02-11 19:42:16', NULL, NULL),
(4, 'ahmed mahmoud ali', 'ahme123@gmail.com', '$2b$10$.CfzyCJFjfCOK.eOusHHtu2CVzAlxo3U3h2BkEZU32iSaYAQBjwNu', '119228333', NULL, NULL, NULL, 0.00, 0, 2, 0, 1, '2026-02-11 21:23:11', NULL, NULL),
(5, 'mohamed mahmoud uali', 'dkfjddkf@gmai.com', '$2b$10$lPiVHOQbn2Vj98jHnuSD2eGFMDYYHQw23j0/vHY/1Ohw2V9jroqSe', '1222222222', NULL, NULL, NULL, 0.00, 0, 2, 0, 1, '2026-02-11 22:40:04', NULL, NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_active_items`
-- (See below for the actual view)
--
CREATE TABLE `view_active_items` (
`It_id` int(11)
,`It_name` varchar(255)
,`It_description` text
,`It_price` decimal(10,2)
,`It_quantity` int(11)
,`It_condition` enum('new','like_new','good','fair','poor')
,`It_views` int(11)
,`Cat_name` varchar(100)
,`Cat_name_en` varchar(100)
,`seller_id` int(11)
,`seller_name` varchar(255)
,`seller_rating` decimal(3,2)
,`seller_city` varchar(100)
,`primary_image` varchar(255)
,`It_created_at` datetime
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_user_stats`
-- (See below for the actual view)
--
CREATE TABLE `view_user_stats` (
`Us_id` int(11)
,`Us_name` varchar(255)
,`Us_email` varchar(255)
,`Us_rating` decimal(3,2)
,`Us_total_reviews` int(11)
,`total_items` bigint(21)
,`items_sold` bigint(21)
,`total_purchases` bigint(21)
,`Us_created_at` datetime
);

-- --------------------------------------------------------

--
-- Structure for view `view_active_items`
--
DROP TABLE IF EXISTS `view_active_items`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_active_items`  AS SELECT `i`.`It_id` AS `It_id`, `i`.`It_name` AS `It_name`, `i`.`It_description` AS `It_description`, `i`.`It_price` AS `It_price`, `i`.`It_quantity` AS `It_quantity`, `i`.`It_condition` AS `It_condition`, `i`.`It_views` AS `It_views`, `c`.`Cat_name` AS `Cat_name`, `c`.`Cat_name_en` AS `Cat_name_en`, `u`.`Us_id` AS `seller_id`, `u`.`Us_name` AS `seller_name`, `u`.`Us_rating` AS `seller_rating`, `u`.`Us_city` AS `seller_city`, (select `item_images`.`Img_path` from `item_images` where `item_images`.`It_id` = `i`.`It_id` and `item_images`.`is_primary` = 1 limit 1) AS `primary_image`, `i`.`It_created_at` AS `It_created_at` FROM ((`items` `i` join `categories` `c` on(`i`.`Cat_id` = `c`.`Cat_id`)) join `users` `u` on(`i`.`seller_id` = `u`.`Us_id`)) WHERE `i`.`It_status` = 'available' ;

-- --------------------------------------------------------

--
-- Structure for view `view_user_stats`
--
DROP TABLE IF EXISTS `view_user_stats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_user_stats`  AS SELECT `u`.`Us_id` AS `Us_id`, `u`.`Us_name` AS `Us_name`, `u`.`Us_email` AS `Us_email`, `u`.`Us_rating` AS `Us_rating`, `u`.`Us_total_reviews` AS `Us_total_reviews`, count(distinct `i`.`It_id`) AS `total_items`, count(distinct case when `i`.`It_status` = 'sold' then `i`.`It_id` end) AS `items_sold`, count(distinct `o`.`Order_id`) AS `total_purchases`, `u`.`Us_created_at` AS `Us_created_at` FROM ((`users` `u` left join `items` `i` on(`u`.`Us_id` = `i`.`seller_id`)) left join `orders` `o` on(`u`.`Us_id` = `o`.`buyer_id`)) GROUP BY `u`.`Us_id` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`Adm_id`),
  ADD UNIQUE KEY `Adm_email` (`Adm_email`),
  ADD KEY `idx_admin_email` (`Adm_email`);

--
-- Indexes for table `ads`
--
ALTER TABLE `ads`
  ADD PRIMARY KEY (`Ads_id`),
  ADD KEY `fk_ads_items` (`It_id`),
  ADD KEY `fk_ads_users` (`Us_id`),
  ADD KEY `idx_ads_status` (`Ads_status`),
  ADD KEY `idx_ads_dates` (`Ads_start_date`,`Ads_end_date`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`Cat_id`),
  ADD UNIQUE KEY `Cat_name` (`Cat_name`),
  ADD UNIQUE KEY `Cat_name_en` (`Cat_name_en`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`Ch_id`),
  ADD KEY `fk_chats_sender` (`sender_id`),
  ADD KEY `fk_chats_receiver` (`receiver_id`),
  ADD KEY `idx_chat_conversation` (`sender_id`,`receiver_id`),
  ADD KEY `idx_chat_unread` (`receiver_id`,`Ch_read`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`Fav_id`),
  ADD UNIQUE KEY `unique_favorite` (`Us_id`,`It_id`),
  ADD KEY `fk_favorites_users` (`Us_id`),
  ADD KEY `fk_favorites_items` (`It_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`It_id`),
  ADD KEY `fk_items_categories` (`Cat_id`),
  ADD KEY `fk_items_seller` (`seller_id`),
  ADD KEY `idx_item_status` (`It_status`),
  ADD KEY `idx_item_price` (`It_price`),
  ADD KEY `idx_item_category` (`Cat_id`);

--
-- Indexes for table `item_images`
--
ALTER TABLE `item_images`
  ADD PRIMARY KEY (`Img_id`),
  ADD KEY `fk_images_items` (`It_id`),
  ADD KEY `idx_primary_image` (`It_id`,`is_primary`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`Order_id`),
  ADD KEY `fk_orders_buyer` (`buyer_id`),
  ADD KEY `fk_orders_seller` (`seller_id`),
  ADD KEY `idx_order_status` (`Order_status`),
  ADD KEY `idx_order_date` (`Order_created_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`OrderItem_id`),
  ADD KEY `fk_orderitems_order` (`Order_id`),
  ADD KEY `fk_orderitems_item` (`It_id`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otp_email` (`email`),
  ADD KEY `idx_otp_expires` (`expires_at`),
  ADD KEY `idx_otp_used` (`used`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`Rev_id`),
  ADD KEY `fk_reviews_reviewer` (`reviewer_id`),
  ADD KEY `fk_reviews_reviewed` (`reviewed_user_id`),
  ADD KEY `fk_reviews_order` (`Order_id`),
  ADD KEY `fk_reviews_item` (`It_id`),
  ADD KEY `idx_review_rating` (`Rev_rating`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`Ty_id`),
  ADD UNIQUE KEY `Ty_name` (`Ty_name`),
  ADD UNIQUE KEY `Ty_name_en` (`Ty_name_en`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Us_id`),
  ADD UNIQUE KEY `Us_email` (`Us_email`),
  ADD KEY `fk_users_types` (`Ty_id`),
  ADD KEY `idx_user_email` (`Us_email`),
  ADD KEY `idx_user_city` (`Us_city`),
  ADD KEY `idx_user_rating` (`Us_rating`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `Adm_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ads`
--
ALTER TABLE `ads`
  MODIFY `Ads_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `Cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `Ch_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `Fav_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `It_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_images`
--
ALTER TABLE `item_images`
  MODIFY `Img_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `Order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `OrderItem_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `Rev_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `Ty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Us_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ads`
--
ALTER TABLE `ads`
  ADD CONSTRAINT `fk_ads_items` FOREIGN KEY (`It_id`) REFERENCES `items` (`It_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ads_users` FOREIGN KEY (`Us_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `fk_chats_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chats_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `fk_favorites_items` FOREIGN KEY (`It_id`) REFERENCES `items` (`It_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_favorites_users` FOREIGN KEY (`Us_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `fk_items_categories` FOREIGN KEY (`Cat_id`) REFERENCES `categories` (`Cat_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_items_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `item_images`
--
ALTER TABLE `item_images`
  ADD CONSTRAINT `fk_images_items` FOREIGN KEY (`It_id`) REFERENCES `items` (`It_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`Us_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orders_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`Us_id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_orderitems_item` FOREIGN KEY (`It_id`) REFERENCES `items` (`It_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_orderitems_order` FOREIGN KEY (`Order_id`) REFERENCES `orders` (`Order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_reviews_item` FOREIGN KEY (`It_id`) REFERENCES `items` (`It_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reviews_order` FOREIGN KEY (`Order_id`) REFERENCES `orders` (`Order_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reviews_reviewed` FOREIGN KEY (`reviewed_user_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reviews_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_types` FOREIGN KEY (`Ty_id`) REFERENCES `types` (`Ty_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
