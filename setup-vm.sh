#! /bin/bash 

apt-get update
adduser builduser
usermod -aG sudo builduser
login builduser


apt-get -y install ca-certificates-java openjdk-17-jdk
wget https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar

// generate mbtiles file
java -Xmx1g -jar planetiler.jar --download --area=monaco

// area can be:
// 

// should we be using nix?


// upload to R2

// send email to say done
// use curl & sendgrid https://docs.sendgrid.com/for-developers/sending-email/curl-examples

# can get a list of the downloads from https://download.geofabrik.de/index-v1.json
# if entry doesn't have 'parent' then is top level (ie continent)
# files can be up to a week old
