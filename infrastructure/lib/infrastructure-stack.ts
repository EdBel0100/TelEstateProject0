import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //should be two folders, tickets and buildings, in each should have a folder with the manager/id and the images should be queried for tickets images and building images
    const imageBucket = new Bucket(this, 'TelEstateImageBucket', {
      bucketName: `telestate-image-bucket`,
      versioned: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.RETAIN, 
      autoDeleteObjects: false,
      enforceSSL: true,
    });

    //likely need 
     

  }
}
