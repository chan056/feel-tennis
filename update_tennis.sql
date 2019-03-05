ALTER TABLE `athlete`
ADD COLUMN `gear`  text NULL AFTER `titles`,
ADD COLUMN `gear_expire`  datetime NULL AFTER `bio_expire`;
