package poster

import (
	"backend/auth"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type PosterProfile struct {
	Name        string `json:"name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Designation string `json:"designation"`
	ID_Number   string `json:"id_number"`
	School      string `json:"school"`
}

func GetPosterProfile(client *mongo.Client, jwtKey []byte) http.HandlerFunc {
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
		if claims.Role != "poster" {
			http.Error(w, "Forbidden: Only Posters can access this", http.StatusForbidden)
			fmt.Printf("%s is not allowed to access this resource")
			return
		}

		// Fetch student profile from MongoDB using email from token
		collection := client.Database("poster").Collection("profile_data")
		var profile PosterProfile
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
