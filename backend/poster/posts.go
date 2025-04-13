package poster

import (
	"backend/auth"
	"context"
	"encoding/json"
	"fmt"
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

		// Fetch student profile using email
		collection := client.Database("poster").Collection("profile_data")
		var poster PosterProfile
		err = collection.FindOne(context.TODO(), bson.M{"email": claims.Email}).Decode(&poster)
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
		database := postReq.Category
		// Create post object
		post := Post{
			State:          "Active",
			PublisherEmail: poster.Email,
			PublisherName:  poster.Name,
			Title:          postReq.Title,
			Description:    postReq.Description,
			CreatedAt:      time.Now(),
			Database:       database,
		}

		fmt.Printf("Creating a post at: %s\n", database)

		// Insert into studentCommunity.active_post collection
		_, err = client.Database(database).Collection("active_post").InsertOne(context.TODO(), post)
		if err != nil {
			http.Error(w, "Failed to save post", http.StatusInternalServerError)
			fmt.Printf("err: %v\n", err)
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

		var posts []bson.M

		database := []string{"researchPage", "internPage", "hatcheryPage"}

		for _, collName := range database {
			fmt.Printf("Searching for posts for %s in %s\n", claims.Email, collName)
			collection := client.Database(collName).Collection("active_post")
			filter := bson.M{"publisher_email": claims.Email}

			cursor, err := collection.Find(context.TODO(), filter)
			if err != nil {
				http.Error(w, "Error fetching posts from "+collName, http.StatusInternalServerError)
				return
			}
			defer cursor.Close(context.TODO())

			var singlePost []bson.M
			if err := cursor.All(context.TODO(), &singlePost); err != nil {
				http.Error(w, "Error decoding posts from "+collName, http.StatusInternalServerError)
				return
			}

			posts = append(posts, singlePost...)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(posts)
	}
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
