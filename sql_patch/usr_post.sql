ALTER TABLE `feedback`
ADD COLUMN `replied`  tinyint(1) NULL DEFAULT 0 AFTER `time`;

