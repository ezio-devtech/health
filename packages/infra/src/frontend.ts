import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets/lib';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { MedplumInfraConfig } from './config';

/**
 * Static app infrastructure, which deploys app content to an S3 bucket.
 *
 * The app redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class FrontEnd extends cdk.Construct {
  constructor(parent: cdk.Construct, config: MedplumInfraConfig) {
    super(parent, 'FrontEnd');

    const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: config.domainName,
    });

    // S3 bucket
    const appBucket = new s3.Bucket(this, 'AppBucket', {
      bucketName: config.appDomainName,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Access Identity for CloudFront to access S3
    const accessIdentity = new cloudfront.OriginAccessIdentity(this, 'AccessIdentity', {});
    appBucket.grantRead(accessIdentity);

    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'AppDistribution', {
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
        acm.Certificate.fromCertificateArn(this, 'AppCertificate', config.appSslCertArn),
        {
          aliases: [config.appDomainName],
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        }
      ),
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: appBucket,
            originAccessIdentity: accessIdentity,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Route53 alias record for the CloudFront distribution
    const record = new route53.ARecord(this, 'AppAliasRecord', {
      recordName: config.appDomainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone,
    });

    // Debug
    console.log('ARecord', record.domainName);
  }
}
