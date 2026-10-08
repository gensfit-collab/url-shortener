variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "eu-west-3"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-0e1c4170d9c01184b"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "techcrush-web-test"
}

