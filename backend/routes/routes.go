package routes

import (
	"tms-server/config"
	"tms-server/controllers"
	"tms-server/middleware"
	"tms-server/models"
	"your_project/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.Use(middleware.CORSMiddleware())

	db := config.DB
	api := r.Group("/api/v1")
	{
		api.GET("/ping", controllers.Ping)
		api.POST("/login", controllers.Login)

		// INFO: Protected routes
		api.Use(middleware.JWTAuthMiddleware())
		course := api.Group("/course")
		{
			course.GET("", controllers.All[models.Course](db))
			course.POST("", controllers.Create[models.Course](db))
			course.GET("/:id", controllers.Get[models.Course](db))
			course.PUT("/:id", controllers.Update[models.Course](db))
			course.DELETE("/:id", controllers.Delete[models.Course](db))
		}
		subject := api.Group("/subject")
		{
			subject.GET("", controllers.All[models.Subject](db))
			subject.POST("", controllers.Create[models.Subject](db))
			subject.GET("/:id", controllers.Get[models.Subject](db))
			subject.PUT("/:id", controllers.Update[models.Subject](db))
			subject.DELETE("/:id", controllers.Delete[models.Subject](db))
		}
		faculty := api.Group("/faculty")
		{
			faculty.GET("", controllers.All[models.Faculty](db))
			faculty.POST("", controllers.Create[models.Faculty](db))
			faculty.GET("/:id", controllers.Get[models.Faculty](db))
			faculty.PUT("/:id", controllers.Update[models.Faculty](db))
			faculty.DELETE("/:id", controllers.Delete[models.Faculty](db))
		}
		room := api.Group("/room")
		{
			room.GET("", controllers.All[models.Room](db))
			room.POST("", controllers.Create[models.Room](db))
			room.GET("/:id", controllers.Get[models.Room](db))
			room.PUT("/:id", controllers.Update[models.Room](db))
			room.DELETE("/:id", controllers.Delete[models.Room](db))
		}

		// WARNING: Experimental: Using generic controllers User and Lecture
		user := api.Group("/user")
		{
			user.GET("", controllers.All[models.User](db))
			user.POST("", controllers.Create[models.User](db))
			user.GET("/:id", controllers.Get[models.User](db))
			user.PUT("/:id", controllers.Update[models.User](db))
			user.DELETE("/:id", controllers.Delete[models.User](db))
		}
		timetable := api.Group("/lecture")
		{
			timetable.GET("", controllers.All[models.Lecture](db))
			timetable.POST("", controllers.Create[models.Lecture](db))
			timetable.GET("/:id", controllers.Get[models.Lecture](db))
			timetable.PUT("/:id", controllers.Update[models.Lecture](db))
			timetable.DELETE("/:id", controllers.Delete[models.Lecture](db))
		}
	}
}

func LogoutRoutes() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/logout", handlers.LogoutHandler).Methods("POST")
	return r
}