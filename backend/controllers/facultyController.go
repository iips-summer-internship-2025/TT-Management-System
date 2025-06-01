package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"tms-server/models"
)

func GetAllFaculty(c *gin.Context) {
	var faculty []models.Faculty
	if err := models.DB.Find(&faculty).Error; err != nil {
		c.JSON( http.StatusInternalServerError, gin.H{
			"error" : "Error",
		})
	}
	c.JSON(http.StatusOK, faculty)
}

func GetFacultyByID(c *gin.Context) {
	id := c.Param("id")
	var faculty models.Faculty
	if err := models.DB.First(&faculty, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Faculty not found"})
		return
	}
	c.JSON(http.StatusOK, faculty)
}

func CreateFaculty(c *gin.Context) {
	var faculty models.Faculty
	if err := c.ShouldBindJSON(&faculty); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	models.DB.Create(&faculty)
	c.JSON(http.StatusOK, faculty)
}

func UpdateFaculty(c *gin.Context) {
	id := c.Param("id")
	var faculty models.Faculty
	if err := models.DB.First(&faculty, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Faculty not found"})
		return
	}
	c.ShouldBindJSON(&faculty)
	models.DB.Save(&faculty)
	c.JSON(http.StatusOK, faculty)
}

func DeleteFaculty(c *gin.Context) {
	id := c.Param("id")
	models.DB.Delete(&models.Faculty{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Faculty deleted"})
}
