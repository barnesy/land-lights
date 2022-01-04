data "aws_route53_zone" "land_lights" {
  name         = "heartbeatatl.com"
}

resource "aws_acm_certificate" "land_lights" {
  domain_name = data.aws_route53_zone.land_lights.name
  validation_method = "DNS"
}

resource "aws_route53_record" "land_lights_acm_validation" {
  for_each = {
    for option in aws_acm_certificate.land_lights.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  }
  allow_overwrite = true
  name            = each.value.name
  records = [
    each.value.record
  ]
  ttl     = 60
  type    = each.value.type
  zone_id = data.aws_route53_zone.land_lights.zone_id
}

resource "aws_acm_certificate_validation" "land_lights" {
  certificate_arn = aws_acm_certificate.land_lights.arn
  validation_record_fqdns = [
    for record in aws_route53_record.land_lights_acm_validation : record.fqdn
  ]
}

resource "aws_route53_record" "land_lights" {
  alias {
    evaluate_target_health = false
    name                   = aws_cloudfront_distribution.land_lights.domain_name
    zone_id                = aws_cloudfront_distribution.land_lights.hosted_zone_id
  }
  name    = aws_acm_certificate.land_lights.domain_name
  type    = "A"
  zone_id = data.aws_route53_zone.land_lights.zone_id
}

output "route53-domain" {
  value = data.aws_route53_zone.land_lights.name
}

output "route53-nameservers" {
  value = data.aws_route53_zone.land_lights.name_servers
}
