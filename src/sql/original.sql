CREATE TABLE `course` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) DEFAULT NULL,
	`deleted` int(11) DEFAULT '0',
	PRIMARY KEY (`id`)
);

CREATE TABLE `student` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(50) DEFAULT NULL,
	`username` varchar(50) DEFAULT NULL,
	`email` varchar(50) DEFAULT NULL,
	`password` text,
	`school` varchar(50) DEFAULT NULL,
	`image` text,
	`phone` varchar(20) DEFAULT NULL,
	`education_id` int(11) DEFAULT NULL,
	`deleted` int(11) DEFAULT '0',
	PRIMARY KEY (`id`)
);

CREATE TABLE `teacher` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(50) DEFAULT NULL,
	`username` varchar(50) DEFAULT NULL,
	`email` varchar(50) DEFAULT NULL,
	`password` text,
	`cost` int(11) DEFAULT NULL,
	`image` text,
	`phone` varchar(20) DEFAULT NULL,
	`deleted` int(11) DEFAULT '0',
	PRIMARY KEY (`id`)
);

CREATE TABLE `student_course` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`student_id` int(11) DEFAULT NULL,
	`course_id` int(11) DEFAULT NULL,
	`deleted` int(11) DEFAULT '0',
	PRIMARY KEY (`id`)
);

CREATE TABLE `teacher_course` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(50) DEFAULT NULL,
	`day` varchar(50) DEFAULT NULL,
	`time` time DEFAULT NULL,
	`media` varchar(50) DEFAULT NULL,
	`course_id` int(11) DEFAULT NULL,
	`teacher_id` int(11) DEFAULT NULL,
	`deleted` int(11) DEFAULT '0',
	PRIMARY KEY (`id`)
);