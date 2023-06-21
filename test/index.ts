import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

// slug size - from https://slugs.do-api.dev
const SLUG_TINY = digitalocean.DropletSlug.DropletS1VCPU1GB;
const SLUG_BASIC = digitalocean.DropletSlug.DropletS2VCPU4GB_INTEL;
const SLUG_MEM64 = digitalocean.DropletSlug.DropletM8VCPU64GB;

const VOLUME_SIZE = 100

export = async () => {

  const mySshKey = await digitalocean.getSshKey({
    name: "anuaimi@devfoundry.com",
  });

  const volume = new digitalocean.Volume("geodata", {
    region: digitalocean.Region.TOR1,
    size: VOLUME_SIZE, 
    initialFilesystemType: "ext4",
    description: "map tile data",
  });
  
  // create resources
  const droplet = new digitalocean.Droplet("planetiler", {
    image: "debian-11-x64",
    region: "tor1",
    size: SLUG_TINY,
    volumeIds: [volume.id],
    sshKeys: [mySshKey.fingerprint],
    monitoring: true,
    ipv6: true,
  });

  // create project for these resources
  const project = new digitalocean.Project( "map-builder", {
      resources: [
        droplet.id.apply(id => `do:droplet:${id}`),
      ],
    }
  );

  return { ip: droplet.ipv4Address };
}
