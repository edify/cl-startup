#!/bin/bash

# This script recursively prepends a license header to every file (with the specified extension) inside a directory.
# Usage:
#		$ chmod +x licenseScript.sh
#		$ ./licenseScript.sh /path/to/directory extension /path/to/licenseFile
# Example:
#		$ ./licenseScript.sh /home/user/src java /home/user/ApacheLicense.txt


shopt -s globstar

root=$1
extension=$2
licenseFilename=$3

find $root -type f -name *.$extension -print0 | while IFS= read -r -d $'\0' line; do
	printf "Adding license to $line \n"
    cat $licenseFilename | cat - $line > temp && mv temp $line
done