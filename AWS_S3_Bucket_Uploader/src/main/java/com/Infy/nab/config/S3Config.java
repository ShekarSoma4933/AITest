package com.Infy.nab.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Configuration
public class S3Config{
	
  @Value("${poker493.aws.access_key_id}")
  private String awsId;
  @Value("${poker493.aws.secret_access_key}")
  private String awsKey;
  @Value("${poker493.s3.region}")
  private String region;
  
  public S3Config() {
	  
  }
  
  @Bean
  public AmazonS3 s3client(){
    BasicAWSCredentials awsCreds = new BasicAWSCredentials(awsId, awsKey);
    AmazonS3 s3Client = (AmazonS3)((AmazonS3ClientBuilder)((AmazonS3ClientBuilder)AmazonS3ClientBuilder.standard().withRegion(Regions.fromName(region))).withCredentials(new AWSStaticCredentialsProvider(awsCreds))).build();
    
    return s3Client;
  }
}