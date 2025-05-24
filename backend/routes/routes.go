package routes

import (
	"github.com/gin-gonic/gin"
	"tms-server/controllers"
	"tms-server/middleware"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong! TMS-server is up"})
	})

	r.POST("/login", controllers.Login)

	r.Use(middleware.JWTAuthMiddleware())

	// TODO: protected routes
}
