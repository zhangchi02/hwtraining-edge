package com.huawei.huaweiair.edge.service.auth;

/**
 * 
 * 
 * @author TankTian
 * @date 2018年2月2日
 */
public class User {
	private String userName;
	private String password;
	private String sessionID;


	public User(String userName, String password, String sessionID) {
		this.userName = userName;
		this.password = password;
		this.sessionID = sessionID;
	}
	public User(String userName, String password) {
		this.userName = userName;
		this.password = password;
	}

	public User() {
	}

	public String getSessionID() {
		return sessionID;
	}

	public void setSessionID(String sessionID) {
		this.sessionID = sessionID;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
