package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"tms-server/config"
	"tms-server/models"
)

// GET /subject/
func SubjectAll(c *gin.Context) {
	var subjects []models.Subject
	if err := config.DB.Find(&subjects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, subjects)
}

// GET /subject/:id
func SubjectGet(c *gin.Context) {
	var subject models.Subject
	if err := config.DB.First(&subject, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
		return
	}
	c.JSON(http.StatusOK, subject)
}

// POST /subject/
func SubjectCreate(c *gin.Context) {
	var subject models.Subject
	if err := c.ShouldBindJSON(&subject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Create(&subject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, subject)
}

// PUT /subject/:id
func SubjectUpdate(c *gin.Context) {
	var subject models.Subject
	if err := config.DB.First(&subject, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Subject not found"})
		return
	}

	if err := c.ShouldBindJSON(&subject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&subject)
	c.JSON(http.StatusOK, subject)
}

// DELETE /subject/:id
func SubjectDelete(c *gin.Context) {
	if err := config.DB.Delete(&models.Subject{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Subject deleted"})
}
