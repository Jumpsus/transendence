all:
	@docker-compose build \
		docker-compose up

down:
	docker-compose down

clean:
	@docker stop $$(docker ps -qa); \
		docker rm $$(docker ps -qa); \
		docker rmi -f $$(docker images -qa); \
		docker volume rm $$(docker volume ls -q);

re: clean all

.PHONY: all down clean re