# ya2ber

CLI chat to just chat. No ads, no statistics collection, no special terms, no unknown third-party services, no spies, no tricky interfaces... no bullshit.

## Features

- [x] Shows how many visitors are in the chat. Currently, this info is shown in PS1 prompt.
- [x] Chat members are notified when someone left.
- [x] There are 2 message categories/types - system (including ones from server) and just chat messages.
- [x] Client and server use JSON as data format for transmitting data to each other. [See](#json-message-schema) how.
- [ ] Entering password is masking by "*" and isn't stored in history.
- [ ] Server doesn't store _any_ message history. Instead, client could store history locally as an option.

## CLI options

## JSON message schema

Example of client's message:

```json
{
    "message": "Hello, world!",
    "type": "message",
    "command": "/username",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
```

Example of server's message:

```json
{
    "message": "someone left the chat",
    "type": "system",
    "online": 5,
    "token": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_a"
}
```
