class yoi:

	def __init__(self):
		self.player_names = ['a', 'b', 'c', 'd']
		self.matches = None
	def generate_matches(self):
		self.matches = [(self.player_names[i], self.player_names[j]) 
						for i in range(len(self.player_names)) 
						for j in range(i + 1, len(self.player_names))]
		
obj = yoi()
obj.generate_matches()
print(obj.matches)

