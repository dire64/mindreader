package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"

	_ "mindreader/web-service/docs"

	_ "github.com/lib/pq"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!MOVE TO A FILE THAT IS GITIGNORED LATER!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "1234"
	dbname   = "postgres"
)

var db *sql.DB

// Initalize the database.
func ConnectDatabase() {
	var err error

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("[POSTGRES] Failed to open database:", err)
	}

	// Check if the database is reachable
	if err := db.Ping(); err != nil {
		log.Fatal("[POSTGRES] Failed to connect to the database:", err)
	}

	fmt.Println("[POSTGRES] Successfully connected to database!")
}

// @title           MindReader Doctor API
// @version         1.0
// @description     API for retreiving professionals used on MindReader.
func main() {
	router := gin.Default()
	ConnectDatabase()
	defer db.Close()

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.GET("/professionals", getProfessionals)
	router.GET("/professionals/:city", getProfessionalsInCity)

	router.Run("localhost:8000")
}

// @Summary Get Professionals
// @Description Get all available professionals.
// @Tags professionals
// @Accept json
// @Produce json
// @Success 200 {object} professional
// @Failure 404 {object} ErrorResponse
// @Router /professionals/ [get]
// get all the professionals in the database as JSON.
func getProfessionals(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	rows, err := db.QueryContext(c, "SELECT * FROM professionals")
	if err != nil {
		errorResponse := ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		}
		c.JSON(http.StatusInternalServerError, errorResponse)
		panic(err)
	}
	defer rows.Close()

	var professionals []professional
	for rows.Next() {
		var p professional
		err := rows.Scan(&p.Id, &p.Name, &p.Address, &p.City)
		if err != nil {
			errorResponse := ErrorResponse{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			}
			c.JSON(http.StatusInternalServerError, errorResponse)
		}
		professionals = append(professionals, p)
	}

	err = rows.Err()
	if err != nil {
		errorResponse := ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		}
		c.JSON(http.StatusInternalServerError, errorResponse)
	}

	c.IndentedJSON(http.StatusOK, professionals)
}

// @Summary Get Professionals by City
// @Description Get all available professionals in a given city.
// @Tags professionals
// @Accept json
// @Produce json
// @Param city path string true "City"
// @Success 200 {array} professional
// @Failure 404 {object} ErrorResponse
// @Router /professionals/{city} [get]
func getProfessionalsInCity(c *gin.Context) {
	c.Header("Content-Type", "application/json")

	city := strings.ToLower(c.Param("city"))
	query := "SELECT * FROM professionals WHERE LOWER(city) = LOWER($1)"

	rows, err := db.QueryContext(c, query, city)
	if err != nil {
		errorResponse := ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		}
		c.JSON(http.StatusInternalServerError, errorResponse)
		panic(err)
	}
	defer rows.Close()

	var professionals []professional
	for rows.Next() {
		var p professional
		err := rows.Scan(&p.Id, &p.Name, &p.Address, &p.City)
		if err != nil {
			errorResponse := ErrorResponse{
				Code:    http.StatusInternalServerError,
				Message: err.Error(),
			}
			c.JSON(http.StatusInternalServerError, errorResponse)
		}
		professionals = append(professionals, p)
	}

	err = rows.Err()
	if err != nil {
		errorResponse := ErrorResponse{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		}
		c.JSON(http.StatusInternalServerError, errorResponse)
	}

	c.IndentedJSON(http.StatusOK, professionals)
}

// struct that responds to errors on endpoints.
type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// struct that represents a professional and their data.
type professional struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Address string `json:"address"`
	City    string `json:"city"`
}
