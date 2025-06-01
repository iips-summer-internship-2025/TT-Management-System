package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"tms-server/models"
	"tms-server/utils"
)

// TODO:
// 1. Parse JSON input
// 2. Validate credentials
// 3. Generate JWT token
// 4. Return token in response
// 5. Set token in cookie

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{"message": "pong! TMS-server is up"})
}

func Login(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Username == "admin" && input.Password == "admin" {
		token, _ := utils.GenerateToken(input.Username)
		c.JSON(http.StatusOK, gin.H{"token": token})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
	}
}
