package main

import (
	"github.com/gin-gonic/gin"
	"os"
	"tms-server/config"
	"tms-server/routes"
)

func init() {
	config.LoadEnvVariables()
	config.ConnectDB()
}

func main() {
	r := gin.Default()
	routes.RegisterRoutes(r)

	port := os.Getenv("PORT")
	r.Run(":" + port)
}
