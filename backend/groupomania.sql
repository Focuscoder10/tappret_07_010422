DROP DATABASE groupomania;
CREATE DATABASE groupomania;
USE groupomania;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `last_logged_in` timestamp,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255),
  `is_moderator` int NOT NULL DEFAULT 0
);

CREATE TABLE `posts` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `content` text NOT NULL,
  `media` varchar(255),
  `author_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp,
  `parent_id` int
);

CREATE TABLE `post_user_viewed` (
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`post_id`,`user_id`)
);

CREATE TABLE `likes` (
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `liked_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`post_id`,`user_id`)
);

ALTER TABLE `posts` ADD FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);

ALTER TABLE `posts` ADD FOREIGN KEY (`parent_id`) REFERENCES `posts` (`id`);

ALTER TABLE `post_user_viewed` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

ALTER TABLE `post_user_viewed` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `likes` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

ALTER TABLE `likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

INSERT INTO `users`
(`firstname`, `lastname`, `email`, `password`, `is_moderator`)
VALUES
("L'équipe", "de modération", "moderation@example.com", "$2a$10$5wpKWvJbvURCyoW96tvlme97joMKinTFpBiNAhquFeS1uSsozKspm", 1);

