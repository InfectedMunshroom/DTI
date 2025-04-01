package auth

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("your-secret-key")

type Claims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

func ValidateToken(tokenString string, jwtKey []byte) (*Claims, error) {
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !tkn.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}
