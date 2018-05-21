develop:
	npm run webpack-serve

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npm run webpack

test:
	npm test

watch:
	npm test -- --watch

lint:
	npm run eslint .

publish:
	npm publish

.PHONY: test
