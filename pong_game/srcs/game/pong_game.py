import json
import random

class PongGame:
	def __init__(self, paddle_width=2, paddle_height=20, ball_size=4, buffer_size=2):
		self.PADDLE_WIDTH = paddle_width
		self.PADDLE_HEIGHT = paddle_height
		self.BALL_SIZE = ball_size
		self.BUFFER_SIZE = buffer_size
		self.paddle_pos = [50, 50]
		self.ball_pos = [50, 50]
		self.ball_vel = [random.uniform(0, 0.5) + 0.3, random.uniform(0, 1)]  # Percentage per frame
		self.flag = True # used to take turn on serving
		self.score = [0, 0]

	def update_ball(self):
		self.ball_pos[0] += self.ball_vel[0]
		self.ball_pos[1] += self.ball_vel[1]

	def detect_collisions(self):
		if self.ball_pos[1] <= 0 or self.ball_pos[1] >= 100 - self.BALL_SIZE:
			self.ball_vel[1] = -self.ball_vel[1]

		if (self.ball_pos[0] < self.PADDLE_WIDTH + self.BUFFER_SIZE and
			self.paddle_pos[0] - self.PADDLE_HEIGHT / 2 <= self.ball_pos[1] <= self.paddle_pos[0] + self.PADDLE_HEIGHT / 2):
			self.ball_vel[0] = random.uniform(0, 0.5) + 0.5
			self.ball_pos[0] = self.PADDLE_WIDTH + self.BUFFER_SIZE
			self.ball_vel[1] = random.uniform(0, 1)
		elif (self.ball_pos[0] > 100 - self.PADDLE_WIDTH - self.BUFFER_SIZE and
			self.paddle_pos[1] - self.PADDLE_HEIGHT / 2 <= self.ball_pos[1] <= self.paddle_pos[1] + self.PADDLE_HEIGHT / 2):
			self.ball_vel[0] = random.uniform(-0.5, 0) - 0.5
			self.ball_pos[0] = 100 - self.PADDLE_WIDTH - self.BUFFER_SIZE
			self.ball_vel[1] = random.uniform(0, 1)

	def check_score(self):
		if self.ball_pos[0] <= 0:
			self.score[1] += 1
			self.reset_ball()
		elif self.ball_pos[0] >= 100:
			self.score[0] += 1
			self.reset_ball()

	def reset_ball(self):
		self.ball_pos = [50, 50]
		if self.flag:
			self.ball_vel = [random.uniform(0 , 0.5) + 0.3, random.uniform(0, 1)]
			self.flag = False
		else:
			self.ball_vel = [random.uniform(-0.5 , 0) - 0.3, random.uniform(0, 1)]
			self.flag = True

	def to_json(self):
		game_state = {
			'PADDLE_HEIGHT': self.PADDLE_HEIGHT,
			'paddle_pos': self.paddle_pos,
			'ball_pos': self.ball_pos,
			'ball_vel': self.ball_vel,
			'score': self.score
		}
		return json.dumps(game_state)

	def from_json(self, json_str):
		game_state = json.loads(json_str)
		self.PADDLE_HEIGHT = game_state['PADDLE_HEIGHT']
		self.paddle_pos = game_state['paddle_pos']
		self.ball_pos = game_state['ball_pos']
		self.ball_vel = game_state['ball_vel']
		self.score = game_state['score']

	def game_loop(self, paddle_pos, player):
		if player == 1:
			self.paddle_pos[0] = paddle_pos
		elif player == 2:
			self.paddle_pos[1] = paddle_pos
		self.update_ball()
		self.detect_collisions()
		self.check_score()
