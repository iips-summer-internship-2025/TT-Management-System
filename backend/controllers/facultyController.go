package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllFaculty(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"error": "Error 404",
	})
	
}
func GetFacultyByID(c *gin.Context) {}
func CreateFaculty(c *gin.Context) {}
func UpdateFaculty(c *gin.Context) {}
func DeleteFaculty(c *gin.Context) {}
