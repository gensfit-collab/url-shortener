<<<<<<< HEAD
URL Shortener Infrastructure - Terraform
========================================

Project Overview
----------------
This project defines the AWS infrastructure required to host a URL Shortener application using Terraform. 
It provisions networking, security, and compute resources in the eu-west-3 (Paris) region.

Infrastructure Components
-------------------------
- VPC: Custom VPC (10.0.0.0/16) for isolation.
- Subnet: Public subnet (10.0.1.0/24) with auto-assign public IPs.
- Internet Gateway & Route Table: Provides internet access for the subnet.
- Security Group: Allows inbound SSH (22) and HTTP (80).
- EC2 Instance: Ubuntu server running in the subnet, tagged as "techcrush-web-test".
- Key Pair: Uses your local id_ed25519 public key for SSH access.
- Outputs: Instance ID, public IP, public DNS, security group ID, subnet ID.

Usage
-----
1. Initialize Terraform:
   terraform init

2. Validate configuration:
   terraform validate

3. Plan changes:
   terraform plan -out=tfplan

4. Apply infrastructure:
   terraform apply tfplan

Variables
---------
Defined in variables.tf and overridden in terraform.tfvars:
- aws_region     : AWS region (default: eu-west-3)
- ami_id         : Ubuntu AMI ID
- instance_type  : EC2 instance type (default: t2.micro)
- instance_name  : Tag for the EC2 instance

Outputs
-------
After apply, Terraform prints:
- Instance ID
- Public IP (connect via ssh -i ~/.ssh/id_ed25519 ubuntu@<public-ip>)
- Public DNS (use for domain mapping or testing HTTP)
- Security Group ID
- Subnet ID

Next Steps
----------
- Deploy the URL Shortener application onto the EC2 instance.
- Optionally configure Route 53 to map a custom domain to the instance’s public DNS.
- Add autoscaling or load balancing if traffic grows.
=======
# url-shortener
A containerized URL Shortener application built with modern DevOps practices, CI/CD, and AWS deployment.
>>>>>>> origin/main
