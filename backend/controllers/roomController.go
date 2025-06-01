package controllers

import (
	"net/http"
	"tms-server/config"
	"tms-server/models"

	"github.com/gin-gonic/gin"
)

// GET /room/
func RoomAll(c *gin.Context) {
	var rooms []models.Room
	if err := config.DB.Find(&rooms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rooms)
}

// GET /room/:id
func RoomGet(c *gin.Context) {
	id := c.Param("id")
	var room models.Room

	if err := config.DB.First(&room, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"err": "Rooms not found"})
	}
	c.JSON(http.StatusOK, room)
}

// POST /room/
func RoomCreate(c *gin.Context) {
	var room models.Room
	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Create(&room).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create room",
			"debug": err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, room)
}

// PUT /room/:id
func RoomUpdate(c *gin.Context) {
	var room models.Room
	id := c.Param("id")
	if err := config.DB.First(&room, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}
	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Save(&room).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, room)
}

// DELETE /room/:id
func RoomDelete(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Room{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Room deleted"})
}
