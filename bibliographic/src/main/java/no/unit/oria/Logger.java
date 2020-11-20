package no.unit.oria;

import org.apache.commons.lang3.exception.ExceptionUtils;

import java.util.Map;

public class Logger {



    protected enum LogLevel {
        ERROR, INFO;
    }

    private static class LazyHolder {

        public static final Logger INSTANCE = new Logger();
    }

    /**
     * Singleton instance for no.unit.oria.Logger.
     *
     * @return the one and only no.unit.oria.Logger instance
     */
    public static Logger instance() {
        return LazyHolder.INSTANCE;
    }

    public void error(Exception e) {
        error(e.getMessage());
        error(dumpException(e));
    }

    public void error(String errorMessage) {
        System.out.println(LogLevel.ERROR.name() + " - " + errorMessage);
    }

    public void info(Map<String, Object> infoMessage) {
        System.out.println(LogLevel.INFO.name() + " - " + infoMessage);
    }

    public void info(String infoMessage) {
        System.out.println(infoMessage);
    }

    private String dumpException(Exception e) {
        return ExceptionUtils.getStackTrace(e).replace("\n", "\r");
    }

}
