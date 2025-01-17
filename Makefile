.PHONY: help clean lint lint-fix run
.DEFAULT_GOAL := help

ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# colors
GREEN  := $(shell tput -Txterm setaf 2)
WHITE  := $(shell tput -Txterm setaf 7)
YELLOW := $(shell tput -Txterm setaf 3)
RED    := $(shell tput -Txterm setaf 1)
RESET  := $(shell tput -Txterm sgr0)

HELP = \
    %help; \
    while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
    print "Usage: make [target]\n\n"; \
    for (sort keys %help) { \
    print "${WHITE}$$_:${RESET}\n"; \
    for (@{$$help{$$_}}) { \
    $$sep = " " x (32 - length $$_->[0]); \
    print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
    }; \
    print "\n"; }

help: ##@Commands Show this help
	@perl -e '$(HELP)' $(MAKEFILE_LIST)

clean: ##@Commands Delete artifacts from host machine
	@echo 'Cleaned ✅'

lint: ##@Commands Run ESLint for client and server sources
	npx eslint --quiet --no-inline-config client/ server/

lint-fix: ##@Commands Fix ESLint errors for client and server sources
	npx eslint --fix client/ server/

test: ##@Commands Run tests for client and server sources
	npm run test --prefix server

run: ##@Commands Build and deploy local application infrastructure
	npm start

run-db:
	docker-compose -f docker-compose.yml up -d db
