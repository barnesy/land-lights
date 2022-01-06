resource "aws_cloudfront_distribution" "land_lights" {
  aliases = [
    aws_acm_certificate.land_lights.domain_name
  ]
  default_cache_behavior {
    allowed_methods = [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT"
    ]
    cached_methods = [
      "GET",
      "HEAD",
      "OPTIONS"
    ]
    compress = true
    forwarded_values {
      cookies {
        forward = "none"
      }
      headers = [
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin"
      ]
      query_string = true
    }
    target_origin_id       = 0
    viewer_protocol_policy = "redirect-to-https"
  }
  default_root_object = "index.html"
  enabled             = true
  ordered_cache_behavior {
    path_pattern = "/ws"
    allowed_methods = [
      "DELETE",
      "GET",
      "HEAD",
      "OPTIONS",
      "PATCH",
      "POST",
      "PUT"
    ]
    cached_methods = [
      "GET",
      "HEAD",
      "OPTIONS"
    ]
    compress = true
    forwarded_values {
      cookies {
        forward = "none"
      }
      headers = [
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin"
      ]
      query_string = true
    }
    target_origin_id       = 1
    viewer_protocol_policy = "allow-all"
  }
  origin {
    custom_origin_config {
      http_port = 3000
      https_port = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = [
        "TLSv1.2"
      ]
    }
    domain_name = aws_instance.land_lights.public_dns
    origin_id   = 0
  }
  origin {
    custom_origin_config {
      http_port = 3001
      https_port = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = [
        "TLSv1.2"
      ]
    }
    domain_name = aws_instance.land_lights.public_dns
    origin_id   = 1
  }
  price_class = "PriceClass_100"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.land_lights.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}

output "cloudfront-domain" {
  value = aws_cloudfront_distribution.land_lights.domain_name
}
