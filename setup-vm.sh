#! /bin/bash 

apt-get update
adduser builduser
usermod -aG sudo builduser
login builduser

sudo apt-get -y install openjdk



# can get a list of the downloads from https://download.geofabrik.de/index-v1.json
# if entry doesn't have 'parent' then is top level (ie continent)
# files can be up to a week old
