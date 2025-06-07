package models

import "time"

type Session struct {
	ID        uint      `gorm:"primaryKey"`
	LectureID uint      `grom:"not null"`
	Date      time.Time `grom:"not null"`
	Status    string    `grom:"not null"`
}
