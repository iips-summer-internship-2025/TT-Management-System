package models

type Course struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"not null"`
	Code     string `gorm:"uniqueIndex;not null"`
	Batches  []Batch
	Subjects []Subject
}
