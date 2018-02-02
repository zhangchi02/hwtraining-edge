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
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.apache.servicecomb.edge.core.AbstractEdgeDispatcher;
import org.apache.servicecomb.edge.core.EdgeInvocation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.huawei.huaweiair.edge.service.auth.User;

import io.vertx.core.buffer.Buffer;
import io.vertx.ext.web.Cookie;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.CookieHandler;

public class ApiDispatcher extends AbstractEdgeDispatcher {

	private static final Logger LOGGER = LoggerFactory.getLogger(ApiDispatcher.class);
	private static final String LOGIN_USER = "hwtraining.login_user";
	private static final String LOGIN_PATH = "/hwtraining/v1/login";
	private static final String SESSIONID_COOKIE_NAME = "sessionID";
	private static final Map<String, String> users = new HashMap<>();
	private static final Map<String, String> sessions = new HashMap<>();
	static {
		users.put("admin", "2018");
		sessions.put("admin", "0a3a8841-5ec3-49d2-a9d2-4f5b5197ac01");
		users.put("zhangchi", "201801");
		sessions.put("admin", "0a3a8841-5ec3-49d2-a9d2-4f5b5197ac02");
		users.put("tank", "201802");
		sessions.put("admin", "0a3a8841-5ec3-49d2-a9d2-4f5b5197ac03");
		users.put("liushanshan", "201803");
		sessions.put("admin", "0a3a8841-5ec3-49d2-a9d2-4f5b5197ac04");
		users.put("default", "huaweicool");
		sessions.put("admin", "0a3a8841-5ec3-49d2-a9d2-4f5b5197ac05");
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
		String password = users.get(user.getUserName());
		if (null == password || password.isEmpty() || !password.equals(user.getPassword())) {
			context.response().setStatusCode(HttpServletResponse.SC_FORBIDDEN);
			context.response().headers().add("Content-Type", "application/json");
			context.response().headers().add("Content-Length", "" + "illegal user".length());
			context.response().write(Buffer.buffer("illegal user"));
			context.response().end();
		} else {
			String sessionID = sessions.get(user.getUserName());
			context.addCookie(Cookie.cookie(SESSIONID_COOKIE_NAME, sessionID));
			context.response().setStatusCode(200);
			context.response().headers().add("Content-Type", "application/json");
			context.response().headers().add("Content-Length", "" + "logged in succcess".length());
			context.response().write(Buffer.buffer("logged in succcess"));
			context.response().end();
		}
	}
	private String validateCustomerSession(String sessionId) {
		if (null == sessionId || sessionId.isEmpty()) {
			return null;
		}
		for(Object obj : sessions.keySet()) {
	        String tempUserName = (String) obj;
	        String tempSessionID = (String) sessions.get(tempUserName);
	        if(sessionId.equals(tempSessionID))
	        {
	        	return tempUserName;
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

		if (path.contains("/hwtraining/v1/forumcontent") || path.startsWith("/hwtraining/v1/studentscore")) {

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

			if (null == loginUserName||loginUserName.isEmpty()) {
				LOGGER.info("unauthenticated user.");
				context.response().setStatusCode(HttpServletResponse.SC_FORBIDDEN);
				context.response().end();
				return;
			} else {
				context.request().headers().add(LOGIN_USER,loginUserName);
				LOGGER.info("Customer {} validated success.", loginUserName);

			}
		}

		EdgeInvocation edgeInvocation = new EdgeInvocation();
		edgeInvocation.init(microserviceName, context, path, httpServerFilters);
		edgeInvocation.edgeInvoke();

	}

}
