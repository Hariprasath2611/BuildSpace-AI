variable "project_id" {}
variable "cluster_name" {}

resource "mongodbatlas_cluster" "cluster" {
  project_id   = var.project_id
  name         = var.cluster_name
  cluster_type = "REPLICASET"
  
  replication_specs {
    num_shards = 1
    regions_config {
      region_name     = "US_EAST_1"
      electable_nodes = 3
      priority        = 7
      read_only_nodes = 0
    }
  }
  
  provider_name               = "AWS"
  provider_instance_size_name = "M30"
}

output "connection_string" {
  value = mongodbatlas_cluster.cluster.connection_strings[0].standard_srv
}
