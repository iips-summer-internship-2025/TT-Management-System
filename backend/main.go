package main

import (
	"flag"
	"github.com/gin-gonic/gin"
	"github.com/robfig/cron/v3"
	"log"
	"os"
	"tms-server/controllers"
	"tms-server/config"
	"tms-server/migrations"
	"tms-server/routes"
)

func init() {
	config.LoadEnvVariables()
}

func main() {
	migrate := flag.Bool("migrate", false, "Run database migrations")
	flag.Parse()

	config.ConnectDB()

	if *migrate {
		if err := migrations.Migrate(); err != nil {
			log.Fatalf("Migration failed: %v", err)
		}
		log.Println("Migrations completed. Exiting.")
		return
	}

	r := gin.Default()
	routes.RegisterRoutes(r)

	//added cron job
	c := cron.New()
		c.AddFunc("45 23 * * *", controllers.LoadNextDaySessions) // runs daily at 11:45 PM
		c.Start()
	
	port := os.Getenv("APP_PORT")
	r.Run(":" + port)
}
