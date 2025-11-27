CREATE TABLE `experiments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`mode` text NOT NULL,
	`input_text` text NOT NULL,
	`output_text` text NOT NULL,
	`label` text
);
