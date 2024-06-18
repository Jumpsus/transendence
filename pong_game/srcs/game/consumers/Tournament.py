import asyncio
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from ..models import join_room, leave_room, TournamentData

logger = logging.getLogger(__name__)

class TournamentConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.player_name = self.scope['url_route']['kwargs']['player_name']
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
		
		if text_data_json['game1']:
			match = str(text_data_json['match'])
			result = text_data_json['result']
			await self.save_game_result(match, result)
		elif text_data_json['game2']:
			match = str(text_data_json['match'])
			result = text_data_json['result']
			await self.save_game_result(match, result)
		elif text_data_json['game3']:
			match = str(text_data_json['match'])
			result = text_data_json['result']
			await self.save_game_result(match, result)


	async def check_players(self):
		while True:
			try:
				tournament = await sync_to_async(TournamentData.load)(self.room_id)
				if tournament:
					num_players = len(tournament.player_names)
					if num_players < 4:
						await self.send(text_data=json.dumps({
							'waiting': num_players
						}))
					else:
						await sync_to_async(tournament.generate_matches)()
						await sync_to_async(tournament.save)()
						await self.send(text_data=json.dumps({
							'game-start': '4 players connected, game starting soon...',
						}))
						self.check_task2 = asyncio.create_task(self.check_results())
						break
				await asyncio.sleep(1)
			except asyncio.CancelledError:
				break
			except Exception as e:
				logger.error(f"Error in check_players: {e}")
				break

	async def check_results(self):
		while True:
			try:
				tournament = await sync_to_async(TournamentData.load)(self.room_id)
				if tournament.all_matches_completed():
					await self.send_final_results()
					break
				await asyncio.sleep(5)
			except asyncio.CancelledError:
				break
			except Exception as e:
				logger.error(f"Error in check_results: {e}")
				break
	async def save_game_result(self, match, result):
		tournament = TournamentData.load(self.room_id)
		if tournament:
			tournament.save_result(match, result)
			tournament.save()

	async def send_final_results(self):
		tournament = await sync_to_async(TournamentData.load)(self.room_id)
		if tournament:
			await self.send(text_data=json.dumps({
				'type': 'final_results',
				'results': tournament.results
			}))
			tournament.delete()
		await self.disconnect()
