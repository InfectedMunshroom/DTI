package student

import (
	"backend/auth"
	"context"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// PostRequest struct (for frontend request)
type PostRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// Post struct (for storing in MongoDB)
type Post struct {
	State          string    `bson:"state"`
	PublisherEmail string    `bson:"publisher_email"`
	PublisherName  string    `bson:"publisher_name"`
	Title          string    `bson:"title"`
	Description    string    `bson:"description"`
	CreatedAt      time.Time `bson:"created_at"`
}

func CreatePostHandler(client *mongo.Client, jwtKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		// Extract JWT token from cookie
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "Unauthorized: No token provided", http.StatusUnauthorized)
			return
		}

		// Validate JWT token and extract claims
		claims, err := auth.ValidateToken(cookie.Value, jwtKey)
		if err != nil {
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		// Ensure the user is a student
		if claims.Role != "student" {
			http.Error(w, "Forbidden: Only students can create posts", http.StatusForbidden)
			return
		}

		// Fetch student profile using email
		collection := client.Database("student").Collection("profile_data")
		var student StudentProfile
		err = collection.FindOne(context.TODO(), bson.M{"email": claims.Email}).Decode(&student)
		if err != nil {
			http.Error(w, "Profile not found", http.StatusNotFound)
			return
		}

		// Parse request body
		var postReq PostRequest
		err = json.NewDecoder(r.Body).Decode(&postReq)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Create post object
		post := Post{
			State:          "Active",
			PublisherEmail: student.Email,
			PublisherName:  student.Name,
			Title:          postReq.Title,
			Description:    postReq.Description,
			CreatedAt:      time.Now(),
		}

		// Insert into studentCommunity.active_post collection
		_, err = client.Database("studentCommunity").Collection("active_post").InsertOne(context.TODO(), post)
		if err != nil {
			http.Error(w, "Failed to save post", http.StatusInternalServerError)
			return
		}

		// Success response
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"message": "Post created successfully!"})
	}
}

func GetMyPostsHandler(client *mongo.Client, jwtKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "Unauthorized: No token provided", http.StatusUnauthorized)
			return
		}

		claims, err := auth.ValidateToken(cookie.Value, jwtKey)
		if err != nil {
			http.Error(w, "Unauthorized: Invalid token", http.StatusUnauthorized)
			return
		}

		if claims.Role != "student" {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return
		}

		collection := client.Database("studentCommunity").Collection("active_post")
		filter := bson.M{"publisher_email": claims.Email}

		cursor, err := collection.Find(context.TODO(), filter)
		if err != nil {
			http.Error(w, "Error fetching posts", http.StatusInternalServerError)
			return
		}
		defer cursor.Close(context.TODO())

		var posts []bson.M
		if err = cursor.All(context.TODO(), &posts); err != nil {
			http.Error(w, "Error decoding posts", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(posts)
	}
}
