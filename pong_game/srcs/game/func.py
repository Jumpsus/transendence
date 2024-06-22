import requests
from core import settings

def fetch_player_name(token):
	url = "http://user-management:8000/user/getinfo"
	headers = {
		"Authorization": "Bearer " + token,
	}
	response = requests.get(url, headers=headers)

	if response.status_code == 200:
		data = response.json()
		if len(data['tag']) == 0:
			return data['username']
		return data['tag']
	else:
		return None

def store_game_result(player_name, score):
	url = "http://user-management:8000/user/savegameresult"
	headers = {
		"Authorization": "Bearer " + settings.API_KEY,
	}
	result = {}
	if score[0] > score[1]:
		result['winner'] = player_name[0]
		result['loser'] = player_name[1]
		result['winner_score'] = score[0]
		result['loser_score'] = score[1]
	else:
		result['winner'] = player_name[1]
		result['loser'] = player_name[0]
		result['winner_score'] = score[1]
		result['loser_score'] = score[0]
	response = requests.post(url, headers=headers, json=result)


