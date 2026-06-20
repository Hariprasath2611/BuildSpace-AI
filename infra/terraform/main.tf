terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.10"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket = "buildspace-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

provider "mongodbatlas" {
  public_key  = var.mongodb_public_key
  private_key = var.mongodb_private_key
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

module "k8s_cluster" {
  source       = "./modules/k8s"
  cluster_name = var.cluster_name
  vpc_id       = var.vpc_id
  subnets      = var.subnets
}

module "mongodb_atlas" {
  source     = "./modules/mongodb-atlas"
  project_id = var.mongodb_project_id
  cluster_name = var.mongo_cluster_name
}

module "cloudflare_dns" {
  source    = "./modules/cloudflare"
  zone_id   = var.cloudflare_zone_id
  domain    = var.domain_name
  ingress_ip = module.k8s_cluster.ingress_ip
}
