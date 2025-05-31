package routes

import (
	"tms-server/controllers"
	"tms-server/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")
	api.Use(middleware.CORSMiddleware())
	{
		r.GET("/ping", controllers.Ping)
		r.POST("/login", controllers.Login)

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
