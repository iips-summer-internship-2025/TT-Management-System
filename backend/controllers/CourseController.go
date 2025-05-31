package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"tms-server/config"
	"tms-server/models"
)

// GET /course/
func CourseAll(c *gin.Context) {
	var courses []models.Course
	if err := config.DB.Preload("Batches").Preload("Subjects").Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, courses)
}

// POST /course/
func CourseCreate(c *gin.Context) {
	var course models.Course
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, course)
}
