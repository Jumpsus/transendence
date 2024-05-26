PG_DIR := ./user_management/docker/postgres/pgdata

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

up:
	@docker compose up -d

down:
	@docker compose down


re: fclean all

clean: down
	docker compose down --rmi all -v --remove-orphans
	docker system prune -a -f --volumes

fclean: clean
	rm -rf $(PG_DIR) ./ssl/cert

.PHONY: all create_dir re up down clean fclean


