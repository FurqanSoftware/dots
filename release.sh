#!/bin/bash

set -e

echo 'Pulling upstream tags.'
git pull --ff-only --tags

CURRENT=$(git describe --exact-match --tags HEAD 2>/dev/null || echo '')
if [[ "$CURRENT" = v* ]]
then
	echo 'Current commit is already tagged:' $CURRENT
	exit 0
fi

LATEST=$(git describe --tags --abbrev=0 2>/dev/null || echo '')
echo 'Latest tag:' "${LATEST:-'(none)'}"

NEWPRE="v$(date +%Y).$(date +%m)"
NEWTAG=''
if [[ "$LATEST" = $NEWPRE* ]]
then
	NEWTAG="${LATEST%.*}.$((${LATEST##*.}+1))"
else
	NEWTAG="${NEWPRE}.0"
fi
echo 'Next tag:' $NEWTAG

read -p 'Create a new release? (Press "y" to confirm.) ' -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
	git tag "$NEWTAG"
	git push
	git push --tags
fi
