package no.unit.oria;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ConfigTest {

    @Test
    public void testCheckPropertiesNothingSet() {
        final Config config = Config.getInstance();
        config.setAuthoritySruHost(null);
        assertThrows(RuntimeException.class, config::checkProperties);
    }

    @Test
    public void testCorsHeaderNotSet() {
        final Config config = Config.getInstance();
        config.setCorsHeader(null);
        final String corsHeader = config.getCorsHeader();
        assertNull(corsHeader);
    }

    @Test
    public void testCheckPropertiesSet() {
        final Config instance = Config.getInstance();
        instance.setAuthoritySruHost(Config.AUTHORITY_SRU_HOST);
        assertTrue(instance.checkProperties());
    }

}
