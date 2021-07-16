package queue

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/streadway/amqp"
)

func Connect() *amqp.Channel {
	conn_string := fmt.Sprintf("amqp://%s:%s@%s:%s%s",
		os.Getenv("RABBITMQ_DEFAULT_USER"),
		os.Getenv("RABBITMQ_DEFAULT_PASS"),
		os.Getenv("RABBITMQ_DEFAULT_HOST"),
		os.Getenv("RABBITMQ_DEFAULT_PORT"),
		os.Getenv("RABBITMQ_DEFAULT_VHOST"),
	)
	conn, err := amqp.Dial(conn_string)
	if err != nil {
		log.Fatal(err)
	}

	channel, err := conn.Channel()
	if err != nil {
		log.Fatal(err)
	}

	return channel
}

func StartConsuming(input_channel chan []byte, channel *amqp.Channel) {
	queue, err := channel.QueueDeclare(
		os.Getenv("RABBITMQ_CONSUMER_QUEUE"),
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal(err)
	}

	messages, err := channel.Consume(
		queue.Name,
		"go-worker",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		for message := range messages {
			input_channel <- []byte(message.Body)
		}
		close(input_channel)
	}()

}

func Notify(payload string, channel *amqp.Channel) {
	err := channel.Publish(
		os.Getenv("RABBITMQ_DESTINATION_POSITIONS_EX"),
		os.Getenv("RABBITMQ_DESTINATION_ROUTING_KEY"),
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        []byte(payload),
		},
	)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%s message sent: %s%c", time.Now(), payload, 0xA)
}
