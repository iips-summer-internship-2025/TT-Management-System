package config

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"tms-server/models"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL") // Or construct it manually
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// NOTE: Uncomment and run once.
	// TODO: Remove AutoMigrate, Implement Safe Migration

	// db.AutoMigrate(
	// 	&models.User{},
	// 	&models.Faculty{},
	// 	&models.Course{},
	// 	&models.Batch{},
	// 	&models.Subject{},
	// 	&models.Room{},
	// 	&models.Timetable{},
	// )

	DB = db
}
