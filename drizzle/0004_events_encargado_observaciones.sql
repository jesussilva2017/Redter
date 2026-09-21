ALTER TABLE `events` ADD COLUMN `encargado` varchar(200);
ALTER TABLE `events` ADD COLUMN `observaciones` text;
ALTER TABLE `events` MODIFY COLUMN `tipo` varchar(100) NOT NULL;
