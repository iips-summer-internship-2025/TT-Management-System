package routes

import (
	"tms-server/config"
	"tms-server/controllers"
	"tms-server/middleware"
	"tms-server/models"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.Use(middleware.CORSMiddleware())

	db := config.DB
	api := r.Group("/api/v1")
	{
		api.GET("/ping", controllers.Ping)
		api.POST("/login", controllers.Login)

		course := api.Group("/course")
		{
			course.GET("/", controllers.All[models.Course](db))
			course.POST("/", controllers.Create[models.Course](db))
			course.GET("/:id", controllers.Get[models.Course](db))
			course.PUT("/:id", controllers.Update[models.Course](db))
			course.DELETE("/:id", controllers.Delete[models.Course](db))
		}
		subject := api.Group("/subject")
		{
			subject.GET("/", controllers.All[models.Subject](db))
			subject.POST("/", controllers.All[models.Subject](db))
			subject.GET("/:id", controllers.Get[models.Subject](db))
			subject.PUT("/:id", controllers.Update[models.Subject](db))
			subject.DELETE("/:id", controllers.Delete[models.Subject](db))
		}
		faculty := api.Group("/faculty")
		{
			faculty.GET("/", controllers.All[models.Faculty](db))
			faculty.POST("/", controllers.Create[models.Faculty](db))
			faculty.GET("/:id", controllers.Get[models.Faculty](db))
			faculty.PUT("/:id", controllers.Update[models.Faculty](db))
			faculty.DELETE("/:id", controllers.Delete[models.Faculty](db))
		}
		room := api.Group("/room")
		{
			room.GET("/", controllers.All[models.Room](db))
			room.POST("/", controllers.Create[models.Room](db))
			room.GET("/:id", controllers.Get[models.Room](db))
			room.PUT("/:id", controllers.Update[models.Room](db))
			room.DELETE("/:id", controllers.Delete[models.Room](db))
		}

		// WARNING: Experimental: Using generic controllers User and Timetable
		user := api.Group("/user")
		{
			user.GET("/", controllers.All[models.User](db))
			user.POST("/", controllers.Create[models.User](db))
			user.GET("/:id", controllers.Get[models.User](db))
			user.PUT("/:id", controllers.Update[models.User](db))
			user.DELETE("/:id", controllers.Delete[models.User](db))
		}
		timetable := api.Group("/timetable")
		{
			timetable.GET("/", controllers.All[models.Timetable](db))
			timetable.POST("/", controllers.Create[models.Timetable](db))
			timetable.GET("/:id", controllers.Get[models.Timetable](db))
			timetable.PUT("/:id", controllers.Update[models.Timetable](db))
			timetable.DELETE("/:id", controllers.Delete[models.Timetable](db))
		}
	}
}
