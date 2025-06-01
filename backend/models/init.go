package models

import "gorm.io/gorm"

var DB *gorm.DB

func SetDatabase(db *gorm.DB) {
	DB = db
}
