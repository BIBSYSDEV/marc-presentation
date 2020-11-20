package no.unit.oria;

import org.apache.commons.lang3.StringUtils;

public class Config {

    public static final String MISSING_ENVIRONMENT_VARIABLES = "Missing environment variables";
    public static final String CORS_ALLOW_ORIGIN_HEADER_ENVIRONMENT_NAME = "ALLOWED_ORIGIN";
    public static final String AUTHORITY_SRU_HOST = "AUTHORITY_SRU_HOST";
    private String authoritySruHost = "authority.bibsys.no/authority/rest/sru";

    private String corsHeader;


    private Config() {
    }

    private static class LazyHolder {

        private static final Config INSTANCE = new Config();

        static {
            INSTANCE.setAuthoritySruHost(System.getenv(AUTHORITY_SRU_HOST));
            INSTANCE.setCorsHeader(System.getenv(CORS_ALLOW_ORIGIN_HEADER_ENVIRONMENT_NAME));
        }
    }

    public static Config getInstance() {
        return LazyHolder.INSTANCE;
    }

    /**
     * Checking if bareHost and bareApiKey are present.
     *
     * @return true if both properties are present.
     */
    public boolean checkProperties() {
        if (StringUtils.isEmpty(authoritySruHost)) {
            throw new RuntimeException(MISSING_ENVIRONMENT_VARIABLES);
        }
        return true;
    }

    public String getAuthoritySruHost() {
        return authoritySruHost;
    }

    public void setAuthoritySruHost(String authoritySruHost) {
        this.authoritySruHost = authoritySruHost;
    }

    public String getCorsHeader() {
        return corsHeader;
    }

    public void setCorsHeader(String corsHeader) {
        this.corsHeader = corsHeader;
    }

}
