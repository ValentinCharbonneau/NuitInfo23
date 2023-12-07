CS_PATH = src

l-cs-check:
	./vendor/bin/php-cs-fixer fix --dry-run $(CS_PATH)

l-cs-fix:
	./vendor/bin/php-cs-fixer fix $(CS_PATH)

w-cs-check:
	vendor\bin\php-cs-fixer fix --dry-run $(CS_PATH)

w-cs-fix:
	vendor\bin\php-cs-fixer fix $(CS_PATH)