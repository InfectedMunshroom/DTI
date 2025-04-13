package admin

import (
	"backend/auth"
	"context"
	"encoding/json"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// PostRequest struct (for frontend request)
type PostRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

// Post struct (for storing in MongoDB)
type Post struct {
	State          string    `bson:"state"`
	PublisherEmail string    `bson:"publisher_email"`
	PublisherName  string    `bson:"publisher_name"`
	Title          string    `bson:"title"`
	Description    string    `bson:"description"`
	CreatedAt      time.Time `bson:"created_at"`
	Database       string    `bson:"database"`
}

func DeletePostHandler(client *mongo.Client, jwtKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Extract JWT token
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

		// Parse request body
		var req struct {
			ID       string `json:"id"`
			Database string `json:"database"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		collection := client.Database(req.Database).Collection("active_post")

		objectID, err := primitive.ObjectIDFromHex(req.ID)

		if err != nil {

			http.Error(w, "Invalid post ID", http.StatusBadRequest)

			return

		}

		filter := bson.M{

			"_id": objectID,

			"publisher_email": claims.Email,
		}

		res, err := collection.DeleteOne(context.TODO(), filter)
		if err != nil {
			http.Error(w, "Failed to delete post", http.StatusInternalServerError)
			return
		}
		if res.DeletedCount == 0 {
			http.Error(w, "Post not found or unauthorized", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "Post deleted successfully"})
	}
}
