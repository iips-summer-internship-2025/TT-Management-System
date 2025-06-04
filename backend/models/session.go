package models

import "time"

type Session struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	LectureID uint      `json:"lecture_id"`
	Date      time.Time `json:"date"`
	Status    string    `json:"status"`
}
