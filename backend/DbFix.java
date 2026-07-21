import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DbFix {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/citizen360_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
                    "root", "root");
            Statement stmt = conn.createStatement();
            int rows = stmt.executeUpdate("UPDATE users SET approved = true WHERE email = 'admin@citizen360.com'");
            System.out.println("Database updated successfully. Rows affected: " + rows);
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
