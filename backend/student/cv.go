package student

import (
	"backend/auth"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func UploadCV(client *mongo.Client, jwtKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate JWT token
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

		// Ensure the user is a student
		if claims.Role != "student" {
			http.Error(w, "Forbidden: Only students can upload CVs", http.StatusForbidden)
			return
		}

		// Set MongoDB context with timeout
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// Fetch student _id from MongoDB
		collection := client.Database("student").Collection("profile_data")
		var result struct {
			ID primitive.ObjectID `bson:"_id"`
		}

		err = collection.FindOne(ctx, bson.M{"email": claims.Email}).Decode(&result)
		if err != nil {
			http.Error(w, "Profile not found", http.StatusNotFound)
			return
		}

		// Convert ObjectID to string
		studentID := result.ID.Hex() // Convert ObjectID to string

		// Parse uploaded file
		file, header, err := r.FormFile("cv")
		if err != nil {
			http.Error(w, "Failed to read file", http.StatusBadRequest)
			return
		}
		defer file.Close()

		// Ensure it's a PDF
		if filepath.Ext(header.Filename) != ".pdf" {
			http.Error(w, "Only PDF files are allowed", http.StatusBadRequest)
			return
		}

		// Save file to Linux OS storage
		savePath := fmt.Sprintf("/var/www/student_cvs/%s.pdf", studentID)
		outFile, err := os.Create(savePath)
		if err != nil {
			http.Error(w, "Failed to save file", http.StatusInternalServerError)
			return
		}
		defer outFile.Close()

		_, err = io.Copy(outFile, file)
		if err != nil {
			http.Error(w, "Error saving file", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("File uploaded successfully"))
	}
}

func CheckCVStatus(client *mongo.Client, jwtKey []byte) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Validate JWT token
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

		// Get student _id from MongoDB
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		collection := client.Database("student").Collection("profile_data")
		var result struct {
			ID primitive.ObjectID `bson:"_id"`
		}

		err = collection.FindOne(ctx, bson.M{"email": claims.Email}).Decode(&result)
		if err != nil {
			http.Error(w, "Profile not found", http.StatusNotFound)
			return
		}

		// Check if CV file exists
		cvPath := fmt.Sprintf("/var/www/student_cvs/%s.pdf", result.ID.Hex())
		if _, err := os.Stat(cvPath); os.IsNotExist(err) {
			// File does not exist
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"cvExists": false}`))
			return
		}

		// File exists
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"cvExists": true}`))
	}
}
