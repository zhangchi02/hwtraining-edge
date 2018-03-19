/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.huawei.huaweiair.edge.service;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.http.HttpServletResponse;

import org.apache.servicecomb.edge.core.AbstractEdgeDispatcher;
import org.apache.servicecomb.edge.core.EdgeInvocation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.client.RestTemplate;

import com.huawei.huaweiair.edge.service.auth.User;

import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpMethod;
import io.vertx.ext.web.Cookie;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.CookieHandler;
import net.sf.json.JSONArray;

@SuppressWarnings("unchecked")
public class ApiDispatcher extends AbstractEdgeDispatcher {

	private static final Logger LOGGER = LoggerFactory.getLogger(ApiDispatcher.class);
	private static final String LOGIN_USER = "hwtraining.login_user";
	private static final String LOGIN_PATH = "/hwtraining/v1/login";
	private static final String LOGOUT_PATH = "/hwtraining/v1/logout";
	private static final String SESSIONID_COOKIE_NAME = "sessionID";
	private static List<User> usersList;
	private static final Map<String, User> usersMap = new HashMap<String, User>();
	private static RestTemplate restTemplate = new RestTemplate();
	private static Timer timer = new Timer();

	static {
		timer.schedule(new TimerTask() {

			@Override
			public void run() {
				try {
					String userinfo = restTemplate
							.getForObject("https://hwtraining.obs.myhwclouds.com/tankuse/users.json", String.class);
					usersList = (List<User>) JSONArray.toCollection(JSONArray.fromObject(userinfo), User.class);
				} catch (Exception e) {
					LOGGER.error("get user info error: ", e);
				}
				if (null == usersList || usersList.isEmpty()) {
					usersList = new LinkedList<>();
					String sessionID = "0a3a8841-5ec3-49d2-a9d2-4f5b5197ac01";
					usersList.add(new User("admin", "2018", sessionID));
					usersList.add(new User("tank", "201801", sessionID));
					usersList.add(new User("zhangchi", "201802", sessionID));
					usersList.add(new User("liushanshan", "201803", sessionID));
					usersList.add(new User("test", "test1234", sessionID));
				}
				for (User user : usersList) {
					usersMap.put(user.getUserName(), user);
				}

			}
		}, 0, 5 * 60 * 1000);

	}

	@Override
	public int getOrder() {
		return 1;
	}

	@Override
	public void init(Router router) {
		String regex = "/([^\\\\/]+)/hwtraining/(.*)";
		router.routeWithRegex(regex).handler(CookieHandler.create());
		router.routeWithRegex(regex).handler(createBodyHandler());
		router.routeWithRegex(regex).failureHandler(this::onFailure).handler(this::onRequest);
	}

	private void login(RoutingContext context) {
		User user = context.getBodyAsJson().mapTo(User.class);
		User targetUser = usersMap.get(user.getUserName());
		if (null == targetUser || !targetUser.getPassword().equals(user.getPassword())) {
			context.response().setStatusCode(HttpServletResponse.SC_FORBIDDEN);
			context.response().headers().add("Content-Type", "application/json");
			context.response().headers().add("Content-Length", "" + "illegal user".length());
			context.response().write(Buffer.buffer("illegal user"));
			context.response().end();
		} else {
			context.addCookie(Cookie.cookie(SESSIONID_COOKIE_NAME, targetUser.getSessionID()));
			context.response().setStatusCode(200);
			context.response().headers().add("loggedinuser", user.getUserName());
			context.response().headers().add("Content-Type", "application/json");
			context.response().headers().add("Content-Length", "" + "logged in succcess".length());
			context.response().write(Buffer.buffer("logged in succcess"));
			context.response().end();
		}
	}

	private void logout(RoutingContext context) {
		context.removeCookie(SESSIONID_COOKIE_NAME);
		context.response().setStatusCode(200);
		context.response().headers().add("Content-Type", "application/json");
		context.response().headers().add("Content-Length", "" + "logout succcess".length());
		context.response().write(Buffer.buffer("logout succcess"));
		context.response().end();
	}

	private String validateCustomerSession(String sessionId) {
		if (null == sessionId || sessionId.isEmpty()) {
			return null;
		}
		for (User user : usersList) {
			if (sessionId.equals(user.getSessionID())) {
				return user.getUserName();
			}
		}
		return null;
	}

	protected void onRequest(RoutingContext context) {

		Map<String, String> pathParams = context.pathParams();
		String microserviceName = pathParams.get("param0");
		String path = "/hwtraining" + "/" + pathParams.get("param1");
		if (path.equals(LOGIN_PATH)) {
			login(context);
		}
		if (path.equals(LOGOUT_PATH)) {
			logout(context);
		}
		HttpMethod httpMethod = context.request().method();
		if (path.contains("/hwtraining/v1/forumcontent") || (path.startsWith("/hwtraining/v1/studentscore") && httpMethod.name().equals(HttpMethod.GET.name()))
				||path.contains("/hwtraining/v1/survey")||path.contains("/hwtraining/v1/currentclassid")||path.contains("/hwtraining/v1/upload")||path.contains("/hwtraining/v1/import")) {

		} else {

			Set<Cookie> cookies = context.cookies();
			String loginUserName = null;
			if (null != cookies && !cookies.isEmpty()) {
				for (Cookie cookie : cookies) {
					if (cookie.getName().equals(SESSIONID_COOKIE_NAME) && null != cookie.getValue()) {
						loginUserName = validateCustomerSession(cookie.getValue().trim());
						break;
					}
				}
			}

			if (null == loginUserName || loginUserName.isEmpty()) {
				LOGGER.info("unauthenticated user.");
				context.response().setStatusCode(HttpServletResponse.SC_FORBIDDEN);
				context.response().end();
				return;
			} else {
				context.request().headers().add(LOGIN_USER, loginUserName);
				LOGGER.info("Customer {} validated success.", loginUserName);

			}
		}

		EdgeInvocation edgeInvocation = new EdgeInvocation();
		edgeInvocation.init(microserviceName, context, path, httpServerFilters);
		edgeInvocation.edgeInvoke();

	}

}
