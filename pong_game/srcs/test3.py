import websockets
import asyncio
import time

async def hello():
	uri = "ws://localhost:8000/wswswsw/"
	async with websockets.connect(uri) as websocket:
		while True:
			response = await websocket.recv()
			print(f"Received from server: {response}")

if __name__ == "__main__":
	asyncio.run(hello())

