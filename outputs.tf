output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.techcrush_web_test.id
}

output "instance_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.techcrush_web_test.public_ip
}

output "instance_public_dns" {
  description = "The public DNS name of the EC2 instance"
  value       = aws_instance.techcrush_web_test.public_dns
}

output "security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.techcrush_sg.id
}

output "subnet_id" {
  description = "The ID of the subnet"
  value       = aws_subnet.techcrush_subnet.id
}

