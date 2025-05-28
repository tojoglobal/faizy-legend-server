-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 28, 2025 at 06:39 PM
-- Server version: 10.6.20-MariaDB
-- PHP Version: 8.3.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tsgbsite_faizy_legend`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `phone`, `photo`, `role_id`, `password`, `email_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@gmail.com', '01629552892', '1631023655pexels-moose-photos-1036627.jpg', 0, '$2b$10$egJ3EaePsTuv2G8LDBqnouzVTmQaUzvVzzdSjELC7/fsutqbPoOwi', NULL, '2018-02-28 23:27:08', '2021-12-04 05:04:55'),
(2, 'test', 'test@gmail.com', '09000000', 'BhTv1584160189Brooklyn99-310x310.jpg', 1, '$2y$10$cl6qNdVuAhzJyaaLACVxGOQhlYf7n/UgLrwW0vx9QDGlZyKGM97mm', NULL, '2021-12-05 10:24:50', '2021-12-05 10:24:50');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `link` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `image_url`, `link`, `created_at`) VALUES
(2, 'Through The lens', '/uploads/1748356645419-through-the-lens.webp', 'https://tailwindcss.com/docs/installation/using-vite', '2025-05-27 14:37:25');

-- --------------------------------------------------------

--
-- Table structure for table `book_forms`
--

CREATE TABLE `book_forms` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `image_url` varchar(512) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `book_forms`
--

INSERT INTO `book_forms` (`id`, `name`, `last_name`, `email`, `message`, `image_url`, `created_at`) VALUES
(2, 'Mominul', 'Hossain', 'info@fc.net.au', 'try', '/uploads/1748354904531-YouTube-Image-panorama.jpg', '2025-05-27 14:08:24'),
(3, 'Lacey Solomon', 'Holmes', 'qaqaq@mailinator.com', 'Eos in deserunt veli', '/uploads/1748421876309-IMG_8649-scaled.jpg.jpeg', '2025-05-28 08:44:36');

-- --------------------------------------------------------

--
-- Table structure for table `filming_videos`
--

CREATE TABLE `filming_videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `youtube_id` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `filming_videos`
--

INSERT INTO `filming_videos` (`id`, `title`, `youtube_id`, `description`, `created_at`, `updated_at`) VALUES
(2, 'Secret ward', 'A02Q5F7Y3r0', 'A powerful moment in Human and Demon Realm.', '2025-05-27 07:37:31', '2025-05-27 12:17:50'),
(5, 'A Day in Dhaka', 'dQw4w9WgXcQ', 'A cinematic vlog of a day in the bustling city of Dhaka.', '2025-05-27 11:59:22', '2025-05-27 12:16:28'),
(6, 'Faizy’s Fashion Walk', '3JZ_D3ELwOQ', 'Behind the scenes from Faizy’s latest modeling ramp walk.', '2025-05-27 11:59:22', '2025-05-27 11:59:22'),
(8, 'Interview with Faizy', 'V-_O7nl0Ii0', 'A candid interview session with Faizy Legend.', '2025-05-27 11:59:22', '2025-05-27 11:59:22'),
(9, 'Lifestyle Documentary', 'e-ORhEE9VVg', 'A short documentary on the influencer lifestyle.', '2025-05-27 11:59:22', '2025-05-27 11:59:22'),
(10, 'AI vs Humans | Have We Lost The Battle? | Dhruv Rathee', '0HnMzuSYzwI', 'Is AI the end of human creativity—or just holding up a mirror to it? This eye-opening video dives into AI-generated art, and shocking truths', '2025-05-27 12:19:47', '2025-05-27 12:24:42');

-- --------------------------------------------------------

--
-- Table structure for table `modeling_galleries`
--

CREATE TABLE `modeling_galleries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `photographer` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `modeling_galleries`
--

