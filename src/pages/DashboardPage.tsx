import { Alert, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

interface DashboardLocationState {
  welcomeMessage?: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const { state } = useLocation();
  const welcomeMessage = (state as DashboardLocationState | null)
    ?.welcomeMessage;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 0 72px",
        backgroundColor: "var(--bg-body)",
      }}
    >
      <SEO title="لوحة التحكم" />
      <Container>
        {welcomeMessage && (
          <Alert variant="success">
            {welcomeMessage}، {user?.name}
          </Alert>
        )}
        <h1 style={{ color: "var(--text-secondary)" }}>لوحة التحكم</h1>
        <p style={{ color: "var(--text-muted)" }}>
          هذه صفحة مؤقتة إلى حين تنفيذ مهمة لوحة التحكم.
        </p>
      </Container>
    </div>
  );
};

export default DashboardPage;
