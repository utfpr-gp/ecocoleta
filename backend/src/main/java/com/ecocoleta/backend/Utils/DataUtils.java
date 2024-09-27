package com.ecocoleta.backend.Utils;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class DataUtils {

    public static LocalDateTime convertToLocalDateTime(Timestamp timestamp) {
        if (timestamp != null) {
            return timestamp.toLocalDateTime();
        }
        return null;
    }

}
