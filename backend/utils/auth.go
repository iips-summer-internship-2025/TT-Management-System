package utils

import (
	"errors"
	"tms-server/config"
	"tms-server/models"

	"golang.org/x/crypto/bcrypt"
)

// TODO: hash password with bcrypt
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// TODO: implement proper password comparison
func CheckPassword(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

// AuthenticateUser checks if username exists and password matches
func AuthenticateUser(username, password string) (*models.User, error) {
	var user models.User

	if err := config.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, errors.New("invalid username or password")
	}

	if err := CheckPassword(password, user.Password); err != nil {
		return nil, errors.New("invalid username or password")
	}

	return &user, nil
}
