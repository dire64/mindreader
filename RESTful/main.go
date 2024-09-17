package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// struct that represents a professional and their data.
type professional struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Address string `json:"address"`
	City    string `json:"city"`
}

// temporary data, and stuff.
var professionals = []professional{
	{ID: "1", Name: "Mr. Gopher", Address: "123 Main Street", City: "Brampton"},
	{ID: "2", Name: "Ms. Gopher", Address: "456 Doctor Road", City: "Toronto"},
}

func main() {
	router := gin.Default()
	router.GET("/professionals", getProfessionals)
	router.GET("/professionals/:city", getProfessionalsInCity)

	router.Run("localhost:8000")
}

// get all the professionals in the database as JSON.
func getProfessionals(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, professionals)
}

func getProfessionalsInCity(c *gin.Context) {
	city := strings.ToLower(c.Param("city"))

	var profs []professional

	for _, professional := range professionals {
		if strings.ToLower(professional.City) == city {
			profs = append(profs, professional)
		}
	}

	c.IndentedJSON(http.StatusOK, profs)
}
