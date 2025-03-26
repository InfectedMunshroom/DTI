package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

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
		log.Fatal("MongoDB connection error:", err)
	}
	collection = client.Database("ProfileDB").Collection("profiles")
	log.Println("✅ Connected to MongoDB")
}

// Fetch Profile by ID
func getProfile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]

	var profile Profile
	filter := bson.M{"id": id}

	err := collection.FindOne(context.TODO(), filter).Decode(&profile)
	if err != nil {
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

// Serve Next.js Static Files
func serveStaticFiles(nextDir string) http.Handler {
	fs := http.FileServer(http.Dir(nextDir))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(nextDir, r.URL.Path)
		_, err := os.Stat(path)
		if os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(nextDir, "index.html"))
			return
		}
		fs.ServeHTTP(w, r)
	})
}

func main() {
	// Define flags for IP and Port
	ip := flag.String("ip", "0.0.0.0", "IP address to bind the server")
	port := flag.String("port", "8080", "Port number to run the server")
	flag.Parse()

	// Connect to MongoDB
	connectDB()

	// Set up router
	r := mux.NewRouter()

	// API Routes
	r.HandleFunc("/profile/{id}", getProfile).Methods("GET")

	// Serve Next.js exported files
	nextDir := "/mnt/Disk_2/DTI/dti/out"
	r.PathPrefix("/").Handler(serveStaticFiles(nextDir))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://10.12.108.251:8080"}, // ✅ Allow frontend IP
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
	})

	// Start server with flags
	address := fmt.Sprintf("%s:%s", *ip, *port)
	log.Printf("🚀 Server running at http://%s\n", address)
	log.Fatal(http.ListenAndServe(address, c.Handler(r)))
}
