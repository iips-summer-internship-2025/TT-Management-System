package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"tms-server/models"
)

func FilteredLectures(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var lectures []models.Lecture

		yearStr := c.Query("year")
		section := c.Query("section")
		courseIDStr := c.Query("course_id")

		query := db.Preload("Batch").Preload("Subject").Preload("Faculty").Preload("Room").
			Joins("JOIN batches ON batches.id = lectures.batch_id")

		if yearStr != "" {
			if year, err := strconv.Atoi(yearStr); err == nil {
				query = query.Where("batches.year = ?", year)
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year parameter"})
				return
			}
		}

		if section != "" {
			query = query.Where("batches.section = ?", section)
		}

		if courseIDStr != "" {
			if courseID, err := strconv.Atoi(courseIDStr); err == nil {
				query = query.Where("batches.course_id = ?", courseID)
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course_id parameter"})
				return
			}
		}

		if err := query.Find(&lectures).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, lectures)
	}
}
