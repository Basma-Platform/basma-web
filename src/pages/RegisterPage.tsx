import { Container } from "react-bootstrap";
import RegisterForm from "../components/auth/RegisterForm";
import SEO from "../components/SEO";

const RegisterPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 0 72px",
        backgroundColor: "var(--bg-body)",
      }}
    >
      <SEO
        title="إنشاء حساب"
        description="أنشئ حسابك في منصة بصمة وانضم إلى مجتمع التبادل والتكافل في غزة."
      />
      <Container>
        <RegisterForm />
      </Container>
    </div>
  );
};

export default RegisterPage;
