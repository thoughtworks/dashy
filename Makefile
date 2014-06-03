install:
	@npm install
check.mongodb:
	@which mongo > /dev/null || \
	(echo '\n> Please install mongodb!\n' && false)