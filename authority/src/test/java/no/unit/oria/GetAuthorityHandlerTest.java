package no.unit.oria;

import org.apache.http.HttpHeaders;
import org.apache.http.HttpStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class GetAuthorityHandlerTest {

    public static final String AUTHORITY_SRU_RESPONSE_XML_FILE = "/authority_sru.xml";
    public static final String EMPTY_AUTHORITY_RESPONSE_XML_FILE = "/authority_empty.xml";
    public static final String MY_MOCK_THROWS_AN_EXCEPTION = "my mock throws an exception";
    public static final String SAMPLE_IDENTIFIER = "90061718";
    public static String APPLICATION_JSON = "application/json";

    private AuthorityProxy mockAuthorityProxy;


    /**
     * Initialise mocks and Config.
     */
    @BeforeEach
    public void setUp() {
        mockAuthorityProxy = mock(AuthorityProxy.class);
        final Config config = Config.getInstance();
        config.setAuthoritySruHost(Config.AUTHORITY_SRU_HOST);
    }

    @Test
    public void testSuccessfulResponseWithNameParam() throws Exception {
        InputStream st = GetAuthorityHandlerTest.class.getResourceAsStream(AUTHORITY_SRU_RESPONSE_XML_FILE);
        final String sruResponse = AuthorityProxy.inputStreamToString(st);
        when(mockAuthorityProxy.callAuthoritySRU(any())).thenReturn(sruResponse);
        Map<String, Object> event = new HashMap<>();

        Map<String, String> queryParameters = new HashMap<>();
        queryParameters.put(GetAuthorityHandler.AUTH_ID, SAMPLE_IDENTIFIER);
        event.put(GetAuthorityHandler.QUERY_STRING_PARAMETERS_KEY, queryParameters);

        GetAuthorityHandler mockGetAuthorityHandler = new GetAuthorityHandler(this.mockAuthorityProxy);
        GatewayResponse result = mockGetAuthorityHandler.handleRequest(event, null);
        assertEquals(HttpStatus.SC_OK, result.getStatusCode());
        assertEquals(result.getHeaders().get(HttpHeaders.CONTENT_TYPE), APPLICATION_JSON);
        String content = result.getBody();
        assertNotNull(content);
        assertEquals(sruResponse, content);
    }

    @Test
    public void handlerReturnsInternalServerErrorResponseWhenErrorGettingAuthority() throws Exception {
        when(mockAuthorityProxy.callAuthoritySRU(any())).thenThrow(new IOException(MY_MOCK_THROWS_AN_EXCEPTION));
        Map<String, Object> event = new HashMap<>();
        Map<String, String> queryParameters = new HashMap<>();
        queryParameters.put(GetAuthorityHandler.AUTH_ID, SAMPLE_IDENTIFIER);
        event.put(GetAuthorityHandler.QUERY_STRING_PARAMETERS_KEY, queryParameters);
        GetAuthorityHandler mockAuthorityProxy = new GetAuthorityHandler(this.mockAuthorityProxy);
        GatewayResponse result = mockAuthorityProxy.handleRequest(event, null);
        assertEquals(HttpStatus.SC_INTERNAL_SERVER_ERROR, result.getStatusCode());
        String content = result.getBody();
        assertNotNull(content);
        assertTrue(content.contains(MY_MOCK_THROWS_AN_EXCEPTION));
    }

    @Test
    public void testHandlerWithNull_QueryParams()  {
        Map<String, Object> event = new HashMap<>();
        event.put(GetAuthorityHandler.QUERY_STRING_PARAMETERS_KEY, null);
        GetAuthorityHandler mockAuthorityProxy = new GetAuthorityHandler(this.mockAuthorityProxy);
        GatewayResponse result = mockAuthorityProxy.handleRequest(event, null);
        assertEquals(HttpStatus.SC_BAD_REQUEST, result.getStatusCode());
        String content = result.getBody();
        assertNotNull(content);
        assertTrue(content.contains(GetAuthorityHandler.MISSING_PARAMETERS));
    }

    @Test
    public void testResponseWithoutQueryParams()  {
        GetAuthorityHandler mockAuthorityProxy = new GetAuthorityHandler(this.mockAuthorityProxy);
        GatewayResponse result = mockAuthorityProxy.handleRequest(null, null);
        assertEquals(HttpStatus.SC_BAD_REQUEST, result.getStatusCode());

        Map<String, Object> event = new HashMap<>();
        result = mockAuthorityProxy.handleRequest(event, null);
        assertEquals(HttpStatus.SC_BAD_REQUEST, result.getStatusCode());

        Map<String, String> queryParameters = new HashMap<>();
        event.put(GetAuthorityHandler.QUERY_STRING_PARAMETERS_KEY, queryParameters);
        result = mockAuthorityProxy.handleRequest(event, null);
        assertEquals(HttpStatus.SC_BAD_REQUEST, result.getStatusCode());
    }

    @Test
    public void testEmptyHitListResponse() throws Exception {
        InputStream inputStream = GetAuthorityHandlerTest.class.getResourceAsStream(EMPTY_AUTHORITY_RESPONSE_XML_FILE);
        final String sruResponse = AuthorityProxy.inputStreamToString(inputStream);
        when(mockAuthorityProxy.callAuthoritySRU(any())).thenReturn(sruResponse);
        Map<String, Object> event = new HashMap<>();

        Map<String, String> queryParameters = new HashMap<>();
        queryParameters.put(GetAuthorityHandler.AUTH_ID, SAMPLE_IDENTIFIER);

        event.put(GetAuthorityHandler.QUERY_STRING_PARAMETERS_KEY, queryParameters);

        GetAuthorityHandler mockAuthorityProxy = new GetAuthorityHandler(this.mockAuthorityProxy);
        GatewayResponse result = mockAuthorityProxy.handleRequest(event, null);
        assertEquals(HttpStatus.SC_OK, result.getStatusCode());
        assertEquals(result.getHeaders().get(HttpHeaders.CONTENT_TYPE), APPLICATION_JSON);
        String content = result.getBody();
        assertNotNull(content);
    }

    @Test
    public void testFailingRequest() throws Exception {
        when(mockAuthorityProxy.callAuthoritySRU(any())).thenThrow(new IOException(MY_MOCK_THROWS_AN_EXCEPTION));
        Map<String, Object> event = new HashMap<>();
        Map<String, String> queryParameters = new HashMap<>();
        queryParameters.put(GetAuthorityHandler.AUTH_ID, SAMPLE_IDENTIFIER);
        event.put(GetAuthorityHandler.QUERY_STRING_PARAMETERS_KEY, queryParameters);
        GetAuthorityHandler mockAuthorityProxy = new GetAuthorityHandler(this.mockAuthorityProxy);
        GatewayResponse result = mockAuthorityProxy.handleRequest(event, null);
        assertEquals(HttpStatus.SC_INTERNAL_SERVER_ERROR, result.getStatusCode());
        String content = result.getBody();
        assertNotNull(content);
        assertTrue(content.contains(MY_MOCK_THROWS_AN_EXCEPTION));
    }

    @Test
    public void testNoBodyRequest() {
        Map<String, Object> event = new HashMap<>();
        GetAuthorityHandler GetAuthorityHandler = new GetAuthorityHandler();
        GatewayResponse result = GetAuthorityHandler.handleRequest(event, null);
        assertEquals(HttpStatus.SC_BAD_REQUEST, result.getStatusCode());
        String content = result.getBody();
        assertNotNull(content);
        assertTrue(content.contains(GetAuthorityHandler.MISSING_PARAMETERS));
    }


    protected static String readJsonStringFromFile(String fetchAuthorityEventJsonAllParameters) {
        InputStream stream = GetAuthorityHandlerTest.class.getResourceAsStream(fetchAuthorityEventJsonAllParameters);
        String postRequestBody;
        try (Scanner scanner = new Scanner(stream, StandardCharsets.UTF_8.name())) {
            postRequestBody = scanner.useDelimiter("\\A").next();
        }
        return postRequestBody;
    }

}
