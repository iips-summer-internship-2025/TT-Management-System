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

		api.Use(middleware.JWTAuthMiddleware())
		api.POST("/logout", controllers.Logout)

		adminOnly := api.Group("")
		adminOnly.Use(middleware.RequireRoles("admin"))
		{
			user := adminOnly.Group("/user")
			{
				user.GET("", controllers.All[models.User](db))
				user.POST("", controllers.Create[models.User](db))
				user.GET("/:id", controllers.Get[models.User](db))
				user.PUT("/:id", controllers.Update[models.User](db))
				user.DELETE("/:id", controllers.Delete[models.User](db))
			}

			course := adminOnly.Group("/course")
			{
				course.POST("", controllers.Create[models.Course](db))
				course.PUT("/:id", controllers.Update[models.Course](db))
				course.DELETE("/:id", controllers.Delete[models.Course](db))
			}

			subject := adminOnly.Group("/subject")
			{
				subject.POST("", controllers.Create[models.Subject](db))
				subject.PUT("/:id", controllers.Update[models.Subject](db))
				subject.DELETE("/:id", controllers.Delete[models.Subject](db))
			}

			faculty := adminOnly.Group("/faculty")
			{
				faculty.POST("", controllers.Create[models.Faculty](db))
				faculty.PUT("/:id", controllers.Update[models.Faculty](db))
				faculty.DELETE("/:id", controllers.Delete[models.Faculty](db))
			}

			room := adminOnly.Group("/room")
			{
				room.POST("", controllers.Create[models.Room](db))
				room.PUT("/:id", controllers.Update[models.Room](db))
				room.DELETE("/:id", controllers.Delete[models.Room](db))
			}

			batch := adminOnly.Group("/batch")
			{
				batch.POST("", controllers.Create[models.Batch](db))
				batch.PUT("/:id", controllers.Update[models.Batch](db))
				batch.DELETE("/:id", controllers.Delete[models.Batch](db))
			}
		}

		// Routes accessible by both admin and faculty
		course := api.Group("/course")
		{
			course.GET("", controllers.All[models.Course](db))
			course.GET("/:id", controllers.Get[models.Course](db))
		}

		subject := api.Group("/subject")
		{
			subject.GET("", controllers.All[models.Subject](db))
			subject.GET("/:id", controllers.Get[models.Subject](db))
		}

		faculty := api.Group("/faculty")
		{
			faculty.GET("", controllers.All[models.Faculty](db))
			faculty.GET("/:id", controllers.Get[models.Faculty](db))
		}

		room := api.Group("/room")
		{
			room.GET("", controllers.All[models.Room](db))
			room.GET("/:id", controllers.Get[models.Room](db))
		}

		batch := api.Group("/batch")
		{
			batch.GET("", controllers.All[models.Batch](db))
			batch.GET("/:id", controllers.Get[models.Batch](db))
		}

		lecture := api.Group("/lecture")
		{
			lecture.GET("", controllers.FilteredLectures(db))
			lecture.GET("/:id", controllers.Get[models.Lecture](db))
			lecture.POST("", controllers.Create[models.Lecture](db))
			lecture.PUT("/:id", controllers.Update[models.Lecture](db))
			lecture.DELETE("/:id", controllers.Delete[models.Lecture](db))
		}

		session := api.Group("/session")
		{
			session.GET("", controllers.All[models.Session](db))
			session.GET("/:id", controllers.Get[models.Session](db))
			session.POST("", controllers.Create[models.Session](db))
			session.PUT("/:id", controllers.Update[models.Session](db))
			session.DELETE("/:id", controllers.Delete[models.Session](db))
		}

		calendar := api.Group("/calendar")
		{
			calendar.GET("/", controllers.GetCalendarSummaryByDate)
		}
	}
}
