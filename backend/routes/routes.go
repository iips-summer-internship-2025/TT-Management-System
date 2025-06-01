package routes

import (
	"tms-server/controllers"
	"tms-server/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong! TMS-server is up"})
	})

	r.POST("/login", controllers.Login)

	r.Use(middleware.JWTAuthMiddleware())

	// TODO: protected routes

	auth := r.Group("/")

	// Faculty routes
	faculty := auth.Group("/faculty")
	{
		faculty.GET("/", controllers.GetAllFaculty)
		faculty.GET("/:id", controllers.GetFacultyByID)
		faculty.POST("/", controllers.CreateFaculty)
		faculty.PUT("/:id", controllers.UpdateFaculty)
		faculty.DELETE("/:id", controllers.DeleteFaculty)
	}

	// //Courses routes
	// courses := auth.Group("/courses")
	// {
	// courses.GET("/", controllers.GetAllCourses)
	// courses.GET("/:id", controllers.GetByCoursesID)
	// courses.POST("/", controllers.CreateCourses)
	// courses.PUT("/:id", controllers.UpdateCourses)
	// courses.DELETE("/:id", controllers.DeleteCourses)
	// }

	rooms := auth.Group("/rooms")
	{
		rooms.GET("/", controllers.GetAllRooms)
		rooms.GET("/:id", controllers.GetRoomByID)
		rooms.POST("/", controllers.CreateRoom)
		rooms.PUT("/:id", controllers.UpdateRoom)
		rooms.DELETE("/:id", controllers.DeleteRoom)
	}

	//   subjects := auth.Group("/subjects")
	// 		{
	// 			subjects.GET("/", controllers.GetAllSubjects)
	// 			subjects.GET("/:id", controllers.GetSubjectByID)
	// 			subjects.POST("/", controllers.CreateSubject)
	// 			subjects.PUT("/:id", controllers.UpdateSubject)
	// 			subjects.DELETE("/:id", controllers.DeleteSubject)
	// 		}

	//  timetable := auth.Group("/timetable")
	// 	{
	// 		timetable.GET("/", controllers.GetAllTimetables)
	// 		timetable.GET("/:id", controllers.GetTimetableByID)
	// 		timetable.POST("/", controllers.CreateTimetable)
	// 		timetable.PUT("/:id", controllers.UpdateTimetable)
	// 		timetable.DELETE("/:id", controllers.DeleteTimetable)
	// 	}

}
