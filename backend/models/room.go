package models

type Room struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `gorm:"uniqueIndex;not null" json:"name"`
	Capacity int    `json:"capacity"`
}
