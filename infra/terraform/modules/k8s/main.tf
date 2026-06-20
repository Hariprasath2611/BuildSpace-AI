variable "cluster_name" {}
variable "vpc_id" {}
variable "subnets" { type = list(string) }

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = "1.29"

  vpc_id                   = var.vpc_id
  subnet_ids               = var.subnets
  control_plane_subnet_ids = var.subnets

  eks_managed_node_groups = {
    general_purpose = {
      min_size     = 2
      max_size     = 10
      desired_size = 3
      instance_types = ["t3.large"]
    }
    gpu_nodes = {
      min_size     = 1
      max_size     = 5
      desired_size = 1
      instance_types = ["g4dn.xlarge"]
      labels = {
        accelerator = "nvidia-tesla-t4"
      }
      taints = [
        {
          key    = "nvidia.com/gpu"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      ]
    }
  }
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "ingress_ip" {
  # Mock value, typically retrieved from the LoadBalancer provisioned by Nginx Ingress
  value = "1.2.3.4"
}
