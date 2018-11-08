package com.Infy.nab.service.impl;

import com.Infy.nab.dto.S3UploaderDto;
import com.Infy.nab.service.S3UploadService;
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class S3UploadServiceImpl implements S3UploadService {
	
	  private Logger logger = LoggerFactory.getLogger(S3UploadServiceImpl.class);
	  
	  @Autowired
	  private AmazonS3 amazonS3;
	  
	  @Value("${poker493.s3.bucket}")
	  private String bucketName;
	  
	  S3UploaderDto s3UploaderDto = new S3UploaderDto();
  
	  public S3UploaderDto uploadFile(String keyName, MultipartFile file) {
	    try { ObjectMetadata metadata = new ObjectMetadata();
	      metadata.setContentLength(file.getSize());
	      amazonS3.putObject(bucketName, keyName, file.getInputStream(), metadata);
	      s3UploaderDto.setKeyName(keyName);
	      s3UploaderDto.setMultiFilePart(file);
	    }
	    catch (IOException ioe) {
	      logger.error("IOException: " + ioe.getMessage());
	    } catch (AmazonServiceException ase) {
	      logger.info("Caught an AmazonServiceException from PUT requests, rejected reasons:");
	      logger.info("Error Message:    " + ase.getMessage());
	      logger.info("HTTP Status Code: " + ase.getStatusCode());
	      logger.info("AWS Error Code:   " + ase.getErrorCode());
	      logger.info("Error Type:       " + ase.getErrorType());
	      logger.info("Request ID:       " + ase.getRequestId());
	    } catch (AmazonClientException ace) {
	      logger.info("Caught an AmazonClientException: ");
	      logger.info("Error Message: " + ace.getMessage());
	    }
	    return s3UploaderDto;
	  }
  
	  public ByteArrayOutputStream downloadFile(String keyName) {
	
			try {
	          S3Object s3object = amazonS3.getObject(new GetObjectRequest(bucketName, keyName));
	          
	          InputStream is = s3object.getObjectContent();
	          ByteArrayOutputStream baos = new ByteArrayOutputStream();
	          int len;
	          byte[] buffer = new byte[4096];
	          while ((len = is.read(buffer, 0, buffer.length)) != -1) {
	              baos.write(buffer, 0, len);
	          }
	          
	          return baos;
			} catch (IOException ioe) {
				logger.error("IOException: " + ioe.getMessage());
	      } catch (AmazonServiceException ase) {
	      	logger.info("sCaught an AmazonServiceException from GET requests, rejected reasons:");
				logger.info("Error Message:    " + ase.getMessage());
				logger.info("HTTP Status Code: " + ase.getStatusCode());
				logger.info("AWS Error Code:   " + ase.getErrorCode());
				logger.info("Error Type:       " + ase.getErrorType());
				logger.info("Request ID:       " + ase.getRequestId());
				throw ase;
	      } catch (AmazonClientException ace) {
	      	logger.info("Caught an AmazonClientException: ");
	          logger.info("Error Message: " + ace.getMessage());
	          throw ace;
	      }
			
			return null;
		
	  }

	  public List<String> listFiles(){
			
		  ListObjectsRequest listObjectsRequest = 
	              new ListObjectsRequest()
	                    .withBucketName(bucketName);
	                    //.withPrefix("test" + "/");
			
			List<String> keys = new ArrayList<>();
			
			ObjectListing objects = amazonS3.listObjects(listObjectsRequest);
			
			while (true) {
				List<S3ObjectSummary> summaries = objects.getObjectSummaries();
				if (summaries.size() < 1) {
					break;
				}
				
				for (S3ObjectSummary item : summaries) {
		            if (!item.getKey().endsWith("/"))
		            	keys.add(item.getKey());
		        }
				
				objects = amazonS3.listNextBatchOfObjects(objects);
			}
			
			return keys;
	  }
  
	  public void deleteFile(String keyName){
	    try {
	      amazonS3.deleteObject(new DeleteObjectRequest(bucketName, keyName));
	    } catch (AmazonServiceException ase) {
	      logger.info("Caught an AmazonServiceException from PUT requests, rejected reasons:");
	      logger.info("Error Message:    " + ase.getMessage());
	      logger.info("HTTP Status Code: " + ase.getStatusCode());
	      logger.info("AWS Error Code:   " + ase.getErrorCode());
	      logger.info("Error Type:       " + ase.getErrorType());
	      logger.info("Request ID:       " + ase.getRequestId());
	      throw ase;
	    } catch (SdkClientException sce) {
	      logger.info("Caught an SdkClientException: ");
	      logger.info("Error Message: " + sce.getMessage());
	      throw sce;
	    }
	  }
}
