package routes

import (
	"tms-server/controllers"
	"tms-server/middleware"
	"your_project/handlers"

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

func LogoutRoutes() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/logout", handlers.LogoutHandler).Methods("POST")
	return r
}