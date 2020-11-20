package no.unit.oria;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.Objects;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;

import static org.apache.http.HttpStatus.SC_BAD_REQUEST;
import static org.apache.http.HttpStatus.SC_INTERNAL_SERVER_ERROR;
import static org.apache.http.HttpStatus.SC_OK;

/**
 * Handler for requests to Lambda function.
 */
public class GetAuthorityHandler implements RequestHandler<Map<String, Object>, GatewayResponse> {

    protected static final String MISSING_PARAMETERS = "Missing parameters! Query parameter not set.";
    public static final String QUERY_STRING_PARAMETERS_KEY = "queryStringParameters";
    public static final String AUTH_ID = "auth_id";
    protected final transient AuthorityProxy authorityProxy;

    public GetAuthorityHandler() {
        authorityProxy = new AuthorityProxy();
    }

    public GetAuthorityHandler(AuthorityProxy authorityProxy) {
        this.authorityProxy = authorityProxy;
    }

    /**
     * Main lambda function to get authority metadata from Authority-Sru.
     * @param input payload with identifying parameters
     * @return a GatewayResponse
     */
    @Override
    @SuppressWarnings("unchecked")
    public GatewayResponse handleRequest(final Map<String, Object> input, Context context) {
        System.out.println(input);
        Config.getInstance().checkProperties();
        GatewayResponse gatewayResponse  = new GatewayResponse();

        if (input != null && input.containsKey(QUERY_STRING_PARAMETERS_KEY)) {
            Map<String, String> queryStringParameters = (Map<String, String>) input.get(QUERY_STRING_PARAMETERS_KEY);
            if (!Objects.isNull(queryStringParameters) && queryStringParameters.containsKey(AUTH_ID)) {
                String auth_id = queryStringParameters.get(AUTH_ID);
                if (!StringUtils.isEmpty(auth_id)) {
                    try {
                        final String authoritySRU = this.authorityProxy.callAuthoritySRU(auth_id);
                        //Todo: maybe we should convert sru response a bit??? What does frontend need?
                        gatewayResponse.setBody(authoritySRU);
                        gatewayResponse.setStatusCode(SC_OK);
                    } catch (IOException | URISyntaxException e) {
                        gatewayResponse.setErrorBody(e.getMessage());
                        gatewayResponse.setStatusCode(SC_INTERNAL_SERVER_ERROR);
                    }
                } else {
                    gatewayResponse.setErrorBody(MISSING_PARAMETERS);
                    gatewayResponse.setStatusCode(SC_BAD_REQUEST);
                }
            } else {
                gatewayResponse.setErrorBody(MISSING_PARAMETERS);
                gatewayResponse.setStatusCode(SC_BAD_REQUEST);
            }
        } else {
            gatewayResponse.setErrorBody(MISSING_PARAMETERS);
            gatewayResponse.setStatusCode(SC_BAD_REQUEST);
        }

        return gatewayResponse;
    }
}
