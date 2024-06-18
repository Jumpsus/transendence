# from django.db import models

import uuid
from django.core.cache import cache

class TournamentData():
	def __init__(self, room_id):
		self.room_id = room_id
		self.player_names = []

	def add_player(self, player_name):
		if len(self.player_names) >= 4:
			return False
		for player in self.player_names:
			if player == player_name:
				return False
		self.player_names.append(player_name)
		return True

	def remove_player(self, player_name):
		self.player_names = [name for name in self.player_names if name != player_name]

	@staticmethod
	def load(room_id):
		data = cache.get(f'room_{room_id}')
		if data:
			tournament = TournamentData(room_id)
			tournament.player_names = data
			return tournament
		return None

	def save(self):
		cache.set(f'room_{self.room_id}', self.player_names, timeout=300)

	def delete(self):
		cache.delete(f'room_{self.room_id}')

def generate_room_id():
	return str(uuid.uuid4())

def join_room(player_name):
	room_list = cache.get('room_list', [])

	for room_id in room_list:
		tournament = TournamentData.load(room_id)
		if tournament and tournament.add_player(player_name):
			tournament.save()
			return tournament.room_id

	new_room_id = generate_room_id()
	new_tournament = TournamentData(new_room_id)
	new_tournament.add_player(player_name)
	new_tournament.save()

	room_list.append(new_room_id)
	cache.set('room_list', room_list, timeout=300)
	return new_room_id

def leave_room(player_name, room_id):
	tournament = TournamentData.load(room_id)
	if tournament:
		tournament.remove_player(player_name)
		if not tournament.player_names:
			tournament.delete()
			room_list = cache.get('room_list', [])
			room_list = [rid for rid in room_list if rid != room_id]
			cache.set('room_list', room_list, timeout=300)
		else:
			tournament.save()
