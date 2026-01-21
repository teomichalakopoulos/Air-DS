-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 09, 2025 at 10:16 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `air_ds`
--

-- --------------------------------------------------------

--
-- Table structure for table `airports`
--

CREATE TABLE `airports` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `tax` decimal(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `airports`
--

INSERT INTO `airports` (`id`, `name`, `code`, `latitude`, `longitude`, `tax`) VALUES
(1, 'Athens International Airport \"Eleftherios Venizelos\"', 'ATH', 37.9372250, 23.9452380, 150.00),
(2, 'Paris Charles de Gaulle Airport', 'CDG', 49.0097240, 2.5477780, 200.00),
(3, 'Leonardo da Vinci Rome Fiumicino Airport', 'FCO', 41.8108000, 12.2509000, 150.00),
(4, 'Adolfo Suárez Madrid–Barajas Airport', 'MAD', 40.4895000, 3.5643000, 250.00),
(5, 'Larnaka International Airport', 'LCA', 34.8715000, 33.6077000, 150.00),
(6, 'Brussels Airport', 'BRU', 50.9002000, 4.4859000, 200.00);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_surname` varchar(50) NOT NULL,
  `flight_departure` varchar(10) NOT NULL,
  `flight_arrival` varchar(10) NOT NULL,
  `flight_date` date NOT NULL,
  `seats` varchar(100) NOT NULL,
  `passenger_names` text DEFAULT NULL,
  `airport_taxes` decimal(8,2) NOT NULL,
  `seat_cost` decimal(8,2) NOT NULL,
  `total_cost` decimal(8,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `user_name`, `user_surname`, `flight_departure`, `flight_arrival`, `flight_date`, `seats`, `passenger_names`, `airport_taxes`, `seat_cost`, `total_cost`, `created_at`) VALUES
(10, 1, 'test', 'test', 'MAD', 'ATH', '2025-06-26', '7F,8F', '[{\"name\":\"test\",\"surname\":\"test\"},{\"name\":\"Onoma\",\"surname\":\"Epwnymo\"}]', 400.00, 20.00, 1174.91, '2025-06-09 19:03:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `surname`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'test', 'test', 'test', '$2y$10$8uFiHQEVbzPjhgl0JYvqT.aaBMfP8/1BjWQy86PfYs78IM0u54/5S', 'test@gmail.com', '2025-06-09 13:20:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `airports`
--
ALTER TABLE `airports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `airports`
--
ALTER TABLE `airports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
