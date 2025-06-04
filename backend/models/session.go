package models

import "time"

type Session struct {
	ID        uint      `gorm:"primaryKey"`
	LectureID uint      `grom:"notnull"`
	Date      time.Time `grom:"notnull"`
	Status    string    `grom:"notnull"`
}
