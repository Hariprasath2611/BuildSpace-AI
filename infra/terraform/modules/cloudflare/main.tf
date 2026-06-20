variable "zone_id" {}
variable "domain" {}
variable "ingress_ip" {}

resource "cloudflare_record" "api" {
  zone_id = var.zone_id
  name    = "api"
  value   = var.ingress_ip
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "app" {
  zone_id = var.zone_id
  name    = "app"
  value   = var.ingress_ip
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "ws" {
  zone_id = var.zone_id
  name    = "ws"
  value   = var.ingress_ip
  type    = "A"
  proxied = false
}

resource "cloudflare_ruleset" "waf" {
  zone_id     = var.zone_id
  name        = "BuildSpace WAF"
  description = "Managed WAF rules"
  kind        = "zone"
  phase       = "http_request_firewall_managed"

  rules {
    action = "execute"
    action_parameters {
      id = "efb7b8c949ac4650a09736fc376e9aee" # Cloudflare Managed Ruleset
    }
    expression = "(http.request.uri.path contains \"/\")"
    description = "Execute Cloudflare Managed Ruleset"
  }
}
