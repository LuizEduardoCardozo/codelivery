FROM golang:1.15.14-alpine3.13 AS builder

WORKDIR /app

COPY . ./

RUN apk add git

RUN go get . && go build

FROM alpine:3.13 AS runner

WORKDIR /app

COPY --from=builder /app/simulator ./

CMD ./simulator
