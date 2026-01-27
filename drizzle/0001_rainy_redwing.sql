CREATE TABLE `tool_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer NOT NULL,
	`tool_id` text NOT NULL,
	`input_json` text NOT NULL,
	`output_text` text NOT NULL,
	`prompt_version` text NOT NULL,
	`model` text NOT NULL,
	`temperature` integer NOT NULL
);
