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
	if err := config.DB.Preload("Batches").Preload("courses").Find(&courses).Error; err != nil {
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

// GET /course/:id
func CourseGet(c *gin.Context) {
	var course models.Course
	if err := config.DB.First(&course, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "course not found"})
		return
	}
	c.JSON(http.StatusOK, course)
}

// PUT /course/:id
func CourseUpdate(c *gin.Context) {
	var course models.Course
	if err := config.DB.First(&course, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "course not found"})
		return
	}
	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Save(&course)
	c.JSON(http.StatusOK, course)
}

// DELETE /course/:id
func CourseDelete(c *gin.Context) {
	if err := config.DB.Delete(&models.Course{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Course deleted"})
}
