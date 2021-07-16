package entities

type Order struct {
	Uuid        string `json:"order"`
	Destination string `json:"destination"`
}
