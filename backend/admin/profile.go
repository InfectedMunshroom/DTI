package student

import (
	"backend/auth"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type StudentProfile struct {
	Name     string   `json:"name"`
	Email    string   `json:"email"`
	Phone    string   `json:"phone"`
	Branch   string   `json:"branch"`
	Semester string   `json:"semester"`
	Skills   []string `json:"skills"`
	Projects []string `json:"projects"`
}

func GetStudentProfile(client *mongo.Client, jwtKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get JWT token from cookie
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "Unauthorized: No token provided", http.StatusUnauthorized)
			return
		}

		// Validate the JWT token and extract claims
		claims, err := auth.ValidateToken(cookie.Value, jwtKey)
		if err != nil {
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		// Ensure the user is a student
		if claims.Role != "student" {
			http.Error(w, "Forbidden: Only students can access this", http.StatusForbidden)
			return
		}

		// Fetch student profile from MongoDB using email from token
		collection := client.Database("student").Collection("profile_data")
		var profile StudentProfile
		err = collection.FindOne(context.TODO(), bson.M{"email": claims.Email}).Decode(&profile)
		if err != nil {
			http.Error(w, "Profile not found", http.StatusNotFound)
			fmt.Printf("Profile with email %s is not found\n", claims.Email)
			fmt.Println(err)
			return
		}

		// Return profile data
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(profile)
	}
}
