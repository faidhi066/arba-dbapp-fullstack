To push your Docker images to AWS ECR (Elastic Container Registry) and then run them using ECS (Elastic Container Service), follow the steps below. The process will include building the Docker images, pushing them to AWS ECR, and then setting up ECS to run your containers.

# Step 1: Build the Docker Images

Make sure both the frontend and backend Docker images are correctly built before pushing them to AWS ECR.

```
bash
# In the root directory (where your Dockerfiles are located)
docker build -t arba-frontend ./frontend
docker build -t arba-backend ./backend
```

This will build the Docker images and tag them as arba-frontend and arba-backend.

# Step 2: Set Up AWS ECR

You need to create an ECR repository for both the frontend and backend images if you haven’t already. You can do this via the AWS Management Console or the AWS CLI.

Create ECR Repositories (via AWS CLI)
Run the following commands to create repositories for the frontend and backend:

```
bash
aws ecr create-repository --repository-name arba-frontend
aws ecr create-repository --repository-name arba-backend
```

This will create repositories in your AWS account.

# Step 3: Authenticate Docker to AWS ECR

You need to authenticate your local Docker CLI to AWS ECR. Run the following command (make sure AWS CLI is configured with the correct profile):

bash
Copy code
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com
Replace <aws_account_id> with your actual AWS account ID and update the region if necessary (e.g., us-west-2).

# Step 4: Tag Docker Images for ECR

Next, you need to tag the local Docker images with the ECR repository URLs.

bash
Copy code
docker tag arba-frontend:latest <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/arba-frontend:latest
docker tag arba-backend:latest <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/arba-backend:latest

# Step 5: Push Docker Images to AWS ECR

Push the images to the corresponding ECR repositories.

bash
Copy code
docker push <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/arba-frontend:latest
docker push <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/arba-backend:latest

# Step 6: Set Up ECS Task Definitions

Next, you need to create ECS task definitions for your frontend and backend containers. You can either create task definitions manually through the AWS Management Console or use an ECS JSON file.

Example Task Definition (frontend)
Create a JSON file (e.g., frontend-task-definition.json):

json
Copy code
{
"family": "arba-frontend",
"containerDefinitions": [
{
"name": "arba-frontend",
"image": "<aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/arba-frontend:latest",
"essential": true,
"memory": 512,
"cpu": 256,
"portMappings": [
{
"containerPort": 4173,
"hostPort": 4173
}
]
}
]
}
Repeat this for the backend task definition (create backend-task-definition.json):

json
Copy code
{
"family": "arba-backend",
"containerDefinitions": [
{
"name": "arba-backend",
"image": "<aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/arba-backend:latest",
"essential": true,
"memory": 512,
"cpu": 256,
"portMappings": [
{
"containerPort": 8000,
"hostPort": 8000
}
]
}
]
}
Now, register these task definitions in ECS using AWS CLI:

bash
Copy code
aws ecs register-task-definition --cli-input-json file://frontend-task-definition.json
aws ecs register-task-definition --cli-input-json file://backend-task-definition.json

# Step 7: Create ECS Cluster

Now, create an ECS cluster to run the tasks.

bash
Copy code
aws ecs create-cluster --cluster-name arba-cluster
Step 8: Launch ECS Tasks
Now that the ECS cluster and task definitions are ready, you can run the tasks. You can run the tasks manually (for testing) or create a service that will manage the containers.

To run the tasks manually:

bash
Copy code
aws ecs run-task --cluster arba-cluster --task-definition arba-frontend --count 1
aws ecs run-task --cluster arba-cluster --task-definition arba-backend --count 1
Step 9: Set Up Load Balancing (Optional)
If you need to access both frontend and backend services from the web, it's a good idea to set up an Application Load Balancer (ALB) in front of your ECS tasks.

Go to the EC2 console → Load Balancers → Create Load Balancer.
Configure the load balancer with target groups for both frontend and backend services.
Add security groups to allow traffic on the desired ports (e.g., 4173 for frontend, 8000 for backend).
Step 10: Update ECS Service (Optional)
If you want your containers to be automatically managed and scalable, you can set up ECS services to ensure containers are always running.

Example of running ECS service:

bash
Copy code
aws ecs create-service --cluster arba-cluster --service-name arba-frontend-service --task-definition arba-frontend --desired-count 1 --launch-type FARGATE
aws ecs create-service --cluster arba-cluster --service-name arba-backend-service --task-definition arba-backend --desired-count 1 --launch-type FARGATE
Step 11: Update Security Group and VPC
If you want to allow access to your ECS tasks from the public internet (for testing), you may need to configure the security groups and VPC for your services. Make sure to open the necessary ports on the security group (e.g., 4173 for frontend, 8000 for backend).

# Step 12: Accessing the Application

Once everything is running, you should be able to access the frontend via the load balancer URL or the public IP assigned to the ECS tasks (if not behind a load balancer). Similarly, access the backend using the appropriate route/API URL.

# Summary of Key Steps:

Build Docker Images locally for frontend and backend.
Push Docker Images to AWS ECR.
Create ECS Task Definitions for both frontend and backend.
Create ECS Cluster and run the tasks.
(Optional) Set Up Load Balancer for public access.
Update ECS Services for automatic scaling.
Test access via ECS or Load Balancer.

aws ecs run-task \
 --cluster arba-cluster \
 --task-definition arba-frontend \
 --launch-type FARGATE \
 --count 1 \
 --network-configuration "awsvpcConfiguration={subnets=[subnet-0a2aeae8bb93ed30c],securityGroups=[sg-0f3871f6fee8ec1b9],assignPublicIp=ENABLED}"

aws iam put-role-policy \
 --role-name ecsTaskExecutionRole \
 --policy-name ecsTaskExecutionPermissions \
 --policy-document '{
"Version": "2012-10-17",
"Statement": [
{
"Effect": "Allow",
"Action": [
"logs:CreateLogStream",
"logs:PutLogEvents",
"logs:DescribeLogStreams",
"ecr:GetAuthorizationToken",
"ecr:BatchCheckLayerAvailability",
"ecr:GetRepositoryPolicy",
"ecr:BatchGetImage"
],
"Resource": "\*"
}
]
}'
