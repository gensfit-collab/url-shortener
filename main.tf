provider "aws" {
  region = var.aws_region
}

# Create a VPC
resource "aws_vpc" "techcrush_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "techcrush-vpc"
  }
}

#Connect key Pair
resource "aws_key_pair" "my_key" {
  key_name   = "techcrush_key"                # AWS will register this name
  public_key = file("/home/techcrush_majek2/.ssh/id_ed25519.pub") # path to your public key file
}


# Create a subnet
resource "aws_subnet" "techcrush_subnet" {
  vpc_id                  = aws_vpc.techcrush_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "techcrush-subnet"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "techcrush_igw" {
  vpc_id = aws_vpc.techcrush_vpc.id
  tags = {
    Name = "techcrush-igw"
  }
}

# Route Table
resource "aws_route_table" "techcrush_rt" {
  vpc_id = aws_vpc.techcrush_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.techcrush_igw.id
  }

  tags = {
    Name = "techcrush-rt"
  }
}

# Associate Route Table with Subnet
resource "aws_route_table_association" "techcrush_rta" {
  subnet_id      = aws_subnet.techcrush_subnet.id
  route_table_id = aws_route_table.techcrush_rt.id
}

# Security Group
resource "aws_security_group" "techcrush_sg" {
  name        = "techcrush-web-sg"
  description = "Allow SSH and HTTP inbound traffic"
  vpc_id      = aws_vpc.techcrush_vpc.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "techcrush-sg"
  }
}

# EC2 Instance
resource "aws_instance" "techcrush_web_test" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.techcrush_subnet.id
  vpc_security_group_ids = [aws_security_group.techcrush_sg.id]
  key_name      = aws_key_pair.my_key.key_name

  tags = {
    Name = var.instance_name
  }
}

