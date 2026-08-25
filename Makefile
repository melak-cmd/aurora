IMAGE_NAME := gh-actions-npm-cicd-aurora
PORT := 3000

.DEFAULT_GOAL := help
.PHONY: help install start test changelog docker-build docker-run clean

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies with npm ci
	npm ci

start: ## Start the app (node index.js)
	npm start

test: ## Run mocha tests
	npm test

changelog: ## Regenerate CHANGELOG.md with git-cliff
	npm run changelog

docker-build: ## Build the Docker image
	docker build -t $(IMAGE_NAME) .

docker-run: ## Run the Docker image on port 3000
	docker run --rm -p $(PORT):3000 $(IMAGE_NAME)

clean: ## Remove node_modules
	rm -rf node_modules
