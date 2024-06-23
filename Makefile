PG_DIR := ./goinfre/user_management/pgdata
VAULT_DIR := ./goinfre/vault/data
IMAGE_DIR := ./goinfre/common/image
GOINFRE := ./goinfre

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

	@if [ ! -d $(IMAGE_DIR) ]; then \
		echo "Directory $(IMAGE_DIR) does not exist. Creating..."; \
		mkdir -p $(IMAGE_DIR); \
		cp ./default.png $(IMAGE_DIR); \
	else \
		echo "Directory $(IMAGE_DIR) already exists."; \
	fi

up:
	@docker compose up -d

down:
	@docker compose down


re: down
	docker compose build --no-cache
	docker compose up -d


clean: down
	docker compose down --rmi all -v --remove-orphans
	docker system prune -a -f --volumes

# This requires root permission
fclean: clean
	rm -rf $(GOINFRE)

.PHONY: all create_dir re up down clean fclean list_base_images clean_cache

