-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 20, 2026 at 07:58 PM
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
-- Database: `eduswap`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `Adm_id` int(11) NOT NULL,
  `Adm_name` varchar(255) NOT NULL,
  `Adm_email` varchar(255) NOT NULL,
  `Adm_password` varchar(255) NOT NULL,
  `Adm_phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ads`
--

CREATE TABLE `ads` (
  `Ads_id` int(11) NOT NULL,
  `Ads_date` date NOT NULL,
  `Ads_status` enum('نشط','منتهي') NOT NULL,
  `Ads_name` varchar(255) NOT NULL,
  `Us_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `B_id` int(11) NOT NULL,
  `B_name` varchar(255) NOT NULL,
  `B_date` date NOT NULL,
  `B_Quantity` int(11) NOT NULL,
  `R_date` date NOT NULL,
  `Adm_id` int(11) DEFAULT NULL,
  `It_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `Ch_id` int(11) NOT NULL,
  `Ch_send` varchar(255) NOT NULL,
  `Ch_receive` varchar(255) NOT NULL,
  `Ch_text` varchar(255) NOT NULL,
  `Ch_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `It_id` int(11) NOT NULL,
  `It_name` varchar(255) NOT NULL,
  `It_type` enum('كتاب','اداه') NOT NULL,
  `It_description` varchar(255) DEFAULT NULL,
  `It_price` decimal(10,2) NOT NULL,
  `It_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'mohamed12hegazy11@gmail.com', '$2b$10$O8nziorIVte71vMzRW9oUe.xzdHaAztJ94UQbTtyQmalF9uRQ6rGm', '2026-02-10 18:27:30', 0, '2026-02-10 18:17:30'),
