CS_PATH = src

### For Linux ###
l-cs-check:
	./vendor/bin/php-cs-fixer fix --dry-run $(CS_PATH)

l-cs-fix:
	./vendor/bin/php-cs-fixer fix $(CS_PATH)

### For Windows ###
w-cs-check:
	vendor\bin\php-cs-fixer fix --dry-run $(CS_PATH)

w-cs-fix:
	vendor\bin\php-cs-fixer fix $(CS_PATH)