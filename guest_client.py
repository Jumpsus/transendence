import asyncio
import websockets
import os
import ssl
import requests
import json

home_dir = os.environ['HOME']
cert_path = f'{home_dir}/goinfre/ssl/cert/certificate.pem'
ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.load_verify_locations(cert_path)

paddle_pos = 50

async def clear_screen():
	# Only for macOS and Linux since only tests on workstation
	os.system('clear')

async def get_user_input():
	await clear_screen()
	return input()

async def display_message(message):
	await clear_screen()
	print(message)

async def send_command(uri):
	print('Waiting for game starts.....')
	async with websockets.connect(uri, ssl=ssl_context) as websocket:
		# On connection
		data = websocket.recv()


		asyncio.run(receive_data(websocket))
		try:
			while True:
				command = await get_user_input()
				await websocket.send(command)

				if command == "exit":
					print("Exiting...")
					exit(0)
				print()
				asyncio.sleep(0.016)
		except websockets.exceptions.InvalidStatusCode as e:
			print(f"Failed to connect: {e.status_code}")
			exit(1)
		except websockets.exceptions.InvalidURI:
			print("Invalid WebSocket URI")
			exit(1)
		except Exception as e:
			print(f"An error occurred: {str(e)}")
			exit(1)

async def receive_data(websocket):
	try:
		while True:
			response = await websocket.recv()
			data = json.loads(response)
			ball_pos = data['ball_pos']
			score = data['score']
			if data['player_id'] == 1:
				message = f'Ball: {ball_pos}, Your position: {paddle_pos}, Score: {score}, Your side: Left'
			else:
				message = f'Ball: {ball_pos}, Your position: {paddle_pos}, Score: {score}, Your side: Left'
			await display_message(message)
	except websockets.exceptions.InvalidStatusCode as e:
		print(f"Failed to connect: {e.status_code}")
		exit(1)
	except websockets.exceptions.InvalidURI:
		print("Invalid WebSocket URI")
		exit(1)
	except Exception as e:
		print(f"An error occurred: {str(e)}")
		exit(1)

async def main(room_id, host):
	ws_url = f'wss://ws/game/{host}:8443/{room_id}/guest/0/'

	await send_command(ws_url)

def get_room_id(url):

	response = requests.get(url, verify=False)

	if response.status_code == 200:
		data = response.json()
		game_id = data['game_id']
		print(f'Share it with your friend: {game_id}')
		return data['game_id']
	else:
		print("Failed to retrieve data. Status code:", response.status_code)
		exit(1)

if __name__ == "__main__":
	print("You can play the game by entering command: (w->up, s->down. Can input many.)")
	command = input('''Please input the command, any invalid command will end the program:
	   create: It creates a game room ID, you can share this with your friend.
	   join: Input a room ID to join a game.\n''')
	if command == 'create':
		host = input('Please input the host IP:')
		room_id = get_room_id(f'https://{host}:8443/game/create-game/')
		
	elif command == 'join':
		room_id = input('Please input the game room ID:')

	else:
		exit(1)

	asyncio.run(main(room_id))
