package utils

import (
	"errors"
	"tms-server/config"
	"tms-server/models"

	"golang.org/x/crypto/bcrypt"
)

// AuthenticateUser checks if username exists in database
func AuthenticateUser(username string) (*models.User, error) {
	var user models.User

	if err := config.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, errors.New("invalid username or password")
	}

	return &user, nil
}

// HashPassword hashes the password using bcrypt
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// CheckPassword compares a password against a hash
func CheckPassword(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}
