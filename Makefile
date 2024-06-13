PG_DIR := ./user_management/postgres/pgdata
VAULT_DIR := ./vault/data

all: create_dir
	bash generate_cert.sh
	@docker compose build; \
	docker compose up -d;

create_dir:
	@if [ ! -d $(PG_DIR) ]; then \
		echo "Directory $(PG_DIR) does not exist. Creating..."; \
		mkdir -p $(PG_DIR); \
	else \
		echo "Directory $(PG_DIR) already exists."; \
	fi
	
	@if [ ! -d $(VAULT_DIR) ]; then \
		echo "Directory $(VAULT_DIR) does not exist. Creating..."; \
		mkdir -p $(VAULT_DIR); \
	else \
		echo "Directory $(VAULT_DIR) already exists."; \
	fi

up:
	@docker compose up -d

down:
	@docker compose down


re: clean_cache all

clean: down
	docker compose down --rmi all -v --remove-orphans
	docker system prune -a -f --volumes

fclean: clean
	rm -rf $(PG_DIR) ./ssl/cert

# List of base images to retain
BASE_IMAGES = owasp/modsecurity-crs:3.3.4-nginx-alpine-202301110601 \
              postgres:16.3 \
              python:3.10-slim \
			  redis:latest

# Define a rule to list base images (for reference)
list_base_images:
	@echo $(BASE_IMAGES)

# Define a rule to clean image caches but retain base images
clean_cache:
	@docker system prune -f
	# Save base images to a file
	@echo $(BASE_IMAGES) | tr ' ' '\n' > base_images.txt

	# List all Docker images
	@docker images --format '{{.Repository}}:{{.Tag}}' > all_images.txt

	# Filter out the base images from all images
	@grep -vFf base_images.txt all_images.txt > removable_images.txt

	# Remove the filtered images
	@xargs -r docker rmi < removable_images.txt

	# Clean up temporary files
	@rm base_images.txt all_images.txt removable_images.txt

.PHONY: all create_dir re up down clean fclean list_base_images clean_cache


