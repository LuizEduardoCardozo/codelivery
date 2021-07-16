FROM golang:1.15.14-alpine3.13 AS builder

WORKDIR /app

COPY driver.go go.mod go.sum ./

RUN go get .
RUN go build

FROM alpine:3.13 AS runner

WORKDIR /app

COPY --from=builder /app/drivers ./
COPY drivers.json ./

CMD ./drivers
