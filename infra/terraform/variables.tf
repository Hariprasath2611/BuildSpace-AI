variable "aws_region" {
  type = string
  default = "us-east-1"
}
variable "cluster_name" {
  type = string
  default = "buildspace-prod-cluster"
}
variable "vpc_id" {
  type = string
}
variable "subnets" {
  type = list(string)
}
variable "mongodb_public_key" {
  type = string
  sensitive = true
}
variable "mongodb_private_key" {
  type = string
  sensitive = true
}
variable "mongodb_project_id" {
  type = string
}
variable "mongo_cluster_name" {
  type = string
  default = "buildspace-prod-db"
}
variable "cloudflare_api_token" {
  type = string
  sensitive = true
}
variable "cloudflare_zone_id" {
  type = string
}
variable "domain_name" {
  type = string
  default = "buildspace.ai"
}
