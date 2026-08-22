import { Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";
import SEO from "../components/SEO";

interface VerificationLocationState {
  email?: string;
}

const VerifyEmailPage = () => {
  const { state } = useLocation();

  const email = (state as VerificationLocationState | null)?.email;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "80px 0",
        backgroundColor: "var(--bg-body)",
      }}
    >
      <SEO title="تأكيد البريد الإلكتروني" />

      <Container>
        <div className="register-card text-center" style={{ maxWidth: 620 }}>
          <FaEnvelopeOpenText
            size={62}
            color="var(--primary-orange)"
            className="mb-4"
          />

          <h1 className="register-card__title">تحقق من بريدك الإلكتروني</h1>

          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.9,
            }}
          >
            تم إرسال رابط التفعيل إلى{" "}
            {email ? <strong dir="ltr">{email}</strong> : "بريدك الإلكتروني"}.
            افتح الرسالة واضغط على رابط التحقق لتفعيل حسابك.
          </p>

          <p
            style={{
              color: "var(--text-muted)",
            }}
          >
            بعد تأكيد البريد الإلكتروني سيتم توجيهك إلى لوحة التحكم.
          </p>

          <div className="mt-4">
            <Link to="/">العودة إلى الصفحة الرئيسية</Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default VerifyEmailPage;