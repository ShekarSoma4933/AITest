package com.Infy.nab.dto;

import org.springframework.web.multipart.MultipartFile;

public class S3UploaderDto{
	
	
  private String keyName;
  private MultipartFile multiFilePart;
  private String error;
  
  public S3UploaderDto() {}
  
  public String getKeyName() {
    return keyName;
  }
  
  public void setKeyName(String keyName) { this.keyName = keyName; }
  
  public MultipartFile getMultiFilePart() {
    return multiFilePart;
  }
  
  public void setMultiFilePart(MultipartFile multiFilePart) { this.multiFilePart = multiFilePart; }
  
  public String getError() {
    return error;
  }
  
  public void setError(String error) { this.error = error; }
  
  public S3UploaderDto(String keyName, MultipartFile multiFilePart, String error)
  {
    this.keyName = keyName;
    this.multiFilePart = multiFilePart;
    this.error = error;
  }
}