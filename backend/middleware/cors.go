package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
<<<<<<< HEAD
		AllowOrigins:     []string{"http://localhost:5173"},
=======
		AllowOrigins:     []string{"http://localhost:8080"},
>>>>>>> c678819 (cookie issue resolve)
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}
