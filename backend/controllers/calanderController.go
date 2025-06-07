package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"tms-server/config"
	"tms-server/models"
)

func GetCalendarSummaryByDate(c *gin.Context) {
	courseID := c.Query("course_id")
	semesterID := c.Query("semester_id")
	month := c.Query("month")
	year := c.Query("year")
	facultyID := c.Query("faculty_id")

	//Query for lectures
	var lectures []models.Lecture
	query := config.DB.Joins("JOIN subjects ON subjects.id = lectures.subject_id")

	if courseID != "" {
		query = query.Where("subjects.course_id = ?", courseID)
	}
	if semesterID != "" {
		query = query.Where("lectures.semester_id = ?", semesterID)
	}
	if facultyID != "" {
		query = query.Where("lectures.faculty_id = ?", facultyID)
	}

	if err := query.Find(&lectures).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch lectures"})
		return
	}
	if len(lectures) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "no lectures found", "data": []gin.H{}})
		return
	}

	lectureIDs := make([]uint, 0, len(lectures))
	for _, l := range lectures {
		lectureIDs = append(lectureIDs, l.ID)
	}

	//Filter sessions using lecture_ids and date
	var sessions []models.Session
	sessionQuery := config.DB.Where("lecture_id IN ?", lectureIDs)

	if year != "" {
		sessionQuery = sessionQuery.Where("EXTRACT(YEAR FROM date) = ?", year)
	}
	if month != "" {
		sessionQuery = sessionQuery.Where("EXTRACT(MONTH FROM date) = ?", month)
	}

	if err := sessionQuery.Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch sessions"})
		return
	}

	//Group sessions by date
	type DayStat struct {
		Held   int
		Missed int
	}
	summary := make(map[string]*DayStat)

	for _, s := range sessions {
		key := s.Date.Format("2006-01-02")
		if summary[key] == nil {
			summary[key] = &DayStat{}
		}
		if s.Status == "held" {
			summary[key].Held++
		} else if s.Status == "missed" {
			summary[key].Missed++
		}
	}

	// Result ka format (you can make changes accordingly)
	result := []gin.H{}
	for dateStr, stat := range summary {
		result = append(result, gin.H{
			"date":         dateStr,
			"total_held":   stat.Held,
			"total_missed": stat.Missed,
		})
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}
