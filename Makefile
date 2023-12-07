CS_PATH = src

cs-check:
	vendor\bin\php-cs-fixer fix --dry-run $(CS_PATH)

cs-fix:
	vendor\bin\php-cs-fixer fix $(CS_PATH)