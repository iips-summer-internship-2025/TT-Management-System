package models

type Faculty struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"not null"`
	Email    string `gorm:"uniqueIndex"`
	Phone    string
	Subjects []Subject `gorm:"many2many:faculty_subjects;"`
}
