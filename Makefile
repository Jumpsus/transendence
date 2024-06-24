all:
	@docker compose build; \
	docker compose up -d;

up:
	@docker compose up -d

down:
	@docker compose down


re: down
	docker compose build --no-cache
	docker compose up -d


clean:
	docker compose down --rmi all -v --remove-orphans
	docker system prune -a -f --volumes

.PHONY: all create_dir re up down clean

