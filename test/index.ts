import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";


// slug size - from https://slugs.do-api.dev
const SLUG_TINY = digitalocean.DropletSlug.DropletS1VCPU1GB;
const SLUG_BASIC = digitalocean.DropletSlug.DropletS2VCPU4GB_INTEL;
const SLUG_MEM64 = digitalocean.DropletSlug.DropletM8VCPU64GB;

const VOLUME_SIZE = 100


const volume = new digitalocean.Volume("mapdisk", {
  region: digitalocean.Region.TOR1,
  size: VOLUME_SIZE, 
  initialFilesystemType: "ext4",
  description: "map tile data",
});

// get details on default sshkey
let fingerprint: string;
const sshPromise = digitalocean.getSshKey({
  name: "anuaimi@devfoundry.com",
}).then((sshKey)=>{

  fingerprint = sshKey.fingerprint

  const droplet = new digitalocean.Droplet("buildmaps", {
    image: "debian-11-x64",
    region: "tor1",
    size: SLUG_TINY,
    volumeIds: [volume.id],
    sshKeys: [fingerprint],
  });
  
});
