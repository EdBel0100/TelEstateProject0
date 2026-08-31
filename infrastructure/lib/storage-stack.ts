import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //building images, ticket images, //future conversation images
    const ticketImageBucket = new Bucket(this, 'TelEstateTicketImageBucket', {
      bucketName: `telestate-ticket-image-bucket`,
    });

    
    //should have /{manager}/{month}
    const paymentDataBuckets = new Bucket(this, 'TelEstatePaymentDataBucket', {
        bucketName: `telestate-payment-data-bucket`,
      });


     

  }
}
