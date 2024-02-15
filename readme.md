# ya2ber

![maintenance](https://img.shields.io/maintenance/yes/2024.svg?style=flat)
![node-version](https://img.shields.io/badge/node-~18.18.2-brightgreen.svg?style=flat)
![npm-version](https://img.shields.io/badge/npm-~9.8.1-brightgreen.svg?style=flat)

CLI chat to just chat. No ads, no statistics collection, no special terms, no unknown third-party services, no spies, no tricky interfaces... no bullshit.

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

## Development

### Setup

#### Installation

```shell
git clone git@github.com:zhibirc/ya2ber.git

cd ya2ber

# it'll automatically install dependencies in all nested application folders
npm install
```

#### Pre-commit

We use [pre-commit](https://pre-commit.com/) for running code checks locally, just before committing, 
to ensure that all basic code requirements and policies were respected. Installation is pretty simple (one-time action):

```shell
# install pre-commit using Python's pip
pip install pre-commit
# OR
# install pre-commit using using Homebrew
brew install pre-commit

# install the Git hook scripts
pre-commit install
```

Now pre-commit will run automatically on `git commit`!
Configuration for pre-commit hooks is stored in `.pre-commit-config.yaml` file.

**pre-commit notes**

- If you want to skip all the pre-commit checks (not recommended!), you can add the `-n` parameter as follows:

```shell
git commit -m "commit message" -n
```

- Alternatively if you only want to skip some specific check, you can use `SKIP=<hook_id>` before the command:

```shell
SKIP=codespell git commit -m "commit message"
```

#### Storing secrets

Generally, it may be necessary to use some sensitive data, usually stored in environment variables, in application. For example, AWS keys. 
If so, it's important to remember that _any sensitive data shouldn't be leaked to the public_, including GitHub repository.

To accomplish this, create **.env.local** file (don't use .env file in this case) in the appropriate directory (client/ or server/), 
and put environment variables intended to be private there. This file is ignored by Git and excluded from Docker context on image build.

### Automation scripts

We use GNU [Make](https://www.gnu.org/software/make/) for automate operations related to source code and application deployment.

#### Available Make project-level commands

Get help/guide for all available commands.

```shell
make
```

```shell
make help
```
