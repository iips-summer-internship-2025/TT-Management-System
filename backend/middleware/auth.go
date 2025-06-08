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
		c.Set("role", claims.Role)
		c.Next()
	}
}

func RequireRoles(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Role not found in token"})
			c.Abort()
			return
		}

		for _, role := range roles {
			if role == userRole.(string) {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		c.Abort()
	}
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// Clear the JWT cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "token", // match the name used in login
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // change to true in production with HTTPS
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1, // immediately expire
	})

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message":"Logged out successfully"}`))
}
