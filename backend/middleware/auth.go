package middleware

import (
	"net/http"
	"tms-server/utils"

	"github.com/gin-gonic/gin"
)

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("auth_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token not found"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		c.Set("username", claims.Subject)
		c.Next()
	}
}
