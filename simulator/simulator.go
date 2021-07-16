package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/LuizEduardoCardozo/codelivery/simulator/entities"
	"github.com/LuizEduardoCardozo/codelivery/simulator/queue"
	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
)

var active []string

const ONE_SECOND time.Duration = 1 * time.Second

/*
	the init function is executed after the main function
*/

// Loads the .env file
func init() {
	err := godotenv.Load()
	if err != nil {
		panic("cannot load .env file")
	}
}

func SimulatorWorker(order entities.Order, channel *amqp.Channel) {
	destinations_file, err := os.Open(
		fmt.Sprintf("destinations/%s.txt",
			order.Destination),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer destinations_file.Close()

	scanner := bufio.NewScanner(destinations_file)

	for scanner.Scan() {
		destination_file_line := scanner.Text()
		data := strings.Split(destination_file_line, ",")

		destination_json := DestinationToJson(order.Uuid, data[0], data[1])

		time.Sleep(ONE_SECOND)
		queue.Notify(string(destination_json), channel)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	destination_json := DestinationToJson(order.Uuid, "0", "0")
	time.Sleep(ONE_SECOND)
	queue.Notify(string(destination_json), channel)
}

func DestinationToJson(orderUuid string, lat string, lng string) []byte {
	destinationEntity := entities.Destination{
		Order: orderUuid,
		Lat:   lat,
		Lng:   lng,
	}

	destinationJson, err := json.Marshal(destinationEntity)
	if err != nil {
		log.Fatal(err)
	}

	return destinationJson
}

func IsInSlice(entity string, entity_slice []string) bool {
	for _, e := range entity_slice {
		if entity == e {
			return true
		}
	}
	return false
}

func start(order entities.Order, channel *amqp.Channel) {
	if !IsInSlice(order.Uuid, active) {
		active = append(active, order.Uuid)
		go SimulatorWorker(order, channel)
	} else {
		fmt.Printf("the order %s was already complete, or is on going", order.Uuid)
	}
}

func main() {

	// creating the input channel
	input_channel := make(chan []byte)

	channel := queue.Connect()
	queue.StartConsuming(input_channel, channel)

	for message := range input_channel {
		var order entities.Order

		err := json.Unmarshal(message, &order)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("new order received: %s\n", order.Uuid)

		start(order, channel)

	}

}
