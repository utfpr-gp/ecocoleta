package com.ecocoleta.backend.Utils;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKTReader;
//import org.locationtech.jts.io.WKBReader;
import org.postgis.*;
//import org.locationtech.jts.geom.Point;
//import org.locationtech.jts.io.WKBReader;
//import org.locationtech.jts.geom.Coordinate;
//import org.locationtech.jts.geom.GeometryFactory;

public class DataUtils {

    public static LocalDateTime convertToLocalDateTime(Timestamp timestamp) {
        if (timestamp != null) {
            return timestamp.toLocalDateTime();
        }
        return null;
    }

//    public static Point convertToPoint(byte[] pgGeometry) {
//        if (pgGeometry != null) {
//            try {
//                // Utilize a biblioteca JTS para converter
//                WKBReader wkbReader = new WKBReader();
////                GeometryFactory geometryFactory = new GeometryFactory((CoordinateSequenceFactory) wkbReader.read(pgGeometry).getFactory());
////                var z = (Point) wkbReader.read(pgGeometry);
//                return (Point) wkbReader.read(pgGeometry);
//            } catch (Exception e) {
//                e.printStackTrace(); // Trate a exceção adequadamente
//            }
//        }
//        return null;
//    }

    //    public static Point convertToPoint(byte[] wkb) {
//        if (wkb != null) {
//            try {
//                WKBReader wkbReader = new WKBReader();
//                Geometry geometry = wkbReader.read(wkb);
//                if (geometry instanceof Point) {
//                    return (Point) geometry;
//                }
//            } catch (Exception e) {
//                e.printStackTrace(); // Trate a exceção adequadamente
//            }
//        }
//        return null;
//    }
//    public static Point convertToPoint(byte[] wkb) {
//        if (wkb != null && wkb.length > 0) {
//            try {
//                WKBReader wkbReader = new WKBReader();
//                Geometry geometry = wkbReader.read(wkb);
//
//                if (geometry instanceof Point) {
//                    return (Point) geometry;
//                } else {
//                    System.err.println("Geometria não é um ponto: " + geometry.getClass().getName());
//                }
//            } catch (Exception e) {
//                e.printStackTrace(); // Trate a exceção adequadamente
//            }
//        }
//        return null;
//    }
//    public static Point convertToPoint(String wkt) {
//        if (wkt != null && !wkt.isEmpty()) {
//            try {
//                WKTReader wktReader = new WKTReader();
//                Geometry geometry = wktReader.read(wkt);
//                if (geometry instanceof Point) {
//                    return (Point) geometry;
//                }
//            } catch (Exception e) {
//                e.printStackTrace(); // Trate a exceção adequadamente
//            }
//        }
//        return null;
//    }

}
