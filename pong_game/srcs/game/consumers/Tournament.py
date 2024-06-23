import asyncio
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from ..models import join_room, leave_room, TournamentData
from ..func import fetch_player_name

logger = logging.getLogger(__name__)

class TournamentConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user_token = str(self.scope['url_route']['kwargs']['user_token'])
		self.player_name = fetch_player_name(self.user_token)
		if not self.player_name:
			return
		self.room_id = await sync_to_async(join_room)(self.player_name)
		self.room_group_name = f'room_{self.room_id}'
		self.check_task1 = None
		self.check_task2 = None


		await self.accept()

		# Start the periodic check task
		self.check_task1 = asyncio.create_task(self.check_players())

	async def disconnect(self, close_code):
		await sync_to_async(leave_room)(self.player_name, self.room_id)
		if self.check_task1:
			self.check_task1.cancel()
		if self.check_task2:
			self.check_task2.cancel()

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		
		if text_data_json['type'] == 'game1':
			match = str(text_data_json['match'])
			result = text_data_json['result']
		elif text_data_json['type'] == 'game2':
			match = str(text_data_json['match'])
			result = text_data_json['result']
		elif text_data_json['type'] == 'game3':
			match = str(text_data_json['match'])
			result = text_data_json['result']

		if not await self.save_game_result(match, result):
				await self.send(text_data='{"Error": "Tounament canceled because the result is invalid."}')
				self.close(code=4444)

	async def check_players(self):
		while True:
			try:
				tournament = await sync_to_async(TournamentData.load)(self.room_id)
				if tournament:
					num_players = len(tournament.player_names)
					if num_players < 4 and not tournament.matches:
						await self.send(text_data=json.dumps({
							'waiting': num_players
						}))
					else:
						await sync_to_async(tournament.generate_matches)()
						await self.send(text_data=json.dumps({
							'game-start': '4 players connected, game starting soon...',
						}))
						await self.send(text_data=json.dumps({
							"matches": tournament.matches_player[self.player_name]
						}))
						self.check_task2 = asyncio.create_task(self.check_results())
						break
				await asyncio.sleep(1)
			except asyncio.CancelledError:
				break
			except Exception as e:
				logger.error(f"Error in check_players: {e}")
				await self.close(code=4444)
				break

	async def check_results(self):
		while True:
			try:
				tournament = await sync_to_async(TournamentData.load)(self.room_id)
				if tournament.all_matches_completed():
					await self.send_final_results()
					break
				elif len(tournament.player_names) != 4:
					await self.send(text_data='{"Error": "Tounament canceled because someone is disconnected."}')
					await self.close(code=4444)
				else:
					for result in tournament.results.values():
						if result == 'Invalid result':
							await self.send(text_data='{"Error": "Tounament canceled because someone is sending invalid result."}')
							await self.close(code=4444)
				await asyncio.sleep(2)
			except asyncio.CancelledError:
				break
			except Exception:
				await self.close(code=4444)
				break

	async def save_game_result(self, match, result):
		tournament = TournamentData.load(self.room_id)
		if not tournament:
			return False
		if not tournament.save_result(match, result):
			return False
		tournament.save()
		return True
		
	async def send_final_results(self):
		tournament = await sync_to_async(TournamentData.load)(self.room_id)
		if tournament:
			result = [d for d in tournament.results.values()]
			await self.send(text_data=json.dumps({
				'type': 'final_results',
				'results': result
			}))
		await self.close(code=4101)
