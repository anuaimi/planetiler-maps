NAME="planetiler-build"
REGION="tor1"
IMAGE="debian-11-x64"
SIZE="m-4vcpu-32gb"
SSHKEY_ID=496073

VOLUME_ID=$(doctl compute volume create mapdata --region "$REGION" --size "1TiB" --output json | jq '.[0].id')
sleep 1

# add volume to VM

doctl compute droplet create --image $IMAGE --size $SIZE --region $REGION --ssh-keys $SSHKEY_ID $NAME
sleep 5
doctl compute droplet get $NAME --output json | jq '.[0].id, .[0].networks.v4[]' vm.json
sleep 3
doctl compute ssh $NAME
