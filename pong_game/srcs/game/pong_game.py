import json
import time
class PongGame:
	def __init__(self):
		self.WIDTH = 800
		self.HEIGHT = 600
		self.PADDLE_WIDTH = 16
		self.PADDLE_HEIGHT = 120
		self.BALL_SIZE = 24

		paddle_pos = self.HEIGHT // 2 - self.PADDLE_HEIGHT // 2
		self.paddle_pos = [paddle_pos, paddle_pos]
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

		if self.ball_pos[0] < self.PADDLE_WIDTH and self.paddle_pos[0] <= self.ball_pos[1] < self.paddle_pos[0] + self.PADDLE_HEIGHT:
			self.ball_vel[0] = -self.ball_vel[0]
			self.ball_pos[0] = self.PADDLE_WIDTH
		elif self.ball_pos[0] > self.WIDTH - self.PADDLE_WIDTH - self.BALL_SIZE and self.paddle_pos[1] < self.ball_pos[1] < self.paddle_pos[1] + self.PADDLE_HEIGHT:
			self.ball_vel[0] = -self.ball_vel[0]
			self.ball_pos[0] = self.WIDTH - self.PADDLE_WIDTH 
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
			'PADDLE_HEIGHT': self.PADDLE_HEIGHT / self.HEIGHT * 100,
			'paddle_pos': self.paddle_pos,
			'ball_pos': [ self.ball_pos[0] / self.WIDTH * 100, self.ball_pos[1] / self.HEIGHT * 100],
			'score1': self.score1,
			'score2': self.score2
		}
		return json.dumps(game_state)

	def from_json(self, json_str):
			game_state = json.loads(json_str)
			self.PADDLE_HEIGHT = game_state['PADDLE_HEIGHT'] / 100 * self.HEIGHT
			self.paddle_pos = game_state['paddle_pos']
			self.ball_pos[0] = game_state['ball_pos'][0] / 100 * self.WIDTH
			self.ball_pos[1] = game_state['ball_pos'][1] / 100 * self.HEIGHT
			self.score1 = game_state['score1']
			self.score2 = game_state['score2']

	def game_loop(self, paddle_pos, player):
		if player == 1:
			self.paddle_pos[0] = paddle_pos
		elif player == 2:
			self.paddle_pos[1] = paddle_pos
		self.update_ball()
		self.detect_collisions()
		self.check_score()