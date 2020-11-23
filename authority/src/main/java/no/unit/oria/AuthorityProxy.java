package no.unit.oria;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.HttpClientBuilder;

public class AuthorityProxy {

    public String callAuthoritySRU(String auth_id) throws IOException, URISyntaxException {
        String cql = "rec.identifier=\"" + auth_id + "\"";
        String messageBody = "";
        try {
            URIBuilder uriBuilder = new URIBuilder();
            uriBuilder.setScheme("https");
            uriBuilder.setHost(Config.getInstance().getAuthoritySruHost());
            uriBuilder.addParameter("operation", "searchRetrieve");
            uriBuilder.addParameter("version", "1.2");
            uriBuilder.addParameter("query", cql);
            URI sruUri = uriBuilder.build();
            HttpResponse httpResponse = getHttpResponse(sruUri);
            if (httpResponse.getStatusLine().getStatusCode() < 400 ) {
                messageBody = sruResponseToString(httpResponse);
            } else {
                final String errorMsg = "Error from Authority-SRU calling " + sruUri.toString() + " : "
                    + httpResponse.getStatusLine().getStatusCode() + " - "
                    + httpResponse.getStatusLine().getReasonPhrase();
                System.err.println(errorMsg);
                throw new IOException(errorMsg);
            }
        } catch (IOException | URISyntaxException | NullPointerException e) {
            System.err.println("Couldn't access Authority sru-server calling " + cql);
            System.err.println(e.getMessage());
            throw e;
        }
        return messageBody;
    }

    protected HttpResponse getHttpResponse(URI sruUri) throws IOException {
        System.out.println("Sending SRU-request: " + sruUri.toString());
        long begin = System.currentTimeMillis();
        HttpClient httpclient = HttpClientBuilder.create().build();
        RequestConfig.Builder requestConfigBuilder = RequestConfig.custom();
        requestConfigBuilder.setConnectionRequestTimeout(10000).setSocketTimeout(10000);
        HttpGet httpGet = new HttpGet(sruUri);
        httpGet.setConfig(requestConfigBuilder.build());
        HttpResponse httpResponse = httpclient.execute(httpGet);
        long end = System.currentTimeMillis();
        System.out.println("SRU-request took: " + (end - begin) + "ms");
        return httpResponse;
    }

    private String sruResponseToString(HttpResponse response) throws IOException {
        try {
            InputStream responseBody = response.getEntity().getContent();
            return inputStreamToString(responseBody);
        } catch (IOException e) {
            System.err.println("Couldn't read inputStream from httpResponse");
            System.err.println(e.getMessage());
            throw e;
        }
    }

    protected static String inputStreamToString(InputStream responseBody) throws IOException {
        StringBuilder body = new StringBuilder();
        BufferedReader reader = new BufferedReader(new InputStreamReader(responseBody, StandardCharsets.UTF_8));
        String line;
        while ((line = reader.readLine()) != null) {
            body.append(line).append('\n');
        }
        reader.close();
        return body.toString();
    }
}
