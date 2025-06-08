package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(username string, role string) (string, error) {
	const tokenExpiry = 24 * 7 * time.Hour
	claims := &Claims{
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   username,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenExpiry)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("APP_JWT_SECRET")))
}

func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (any, error) {
		return []byte(os.Getenv("APP_JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	if claims, ok := token.Claims.(*Claims); ok {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