(2, 'mohamed12hegazy11@gmail.com', '$2b$10$87Vt7tiXf/l0KTCIx4Tm4.qfUTSQzySawyfy8xyF/3giVSRXBv8pe', '2026-02-10 18:28:14', 0, '2026-02-10 18:18:14'),
(3, 'mohamed12hegazy11@gmail.com', '$2b$10$jpQc4r0Aq3z1vkYsxWYB2OmxQnklSkta5z/TUwIF8K.5.Rn7NPiEq', '2026-02-10 18:29:49', 0, '2026-02-10 18:19:49'),
(4, 'mohamed12hegazy11@gmail.com', '$2b$10$.GjM./bCEiNUbgLt88dUyul/E.3WzJeWj94nlcl0DI9SiHSE5991O', '2026-02-10 18:33:57', 0, '2026-02-10 18:23:57'),
(5, 'mohamed12hegazy11@gmail.com', '$2b$10$zxSjqeb30abX56e9vXoTq.GtFUbkJ6qBk9sSbU/f23WRRuiYlJVNW', '2026-02-10 18:42:15', 0, '2026-02-10 18:32:15'),
(6, 'mohamed12hegazy11@gmail.com', '$2b$10$j6Z2b1gKE0iVVMFuzALVAuz33adKBAI7ZCtZPa0blvhNn5BBKABzC', '2026-02-10 18:45:46', 0, '2026-02-10 18:35:46'),
(7, 'mohamed12hegazy11@gmail.com', '$2b$10$hOz2/B.bMsOOg5Ly1/Ubu.PDlw0Yb/i7C7O.o9XD3e06eXEfFTLLa', '2026-02-10 18:48:18', 0, '2026-02-10 18:38:18'),
(8, 'mohamed12hegazy11@gmail.com', '$2b$10$3oa4CBMQHIt9VRh4sLhz8uFJcxgKWfmMbyQG516izGaEsV2954PvS', '2026-02-10 18:49:24', 1, '2026-02-10 18:39:24'),
(9, 'mohamed12hegazy11@gmail.com', '$2b$10$iXr4R0PwhUknn/XO9gU3tuEIqL/qLaAj/v3GrBXo9ZHSvzwVgyaGK', '2026-02-10 18:52:24', 1, '2026-02-10 18:42:24'),
(10, 'mohamed12hegazy11@gmail.com', '$2b$10$k6mIpFdW2I9R1K1yjbkLXewnexzsDde2gFmuBr58yQ/ePVUZs4cSG', '2026-02-10 18:52:54', 0, '2026-02-10 18:42:54'),
(11, 'mohamedeeee12hegazy11@gmail.com', '$2b$10$MFrryz7FO2RmgBx.QyL.aOgiwZpYRms.ZCtLFfhd9mzvAMo0fANCa', '2026-02-10 18:52:58', 1, '2026-02-10 18:42:58'),
(12, 'mohamedeeee12hegazy11@gmail.com', '$2b$10$QCPNVJqO4o5T/ARa3ClW9.CKVdZp3QSd2pRhvaZqc6HkbtyCj3Kkq', '2026-02-10 18:58:03', 0, '2026-02-10 18:48:03'),
(13, 'mohamed12hegazy11@gmail.com', '$2b$10$M13ZajpP8ix2CjBdIuJa2OslwquILxZgATSlQpc38/G1GixZ5VVu6', '2026-02-10 18:59:30', 0, '2026-02-10 18:49:30'),
(14, 'mahmoudalimohameed4@gmail.com', '$2b$10$P7.fs4u74iUkeFqIKLqVI.o6RJnEuxHQofP68p2jHpV2HVgyU3nFW', '2026-02-10 19:03:36', 1, '2026-02-10 18:53:36'),
(15, 'mohamedeeee12hegazy11@gmail.com', '$2b$10$xZxBjXQjIxRAIuLt1Mpel.PzAqd2/j8F9VxSuImMMgYDa0OPiDgem', '2026-02-10 19:05:18', 0, '2026-02-10 18:55:18'),
(16, 'mohamed12hegazy11@gmail.com', '$2b$10$.vlQ0AfJvTd7zCBcSL8sl.DUvQq0.CHoDET8RX/IYPYvUgumCGcE2', '2026-02-10 19:06:16', 0, '2026-02-10 18:56:16'),
(17, 'mahmoudalimohameed4@gmail.com', '$2b$10$I3tKmWqE.mM/r4HDFcY5Mu6l6kJ0KSgW/nOjvPOlwYpybn6f3Gl.q', '2026-02-10 19:08:49', 0, '2026-02-10 18:58:49'),
(18, 'mahmoudalimohameed4@gmail.com', '$2b$10$bYpUFYww6jObukzjhlnt2eNJJdFSWIMWYrzpQJUk2086x01sLdzkC', '2026-02-10 19:10:02', 0, '2026-02-10 19:00:02');

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `apartment_number` varchar(50) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `resident_id` int(11) DEFAULT NULL,
  `visitor_id` int(11) DEFAULT NULL,
  `type` enum('ENTRY','EXIT') NOT NULL,
  `notes` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE `types` (
  `Ty_id` int(11) NOT NULL,
  `Ty_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`Ty_id`, `Ty_name`) VALUES
(1, 'بائع'),
(2, 'مشتري');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Us_id` int(11) NOT NULL,
  `Us_name` varchar(255) NOT NULL,
  `Us_email` varchar(255) NOT NULL,
  `Us_password` varchar(255) NOT NULL,
  `Us_phone` varchar(255) DEFAULT NULL,
  `Ty_id` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Us_id`, `Us_name`, `Us_email`, `Us_password`, `Us_phone`, `Ty_id`) VALUES
(35, 'ahmed ramasaddffdan', 'ramadfeffan@gmail.com', '$2b$10$kSu51pvA6WEPp.RlV3c.QepCeHlEk.LvJXYT7IAifW4YwygTswj6u', NULL, 2),
(37, 'mohamed mahmoud', 'hegazy333@gmail.com', '$2b$10$LDwzPZkbVXFiZKNOFt/GL.220PjvMqOFBLiTf.NRIJSn5DfLI8hM2', '01015112428', 2),
(39, 'mohamed mahmoud ali', 'hegazy444333@gmail.com', '$2b$10$VrPRiZ2NRs1vO80/QkZAe.0VdBWMOIz6Do4hEATuzsafyRFr4y/1K', '0101511442428', 2),
(40, 'mohamed mahmoud ali', 'mohamed12hegazy11@gmail.com', '$2b$10$tD6EK2gVAgFxLd8E23Jnre4S0l7bixE0nlGcr3f8aoh2cJagShzs2', '0101511442428', 2),
(41, 'ahmed mahmoud ali', 'ahme123@gmail.com', '$2b$10$5w3QKUk8zAGbkDk5jV9T.uzgLvHEwfmgL03tryh9spIKe/AhX/hqO', '119228333', 2),
(43, 'sjsjssjs mahmoud ali', 'ahmesss123@gmail.com', '$2b$10$IHICHLeiIz9dwriK7RhKEOtu/c1CedUY4Uv6bvEDh04NdngJX5cq2', '1192ss28333', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users_booking`
--

CREATE TABLE `users_booking` (
  `Us_id` int(11) NOT NULL,
  `B_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_chats`
--

CREATE TABLE `users_chats` (
  `Us_id` int(11) NOT NULL,
  `Ch_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users_items`
--

CREATE TABLE `users_items` (
  `Us_id` int(11) NOT NULL,
  `It_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_number` varchar(50) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `visitors`
--

INSERT INTO `visitors` (`id`, `name`, `id_number`, `photo`, `location`, `created_at`, `updated_at`) VALUES
(1, 'Test Visitor', 'TEST-1770912261924', 'https://via.placeholder.com/150', 'Test Location', '2026-02-12 16:04:21', '2026-02-12 16:04:21'),
(2, 'Ahmed Ali', '123456789', 'https://example.com/photo.jpg', 'Main Gate', '2026-02-12 16:05:39', '2026-02-12 16:05:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`Adm_id`);

--
-- Indexes for table `ads`
--
ALTER TABLE `ads`
  ADD PRIMARY KEY (`Ads_id`),
  ADD KEY `fk_ads_users` (`Us_id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`B_id`),
  ADD KEY `fk_booking_admins` (`Adm_id`),
  ADD KEY `fk_booking_items` (`It_id`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`Ch_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`It_id`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_otp_email` (`email`),
  ADD KEY `idx_otp_expires` (`expires_at`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `visitor_id` (`visitor_id`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`Ty_id`),
  ADD UNIQUE KEY `Ty_name` (`Ty_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Us_id`),
  ADD UNIQUE KEY `Us_email` (`Us_email`),
  ADD KEY `fk_users_types` (`Ty_id`);

--
-- Indexes for table `users_booking`
--
ALTER TABLE `users_booking`
  ADD PRIMARY KEY (`Us_id`,`B_id`),
  ADD KEY `fk_ub_booking` (`B_id`);

--
-- Indexes for table `users_chats`
--
ALTER TABLE `users_chats`
  ADD PRIMARY KEY (`Us_id`,`Ch_id`),
  ADD KEY `fk_uc_chats` (`Ch_id`);

--
-- Indexes for table `users_items`
--
ALTER TABLE `users_items`
  ADD PRIMARY KEY (`Us_id`,`It_id`),
  ADD KEY `fk_ui_items` (`It_id`);

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_number` (`id_number`);

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
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `B_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `Ch_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `It_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `Ty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Us_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ads`
--
ALTER TABLE `ads`
  ADD CONSTRAINT `fk_ads_users` FOREIGN KEY (`Us_id`) REFERENCES `users` (`Us_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `fk_booking_admins` FOREIGN KEY (`Adm_id`) REFERENCES `admins` (`Adm_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_booking_items` FOREIGN KEY (`It_id`) REFERENCES `items` (`It_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_types` FOREIGN KEY (`Ty_id`) REFERENCES `types` (`Ty_id`) ON UPDATE CASCADE;

--
-- Constraints for table `users_booking`
--
ALTER TABLE `users_booking`
  ADD CONSTRAINT `fk_ub_booking` FOREIGN KEY (`B_id`) REFERENCES `booking` (`B_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ub_users` FOREIGN KEY (`Us_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE;

--
-- Constraints for table `users_chats`
--
ALTER TABLE `users_chats`
  ADD CONSTRAINT `fk_uc_chats` FOREIGN KEY (`Ch_id`) REFERENCES `chats` (`Ch_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_uc_users` FOREIGN KEY (`Us_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE;

--
-- Constraints for table `users_items`
--
ALTER TABLE `users_items`
  ADD CONSTRAINT `fk_ui_items` FOREIGN KEY (`It_id`) REFERENCES `items` (`It_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ui_users` FOREIGN KEY (`Us_id`) REFERENCES `users` (`Us_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
