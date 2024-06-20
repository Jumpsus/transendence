import uuid
from django.core.cache import cache

class TournamentData:
	def __init__(self, room_id):
		self.room_id = room_id
		self.player_names = []
		self.matches = []
		self.matches_id = {}
		self.matches_player = {}
		self.results = {}

	def add_player(self, player_name):
		if len(self.player_names) >= 4 or player_name in self.player_names:
			return False
		self.player_names.append(player_name)
		return True

	def remove_player(self, player_name):
		self.player_names = [name for name in self.player_names if name != player_name]

	def generate_matches(self):
		if self.matches:
			return
		self.matches = [(self.player_names[i], self.player_names[j]) 
						for i in range(len(self.player_names)) 
						for j in range(i + 1, len(self.player_names))]
		for match in self.matches:
			unique_id = uuid.uuid4()  # Generates a unique UUID
			self.matches_id[str(match)] = str(unique_id)
			cache.set("game" + str(unique_id), 1, timeout=1800)  # Store in cache for 30 mins

		self.matches_player[self.player_names[0]] = [self.matches_id[str(self.matches[0])], self.matches_id[str(self.matches[1])], self.matches_id[str(self.matches[2])]]
		self.matches_player[self.player_names[1]] = [self.matches_id[str(self.matches[0])], self.matches_id[str(self.matches[4])], self.matches_id[str(self.matches[3])]]
		self.matches_player[self.player_names[2]] = [self.matches_id[str(self.matches[5])], self.matches_id[str(self.matches[1])], self.matches_id[str(self.matches[3])]]
		self.matches_player[self.player_names[3]] = [self.matches_id[str(self.matches[5])], self.matches_id[str(self.matches[4])], self.matches_id[str(self.matches[2])]]
		self.save()

	def save_result(self, match, result):
		if match in self.results.keys():
			if result != self.results[match]:
				self.results[match] = "Invalid result"
				return False
		else:
			self.results[match] = result
		return True

	def all_matches_completed(self):
		return len(self.matches) == len(self.results)

	@staticmethod
	def load(room_id):
		data = cache.get(f'room_{room_id}')
		if data:
			tournament = TournamentData(room_id)
			tournament.player_names = data.get('player_names', [])
			tournament.matches = data.get('matches', [])
			tournament.matches_id = data.get('matches_id', {})
			tournament.matches_player = data.get('matches_player', {})
			tournament.results = data.get('results', {})
			return tournament
		return None

	def save(self):
		cache.set(f'room_{self.room_id}', {
			'player_names': self.player_names,
			'matches': self.matches,
			'matches_id': self.matches_id,
			'matches_player': self.matches_player,
			'results': self.results,
		})

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
	cache.set('room_list', room_list)
	return new_room_id

def leave_room(player_name, room_id):
	tournament = TournamentData.load(room_id)
	if tournament:
		tournament.remove_player(player_name)
		if not tournament.player_names:
			tournament.delete()
			room_list = cache.get('room_list', [])
			room_list = [rid for rid in room_list if rid != room_id]
			cache.set('room_list', room_list)
		else:
			tournament.save()
