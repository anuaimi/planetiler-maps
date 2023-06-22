import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

// slug size - from https://slugs.do-api.dev
const SLUG_TINY = digitalocean.DropletSlug.DropletS1VCPU1GB;
// const SLUG_BASIC = digitalocean.DropletSlug.DropletS2VCPU4GB_INTEL;
// const SLUG_MEM64 = digitalocean.DropletSlug.DropletM8VCPU64GB;

const DEFAULT_VOLUME_SIZE = 50

export = async () => {

  const cfg = new pulumi.Config();
  const stackName = pulumi.getStack();
  
  // const projectName = cfg.get("projectName") || "map-builder";
  const projectName = "map-builder-" + stackName;
  const slugSize = cfg.get("dropletSlug") || SLUG_TINY;
  const volumeSize = cfg.get("volumeSize") || DEFAULT_VOLUME_SIZE;
  const sshKeyName = cfg.get("sshKeyName") || "default";

  const mySshKey = await digitalocean.getSshKey({
    name: sshKeyName,
  });

  const volumeName = "geodata-" + stackName;

  const volume = new digitalocean.Volume(volumeName, {
    region: digitalocean.Region.TOR1,
    size: volumeSize, 
    initialFilesystemType: "ext4",
    description: "map tile data",
  });
  
  // create resources
  const dropletName = "planetiler-" + stackName;
  const droplet = new digitalocean.Droplet(dropletName, {
    image: "debian-11-x64",
    region: "tor1",
    size: slugSize,
    volumeIds: [volume.id],
    sshKeys: [mySshKey.fingerprint],
    monitoring: true,
    ipv6: true,
  });

  // create project for these resources
  const project = new digitalocean.Project( projectName, {
      resources: [
        droplet.id.apply(id => `do:droplet:${id}`),
      ],
    }
  );

  return { 
    ip: droplet.ipv4Address 
  };
}
