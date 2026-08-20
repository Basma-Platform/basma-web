import { Container } from "react-bootstrap";
import LoginForm from "../components/auth/LoginForm";
import SEO from "../components/SEO";

const LoginPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 0 72px",
        backgroundColor: "var(--bg-body)",
      }}
    >
      <SEO
        title="تسجيل الدخول"
        description="سجل دخولك إلى منصة بصمة للوصول إلى حسابك وخدمات المنصة."
      />
      <Container>
        <LoginForm />
      </Container>
    </div>
  );
};

export default LoginPage;
