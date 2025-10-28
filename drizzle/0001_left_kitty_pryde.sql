CREATE TABLE `entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`genre` text NOT NULL,
	`release_year` integer NOT NULL,
	`rating` real NOT NULL,
	`description` text NOT NULL,
	`image_url` text,
	`director` text NOT NULL,
	`budget` real,
	`duration` integer NOT NULL,
	`location` text,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
