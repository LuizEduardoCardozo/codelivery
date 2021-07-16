package main

import (
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func ReadDrivers(drivers_file_name string) []byte {

	drivers_file, err := os.Open(drivers_file_name)

	if err != nil {
		panic(err.Error())
	}
	defer drivers_file.Close()

	drivers_names, err := ioutil.ReadAll(drivers_file)
	if err != nil {
		panic(err.Error())
	}

	return drivers_names
}

func HandleDrivers(w http.ResponseWriter, r *http.Request) {
	drivers_names := ReadDrivers("drivers.json")
	w.Write(drivers_names)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/drivers", HandleDrivers)
	http.ListenAndServe(":8080", r)
}
