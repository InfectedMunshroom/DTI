package common

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// FetchActivePosts fetches active posts with pagination
func FetchActivePosts(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse query parameters
		page, _ := strconv.Atoi(r.URL.Query().Get("page"))
		limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

		if page < 1 {
			page = 1
		}
		if limit < 1 {
			limit = 10
		}

		skip := (page - 1) * limit

		// MongoDB query
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		collection := client.Database("studentCommunity").Collection("active_post")

		filter := bson.M{"state": "Active"}
		opts := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))

		cursor, err := collection.Find(ctx, filter, opts)
		if err != nil {
			http.Error(w, "Database query error", http.StatusInternalServerError)
			return
		}
		defer cursor.Close(ctx)

		var posts []bson.M
		if err = cursor.All(ctx, &posts); err != nil {
			http.Error(w, "Error reading results", http.StatusInternalServerError)
			return
		}

		// Return JSON response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(posts)
	}
}
