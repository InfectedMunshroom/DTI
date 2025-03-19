package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collection *mongo.Collection

// Student Profile Struct
type Profile struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Email    string   `json:"email"`
	Phone    string   `json:"phone"`
	Skills   []string `json:"skills"`
	Projects []string `json:"projects"`
}

// Connect to MongoDB
func connectDB() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	collection = client.Database("ProfileDB").Collection("profiles")
}

// Fetch Profile by ID
func getProfile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	var profile Profile
	err := collection.FindOne(context.TODO(), bson.M{"id": id}).Decode(&profile)
	if err != nil {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(profile)
}

// Create a New Profile
func createProfile(w http.ResponseWriter, r *http.Request) {
	var profile Profile
	json.NewDecoder(r.Body).Decode(&profile)

	_, err := collection.InsertOne(context.TODO(), profile)
	if err != nil {
		http.Error(w, "Error saving profile", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(profile)
}

func main() {
	connectDB()

	r := mux.NewRouter()

	r.HandleFunc("/profile/{id}", getProfile).Methods("GET")
	r.HandleFunc("/profile", createProfile).Methods("POST")
	log.Fatal(http.ListenAndServe(":8080", cors.AllowAll().Handler(r)))

	log.Println("Server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
