import { useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import { FaEnvelopeOpenText } from "react-icons/fa";
import SEO from "../components/SEO";
import { authService } from "../services/authService";

interface VerificationLocationState {
  email?: string;
}

const VerifyEmailPage = () => {
  const { state } = useLocation();
  const email = (state as VerificationLocationState | null)?.email;
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resendEmail = async () => {
    if (!email) return;
    setSending(true);
    setMessage(null);
    setError(null);
    try {
      const response = await authService.resendVerificationEmail(email);
      setMessage(response.message || "تم إرسال رسالة تحقق جديدة.");
    } catch (requestError) {
      if (requestError instanceof AxiosError) {
        setError(
          requestError.response?.data?.message ||
            "تعذر إعادة إرسال رسالة التحقق.",
        );
      } else setError("حدث خطأ غير متوقع.");
    } finally {
      setSending(false);
    }
  };

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
          <p style={{ color: "var(--text-muted)", lineHeight: 1.9 }}>
            أرسلنا رابط تفعيل الحساب إلى{" "}
            {email ? <strong dir="ltr">{email}</strong> : "بريدك الإلكتروني"}.
            افتح الرسالة واضغط رابط التحقق، وبعدها سيتم توجيهك إلى لوحة التحكم.
          </p>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          {email && (
            <Button
              className="register-form__submit px-4"
              onClick={() => void resendEmail()}
              disabled={sending}
            >
              {sending ? (
                <>
                  <Spinner size="sm" className="ms-2" /> جاري الإرسال...
                </>
              ) : (
                "إعادة إرسال رابط التحقق"
              )}
            </Button>
          )}
          <div className="mt-4">
            <Link to="/">العودة إلى الصفحة الرئيسية</Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default VerifyEmailPage;