INSERT INTO `modeling_galleries` (`id`, `name`, `location`, `photographer`, `thumbnail`, `images`, `created_at`, `updated_at`) VALUES
(3, 'Jackson Briggs454', 'Rerum exercitationem', 'Ea velit minim non ', 'uploads/1748360911736-IMG_8724-scaled.jpg.jpeg', '[\"uploads/1748362062844-IMG_8561-scaled.jpg.jpeg\",\"uploads/1748422753782-IMG_0057.jpg - Copy.jpeg\",\"uploads/1748422753782-IMG_0057.jpg.jpeg\",\"uploads/1748422753782-IMG_8554-scaled.jpg.jpeg\",\"uploads/1748422753788-IMG_8556-scaled.jpg.jpeg\",\"uploads/1748422753791-IMG_8556-scaled.webp\",\"uploads/1748422753795-IMG_8561-scaled.jpg.jpeg\",\"uploads/1748422753797-IMG_8609-scaled.jpg.jpeg\",\"uploads/1748422753801-IMG_8609-scaled.webp\",\"uploads/1748422753803-IMG_8613-scaled.jpg.jpeg\",\"uploads/1748422753804-IMG_8613-scaled.webp\",\"uploads/1748422753805-IMG_8625-scaled.jpg.jpeg\",\"uploads/1748422753809-IMG_8628-scaled.jpg.jpeg\"]', '2025-05-27 15:48:31', '2025-05-28 08:59:13'),
(5, 'Sonia Bridges', 'Voluptatum et iusto ', 'Consequatur culpa ', 'uploads/1748422730872-IMG_8633-1-scaled.webp', '[\"uploads/1748422730879-IMG_8825-1-scaled.jpg.jpeg\",\"uploads/1748422730884-IMG_8828-scaled.jpg.jpeg\",\"uploads/1748422730886-IMG_8886-1-scaled.jpg.jpeg\",\"uploads/1748422730889-IMG_85481-scaled.jpg.jpeg\",\"uploads/1748422730890-IMG_86431-scaled.jpg.jpeg\",\"uploads/1748422730900-IMG_86651-scaled.jpg.jpeg\"]', '2025-05-28 08:58:50', '2025-05-28 08:58:50');

-- --------------------------------------------------------

--
-- Table structure for table `shopping_categories`
--

CREATE TABLE `shopping_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `shopping_categories`
--

INSERT INTO `shopping_categories` (`id`, `name`, `created_at`) VALUES
(1, 'T-shirt', '2025-05-27 12:44:30'),
(2, 'Pent', '2025-05-27 13:18:53');

-- --------------------------------------------------------

--
-- Table structure for table `shopping_products`
--

CREATE TABLE `shopping_products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(512) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `shopping_products`
--

INSERT INTO `shopping_products` (`id`, `name`, `image_url`, `category_id`, `link`, `created_at`) VALUES
(1, 'shopping', '/uploads/1748349999012-images.jpeg', 1, 'https://ts-geosystems.com.bd/', '2025-05-27 12:46:39'),
(2, 'new qurbani collection pent', '/uploads/1748353099248-RK-FPN-TM25-11WN-14802_3.webp', 2, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGqUW2APnKexjDw7KGMVb9EVfaJsqNYOcQIg&s', '2025-05-27 13:19:22');

-- --------------------------------------------------------

--
-- Table structure for table `ugc_videos`
--

CREATE TABLE `ugc_videos` (
  `id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `youtube_id` varchar(16) NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ugc_videos`
--

INSERT INTO `ugc_videos` (`id`, `url`, `youtube_id`, `thumbnail`, `title`, `created_at`, `updated_at`) VALUES
(2, 'https://www.youtube.com/shorts/Xpu6YE1ivAI', 'Xpu6YE1ivAI', 'https://img.youtube.com/vi/Xpu6YE1ivAI/hqdefault.jpg', 'Hearview Glasses454', '2025-05-27 17:09:29', '2025-05-27 17:10:10'),
(3, 'https://youtube.com/shorts/72X1YVrc32k?si=itIKtSa8-_CcU8DZ', '72X1YVrc32k', 'https://img.youtube.com/vi/72X1YVrc32k/hqdefault.jpg', 'Living with ur parents VS living alone', '2025-05-28 08:56:15', '2025-05-28 08:56:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `book_forms`
--
ALTER TABLE `book_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `filming_videos`
--
ALTER TABLE `filming_videos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modeling_galleries`
--
ALTER TABLE `modeling_galleries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shopping_categories`
--
ALTER TABLE `shopping_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shopping_products`
--
ALTER TABLE `shopping_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `ugc_videos`
--
ALTER TABLE `ugc_videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `book_forms`
--
ALTER TABLE `book_forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `filming_videos`
--
ALTER TABLE `filming_videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `modeling_galleries`
--
ALTER TABLE `modeling_galleries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `shopping_categories`
--
ALTER TABLE `shopping_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `shopping_products`
--
ALTER TABLE `shopping_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ugc_videos`
--
ALTER TABLE `ugc_videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `shopping_products`
--
ALTER TABLE `shopping_products`
  ADD CONSTRAINT `shopping_products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `shopping_categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
