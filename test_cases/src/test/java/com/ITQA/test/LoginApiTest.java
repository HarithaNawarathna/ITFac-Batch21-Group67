package com.itqa.test;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.Before;
import org.junit.Test;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class LoginApiTest {

    private static final String BASE_URL = "http://localhost:8080";
    private static final String LOGIN_ENDPOINT = "/ui/login";

    @Before
    public void setup() {
        RestAssured.baseURI = BASE_URL;
    }

    @Test
    public void testLoginWithInvalidUsername() {
        String requestBody = "{\n" +
                "  \"username\": \"invaliduser\",\n" +
                "  \"password\": \"admin123\"\n" +
                "}";

        given()
            .contentType(ContentType.JSON)
            .body(requestBody)
        .when()
            .post(LOGIN_ENDPOINT)
        .then()
            .statusCode(anyOf(is(401), is(403), is(400)));
    }
}
