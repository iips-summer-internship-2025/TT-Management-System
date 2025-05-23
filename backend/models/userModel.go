package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID       uint   `gorm:"primaryKey"`
	Role     string `gorm:"default:'Faculty'"`
	Username string `gorm:"unique"`
	Password string
}
