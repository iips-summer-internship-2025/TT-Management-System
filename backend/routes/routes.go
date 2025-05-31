package routes

import (
	"github.com/gin-gonic/gin"
	"tms-server/controllers"
	// "tms-server/middleware"
)

func RegisterRoutes(r *gin.Engine) {

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong! TMS-server is up"})
	})

	r.POST("/login", controllers.Login)

	// TODO: protected routes

	api := r.Group("/api/v1")
	{
		// api.Use(middleware.JWTAuthMiddleware())

		course := api.Group("/course")
		{
			course.GET("/", controllers.CourseAll)
			course.POST("/", controllers.CourseCreate)
		}

		subject := api.Group("/subject")
		{
			subject.GET("/", controllers.SubjectAll)
			subject.POST("/", controllers.SubjectCreate)
			subject.GET("/:id", controllers.SubjectGet)
			subject.PUT("/:id", controllers.SubjectUpdate)
			subject.DELETE("/:id", controllers.SubjectDelete)
		}
	}
}
