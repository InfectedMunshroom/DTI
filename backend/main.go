package main

import (
	"backend/common"
	"backend/middleware"
	"backend/poster"
	"backend/student"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var jwtKey = []byte("your-secret-key")

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	Email string `json:"email"`
	Role  string `json:"role"`
}

type Claims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

var client *mongo.Client

func main() {
	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	var err error
	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Create a new router
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/login", middleware.EnableCORS(loginHandler)).Methods("POST")
	r.HandleFunc("/profile", middleware.EnableCORS(profileHandler)).Methods("GET")

	r.HandleFunc("/student/profile", middleware.EnableCORS(student.GetStudentProfile(client, jwtKey))).Methods("GET")
	r.HandleFunc("/poster/profile", middleware.EnableCORS(poster.GetPosterProfile(client, jwtKey))).Methods("GET")

	r.HandleFunc("/student/community", middleware.EnableCORS(common.FetchActivePosts(client))).Methods("GET")

	// ✅ Fix: Use mux for dynamic ID route
	r.HandleFunc("/student/community/event/{id}", middleware.EnableCORS(common.GetEventByID(client))).Methods("GET")

	// Start the server
	log.Println("Server running on port 8080")
	http.ListenAndServe(":8080", r)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Login attempt received")

	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		log.Println("Error decoding JSON:", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	log.Println("Received credentials - Email:", creds.Email)

	collection := client.Database("mainDB").Collection("users")
	var result User
	err = collection.FindOne(context.TODO(), bson.M{"email": creds.Email, "password": creds.Password}).Decode(&result)

	if err != nil {
		log.Println("User not found or incorrect password:", err)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	log.Println("User authenticated - Email:", result.Email, "Role:", result.Role)

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email: result.Email,
		Role:  result.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		log.Println("Error generating token:", err)
		http.Error(w, "Could not generate token", http.StatusInternalServerError)
		return
	}

	log.Println("Token generated successfully for:", result.Email)

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  expirationTime,
		HttpOnly: true,
	})

	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}

// Profile Handler (Protected)
func profileHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(cookie.Value, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !tkn.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"email": claims.Email,
		"role":  claims.Role,
	})
}
