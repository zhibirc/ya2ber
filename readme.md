# ya2ber

CLI chat to just chat. No ads, no statistics collection, no special terms, no unknown third-party services, no spies, no tricky interfaces... no bullshit.

![Maintenance](https://img.shields.io/maintenance/yes/2022)

---

## Etymology

**ya2ber** is just derived from _yabber_, which is the synonym for _jabber_, which is the synonym for usual _talk_.

## Features

- [x] Authentication based on login and password.
- [x] Shows how many visitors are in the chat. Currently, this info is shown in PS1 prompt.
- [x] Chat members are notified when someone left.
- [x] There are 3 message categories/types - system (including ones from server), authentication purposed and just chat messages.
- [x] Client and server use JSON as data format for transmitting data to each other. [See](#json-message-schema) how.
- [x] Entering of password is hidden (like many other CLI applications do, including `sudo`) and isn't stored in history.
- [x] Authentication errors are well recognized because of verbose error messages.
- [x] Client doesn't contain any validation logic for user credentials, this a server's responsibility.
- [x] Server stores such specific user data: registration date, last activity date and last used IP address.<sup>*</sup>
- [ ] Server doesn't store _any_ message history. Instead, client could store history locally as an option.
- [ ] Prevention of _typosquatting_ in usernames.
- [ ] Rework UI for using [blessed](https://github.com/chjj/blessed) curses-like library
- [ ] [libsignal](https://github.com/signalapp/libsignal) library is used for communication encryption

`*` actually, server stores last login date rather than last activity date for now

## CLI options

## JSON message schema

Example of client's message:

```json
{
    "message": "Hello, username!",
    "type": "message",
    "command": "/username"
}
```

Example of server's message:

```json
{
    "message": "username left the chat",
    "type": "system",
    "online": 5
}
```
