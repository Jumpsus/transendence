all:
	bash generate_cert.sh
	@docker-compose build; \
	docker-compose up;

up:
	@docker-compose up

down:
	@docker-compose down

clean: down
	@docker stop $$(docker ps -qa); \
	docker rmi -f $$(docker images -qa); \
	docker volume rm -f $$(docker volume ls -q);

re: clean all

.PHONY: all down clean re

