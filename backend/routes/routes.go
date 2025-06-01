package routes

import (
	"tms-server/controllers"
	"tms-server/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.Use(middleware.CORSMiddleware())
	api := r.Group("/api/v1")
	{
		api.GET("/ping", controllers.Ping)
		api.POST("/login", controllers.Login)

		// api.Use(middleware.JWTAuthMiddleware())
		course := api.Group("/course")
		{
			course.GET("/", controllers.CourseAll)
			course.POST("/", controllers.CourseCreate)
			course.GET("/:id", controllers.CourseGet)
			course.PUT("/:id", controllers.CourseUpdate)
			course.DELETE("/:id", controllers.CourseDelete)
		}
		subject := api.Group("/subject")
		{
			subject.GET("/", controllers.SubjectAll)
			subject.POST("/", controllers.SubjectCreate)
			subject.GET("/:id", controllers.SubjectGet)
			subject.PUT("/:id", controllers.SubjectUpdate)
			subject.DELETE("/:id", controllers.SubjectDelete)
		}
		faculty := api.Group("/faculty")
		{
			faculty.GET("/", controllers.FacultyAll)
			faculty.POST("/", controllers.FacultyCreate)
			faculty.GET("/:id", controllers.FacultyGet)
			faculty.PUT("/:id", controllers.FacultyUpdate)
			faculty.DELETE("/:id", controllers.FacultyDelete)
		}
		room := api.Group("/room")
		{
			room.GET("/", controllers.RoomAll)
			room.POST("/", controllers.RoomCreate)
			room.GET("/:id", controllers.RoomGet)
			room.PUT("/:id", controllers.RoomUpdate)
			room.DELETE("/:id", controllers.RoomDelete)
		}
	}
}
