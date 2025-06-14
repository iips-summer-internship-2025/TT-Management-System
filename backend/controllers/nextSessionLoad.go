package controllers

import (
	"log"
	"time"

	"tms-server/config"
	"tms-server/models"
)

func LoadNextDaySessions() {
	tomorrow := time.Now().Add(24 * time.Hour)
	dayName := tomorrow.Weekday().String() 

	//Get all lectures scheduled on that day of week
	var lectures []models.Lecture
	if err := config.DB.Where("day_of_week = ?", dayName).Find(&lectures).Error; err != nil {
		log.Printf("Failed to fetch lectures for %s: %v", dayName, err)
		return
	}

	if len(lectures) == 0 {
		log.Printf("ℹ️ No lectures found for %s", dayName)
		return
	}

	//Filter lectures that already have a session for that date
	lectureIDs := make([]uint, 0, len(lectures))
	for _, lec := range lectures {
		lectureIDs = append(lectureIDs, lec.ID)
	}

	var existing []models.Session
	if err := config.DB.Where("lecture_id IN ?", lectureIDs).
		Where("date = ?", tomorrow.Format("2006-01-02")).
		Find(&existing).Error; err != nil {
		log.Printf("❌ Failed to fetch existing sessions: %v", err)
		return
	}

	//Already inserted lectures
	existingMap := make(map[uint]bool)
	for _, e := range existing {
		existingMap[e.LectureID] = true
	}

	toInsert := []models.Session{}
	for _, lec := range lectures {
		if !existingMap[lec.ID] {
			toInsert = append(toInsert, models.Session{
				LectureID: lec.ID,
				Date:      tomorrow,
				Status:    "scheduled",
			})
		}
	}

	//Bulk insert
	if len(toInsert) > 0 {
		if err := config.DB.Create(&toInsert).Error; err != nil {
			log.Printf("Failed to insert sessions: %v", err)
			return
		}
		log.Printf("%d sessions preloaded for %s", len(toInsert), tomorrow.Format("2006-01-02"))
	} else {
		log.Printf("No new sessions to insert for %s", tomorrow.Format("2006-01-02"))
	}
}
