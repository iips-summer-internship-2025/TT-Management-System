package middleware

import (
	"github.com/gin-gonic/gin"
)

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// TODO: AuthMiddleware
		// 1. Check token
		// 2. Abort if invalid
		// 3. Pass request if valid
	}
}
