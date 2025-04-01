package common

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetEventByID(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		params := mux.Vars(r)
		eventID := params["id"]
		fmt.Println("Received Event ID:", eventID) // Debugging

		// Ensure eventID is not empty
		if eventID == "" {
			fmt.Println("Missing Event ID!") // Debugging
			http.Error(w, "Event ID is missing", http.StatusBadRequest)
			return
		}

		// Convert eventID from string to ObjectID
		objID, err := primitive.ObjectIDFromHex(eventID)
		if err != nil {
			fmt.Println("Invalid Event ID:", eventID) // Debugging
			http.Error(w, "Invalid event ID", http.StatusBadRequest)
			return
		}

		// Connect to MongoDB collection
		collection := client.Database("studentCommunity").Collection("active_post")

		// Find the event by ObjectID
		var event bson.M
		err = collection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&event)
		if err != nil {
			log.Println("MongoDB Query Error:", err) // Debugging
			fmt.Println("Event not found:", eventID) // Debugging
			http.Error(w, "Event not found", http.StatusNotFound)
			return
		}

		fmt.Println("Event Found:", event) // Debugging
		json.NewEncoder(w).Encode(event)
	}
}
