data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "land_lights" {
  name = "land_lights"

  vpc_id = data.aws_vpc.default.id

  ingress {
    protocol  = -1
    # self      = true
    from_port = 0
    to_port   = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "land_lights" {
  key_name   = "land-lights"
  public_key = file("../land-lights.pem.pub")
}

resource "aws_instance" "land_lights" {

  # Amazon Linux 2 AMI (HVM) - Kernel 5.10, SSD Volume Type
  ami  = "ami-0ed9277fb7eb570c9"

  instance_type = "t3.micro"

  key_name = aws_key_pair.land_lights.key_name

  tags = {
    Name = "land-lights"
  }

  vpc_security_group_ids = [
    aws_security_group.land_lights.id
  ]
}

output "ec2-domain" {
  value = aws_instance.land_lights.public_dns
}
