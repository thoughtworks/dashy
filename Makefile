install:
	@npm install
check.mongodb:
	@which mongo > /dev/null || \
	(echo '\n> Please install mongodb!\n' && false)
test:
	@NODE_TLS_REJECT_UNAUTHORIZED=0 ./node_modules/.bin/mocha \
		--require should \
		--reporter spec \
		--check-leaks

.PHONY: test