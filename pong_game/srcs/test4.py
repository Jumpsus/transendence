import websockets
import asyncio
import json

def create_join_message(player_name):
    return json.dumps({
        "type": "join",
        "player_name": player_name
    })

def create_result_message(match, result):
    return json.dumps({
        "type": "result",
        "match": match,
        "result": result
    })


async def hello():
    uri = "ws://localhost:8000/sssss/"
    async with websockets.connect(uri) as websocket:
        # Simulate sending a join message
        join_message = create_join_message("Player1")
        await websocket.send(join_message)
        print(f"Sent to server: {join_message}")

        # Simulate sending a game result message
        match = ["Player1", "Player2"]
        result = {
            "winner": "Player1",
            "score": {
                "Player1": 21,
                "Player2": 18
            }
        }
        result_message = create_result_message(match, result)
        await websocket.send(result_message)
        print(f"Sent to server: {result_message}")

        while True:
            response = await websocket.recv()
            print(f"Received from server: {response}")

if __name__ == "__main__":
    asyncio.run(hello())
