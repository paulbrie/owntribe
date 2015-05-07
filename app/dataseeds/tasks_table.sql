-- phpMyAdmin SQL Dump
-- version 4.2.10
-- http://www.phpmyadmin.net
--
-- Client :  localhost:3306
-- Généré le :  Lun 30 Mars 2015 à 19:22
-- Version du serveur :  5.5.38
-- Version de PHP :  5.6.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `owntribe`
--

-- --------------------------------------------------------

--
-- Structure de la table `tasks`
--

CREATE TABLE `tasks` (
`id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '1',
  `description` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `description`, `status`, `user_id`) VALUES
(1, 'Buy some milk', 'bio milk', 1, 1),
(2, 'Buy flowers to my wife', NULL, 1, 1),
(3, 'Fix the car', 'asap', 1, 1);

--
-- Index pour les tables exportées
--

-- Index pour la table `tasks`
--
ALTER TABLE `tasks`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `tasks`
--
ALTER TABLE `tasks`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;