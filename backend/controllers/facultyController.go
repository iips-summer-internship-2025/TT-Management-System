package controllers

import (
	"net/http"
	"tms-server/config"
	"tms-server/models"

	"github.com/gin-gonic/gin"
)

// GET /faculty/
func FacultyAll(c *gin.Context) {
	var faculty []models.Faculty
	if err := config.DB.Find(&faculty).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error",
		})
	}
	c.JSON(http.StatusOK, faculty)
}

// GET /faculty/:id
func FacultyGet(c *gin.Context) {
	id := c.Param("id")
	var faculty models.Faculty
	if err := config.DB.First(&faculty, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Faculty not found"})
		return
	}
	c.JSON(http.StatusOK, faculty)
}

// POST /faculty/
func FacultyCreate(c *gin.Context) {
	var faculty models.Faculty
	if err := c.ShouldBindJSON(&faculty); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Create(&faculty)
	c.JSON(http.StatusOK, faculty)
}

// PUT /faculty/:id
func FacultyUpdate(c *gin.Context) {
	id := c.Param("id")
	var faculty models.Faculty
	if err := config.DB.First(&faculty, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Faculty not found"})
		return
	}
	c.ShouldBindJSON(&faculty)
	config.DB.Save(&faculty)
	c.JSON(http.StatusOK, faculty)
}

// DELETE /faculty/:id
func FacultyDelete(c *gin.Context) {
	id := c.Param("id")
	config.DB.Delete(&models.Faculty{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Faculty deleted"})
}
