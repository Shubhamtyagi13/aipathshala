import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AiPathshalaFargateStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // 1. VPC Setup for 10,000 CCU scalability
        const vpc = new ec2.Vpc(this, 'AIPathshalaVpc', {
            maxAzs: 3 // High availability
        });

        // 2. Ephemeral S3 Bucket (Zero-Data Moat)
        // Enforcing strict lifecycle rules to delete scans implicitly just in case the app fails
        const ephemeralBucket = new s3.Bucket(this, 'EphemeralScansBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            lifecycleRules: [{
                expiration: cdk.Duration.days(1) // Failsafe for instant-delete code
            }]
        });

        // 3. SQS Job Queue for asynchronous Metadata & Grading tasks
        const gradingQueue = new sqs.Queue(this, 'GradingJobQueue', {
            visibilityTimeout: cdk.Duration.seconds(300)
        });

        // 4. ECS Cluster
        const cluster = new ecs.Cluster(this, 'AIPathshalaCluster', {
            vpc: vpc
        });

        // 5. Fargate Task Definition (Node.js Microservices)
        const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'BackendTaskDef', {
            memoryLimitMiB: 2048,
            cpu: 1024,
        });

        // Grant Task permissions (S3 ephemeral, SQS)
        ephemeralBucket.grantReadWrite(fargateTaskDefinition.taskRole);
        gradingQueue.grantSendMessages(fargateTaskDefinition.taskRole);

        const container = fargateTaskDefinition.addContainer('BackendContainer', {
            // Mock docker image. In reality, we link local registry
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'AIPathshalaLogs' }),
            environment: {
                'EPHEMERAL_BUCKET_NAME': ephemeralBucket.bucketName,
                'GRADING_QUEUE_URL': gradingQueue.queueUrl,
                // Mock Env Vars for Data Stack
                'NEO4J_URI': 'bolt://mocked.neo4j.aura:7687',
            }
        });

        container.addPortMappings({
            containerPort: 3000
        });

        // 6. Application Load Balanced Fargate Service
        new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'BackendFargateService', {
            cluster: cluster,
            cpu: 1024,
            desiredCount: 2, // Scalable base
            taskDefinition: fargateTaskDefinition,
            memoryLimitMiB: 2048,
            publicLoadBalancer: true
        });
    }
}
