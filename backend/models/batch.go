package models

type Batch struct {
	ID       uint   `gorm:"primaryKey"`
	Year     int    `gorm:"not null"` // e.g., 2023
	Section  string `gorm:"not null"` // e.g., A, B
	Semester uint   `gorm:"not null"`
	CourseID uint   `gorm:"not null"`
	Course   Course
	// Timetables []Timetable // TODO: create batch associated Timetable strcut -> collection of Lectures (IDs)
}
