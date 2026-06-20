output "kubernetes_cluster_endpoint" {
  value = module.k8s_cluster.cluster_endpoint
}

output "mongodb_connection_string" {
  value = module.mongodb_atlas.connection_string
  sensitive = true
}
