package controllers

import (
	"net/http"
	"tms-server/models"
	"github.com/gin-gonic/gin"
)

func GetAllRooms(c *gin.Context) {
	var rooms []models.Room
	if err := models.DB.Find(&rooms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rooms)
}

func GetRoomByID(c *gin.Context) {
	id := c.Param("id")
	var room models.Room

	if err := models.DB.First(&room, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"err": "Rooms not found"})
	}
	c.JSON(http.StatusOK, room)
}

func CreateRoom(c *gin.Context) {
	var room models.Room

	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Create(&room).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create room",
			"debug": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, room)
}

func UpdateRoom(c *gin.Context) {
	var room models.Room
	id := c.Param("id")

	if err := models.DB.First(&room, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Save(&room).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, room)

}

func DeleteRoom(c *gin.Context) {
	id := c.Param("id")
	if err := models.DB.Delete(&models.Room{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Room deleted"})
}
