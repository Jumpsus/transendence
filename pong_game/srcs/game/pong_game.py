import json
import time
class PongGame:
	def __init__(self):
		self.WIDTH = 800
		self.HEIGHT = 600
		self.PADDLE_WIDTH = 10
		self.PADDLE_HEIGHT = 100
		self.BALL_SIZE = 10

		self.paddle1_pos = self.HEIGHT // 2 - self.PADDLE_HEIGHT // 2
		self.paddle2_pos = self.HEIGHT // 2 - self.PADDLE_HEIGHT // 2
		self.ball_pos = [self.WIDTH // 2, self.HEIGHT // 2]
		self.ball_vel = [4, -4]

		self.score1 = 0
		self.score2 = 0

	def update_ball(self):
		self.ball_pos[0] += self.ball_vel[0]
		self.ball_pos[1] += self.ball_vel[1]

	def detect_collisions(self):
		if self.ball_pos[1] <= 0 or self.ball_pos[1] >= self.HEIGHT - self.BALL_SIZE:
			self.ball_vel[1] = -self.ball_vel[1]

		if self.ball_pos[0] <= self.PADDLE_WIDTH and self.paddle1_pos <= self.ball_pos[1] <= self.paddle1_pos + self.PADDLE_HEIGHT:
			self.ball_vel[0] = -self.ball_vel[0]
		elif self.ball_pos[0] >= self.WIDTH - self.PADDLE_WIDTH - self.BALL_SIZE and self.paddle2_pos <= self.ball_pos[1] <= self.paddle2_pos + self.PADDLE_HEIGHT:
			self.ball_vel[0] = -self.ball_vel[0]

	def check_score(self):
		if self.ball_pos[0] <= 0:
			self.score2 += 1
			self.reset_ball()
		elif self.ball_pos[0] >= self.WIDTH:
			self.score1 += 1
			self.reset_ball()

	def reset_ball(self):
		self.ball_pos = [self.WIDTH // 2, self.HEIGHT // 2]
		self.ball_vel = [4, -4]

	def to_json(self):
		game_state = {
			'WIDTH': self.WIDTH,
			'HEIGHT': self.HEIGHT,
			'PADDLE_WIDTH': self.PADDLE_WIDTH,
			'PADDLE_HEIGHT': self.PADDLE_HEIGHT,
			'BALL_SIZE': self.BALL_SIZE,
			'paddle1_pos': self.paddle1_pos,
			'paddle2_pos': self.paddle2_pos,
			'ball_pos': self.ball_pos,
			'ball_vel': self.ball_vel,
			'score1': self.score1,
			'score2': self.score2
		}
		return json.dumps(game_state)

	def from_json(self, json_str):
			game_state = json.loads(json_str)
			self.WIDTH = game_state["WIDTH"]
			self.HEIGHT = game_state['HEIGHT']
			self.PADDLE_WIDTH = game_state['PADDLE_WIDTH']
			self.PADDLE_HEIGHT = game_state['PADDLE_HEIGHT']
			self.BALL_SIZE = game_state['BALL_SIZE']
			self.paddle1_pos = game_state['paddle1_pos']
			self.paddle2_pos = game_state['paddle2_pos']
			self.ball_pos = game_state['ball_pos']
			self.ball_vel = game_state['ball_vel']
			self.score1 = game_state['score1']
			self.score2 = game_state['score2']

	def game_loop(self, paddle_pos, player):
		if player == 1:
			self.paddle1_pos = paddle_pos
		elif player == 2:
			self.paddle2_pos = paddle_pos
		self.update_ball()
		self.detect_collisions()
		self.check_score()