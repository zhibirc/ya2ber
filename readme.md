# chyat

CLI chat to just chat. No ads, no statistics collection, no special terms, no unknown third-party services, no tricky interfaces... no bullshit.

## Features

1. Shows how many visitors are in the chat. Currently, this info is shown in PS1 prompt.
2. Chat members are notified when someone left.
3. There are 2 message categories/types - system (including ones from server) and just chat messages.
4. Client and server use JSON as data format for transmitting data to each other. [See](#json-message-schema) how.

## JSON message schema

Example of client's message:

```json
{
    "type": "message",
    "command": "/username",
    "message": "Hello, world!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
```

Example of server's message:

```json
{
    "type": "system",
    "online": 5,
    "token": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_a"
}
```
