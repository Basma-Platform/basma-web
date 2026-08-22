import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { AxiosError } from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSignInAlt, FaUserLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import "./LoginForm.css";

interface LoginFormValues {
  email: string;
  password: string;
  remember_me: boolean;
}

type LoginField = "email" | "password";
type LoginErrors = Partial<Record<LoginField | "general", string>>;

interface LoginApiError {
  message?: string;
  code?: "EMAIL_NOT_VERIFIED" | "ACCOUNT_SUSPENDED" | "ACCOUNT_BLOCKED";
  errors?: Partial<Record<LoginField, string[]>>;
}

interface LoginLocationState {
  from?: { pathname?: string };
}

const validateLogin = (form: LoginFormValues): LoginErrors => {
  const errors: LoginErrors = {};

  if (!form.email.trim()) errors.email = "البريد الإلكتروني مطلوب";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }

  if (!form.password) errors.password = "كلمة المرور مطلوبة";

  return errors;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginFormValues>({
    email: "",
    password: "",
    remember_me: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const clearError = (field: LoginField) => {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      general: undefined,
    }));
  };

  const validateField = (field: LoginField) => {
    setErrors((current) => ({
      ...current,
      [field]: validateLogin(form)[field],
    }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as LoginField;
    setForm((current) => ({ ...current, [field]: event.target.value }));
    clearError(field);
    setRequiresVerification(false);
    setResendMessage(null);
  };

  const handleApiError = (error: AxiosError<LoginApiError>) => {
    const response = error.response;
    const code = response?.data.code;

    if (code === "EMAIL_NOT_VERIFIED") {
      setRequiresVerification(true);
      return "يرجى تأكيد بريدك الإلكتروني أولاً";
    }

    if (code === "ACCOUNT_SUSPENDED") {
      return "حسابك معلق. يرجى التواصل مع الدعم";
    }

    if (code === "ACCOUNT_BLOCKED") {
      return "حسابك محظور. يرجى التواصل مع الدعم";
    }

    if (response?.status === 401) {
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
    }

    return response?.data.message ?? "تعذر تسجيل الدخول. حاول مرة أخرى.";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clientErrors = validateLogin(form);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setRequiresVerification(false);
    setResendMessage(null);

    try {
      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        remember_me: form.remember_me,
      });

      const state = location.state as LoginLocationState | null;
      const destination = state?.from?.pathname || "/dashboard";

      navigate(destination, {
        replace: true,
        state: { welcomeMessage: "مرحباً بعودتك" },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors({ general: handleApiError(error) });
      } else {
        setErrors({ general: "حدث خطأ غير متوقع. حاول مرة أخرى." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resendVerification = async () => {
    if (!form.email.trim()) return;

    setResending(true);
    setResendMessage(null);

    try {
      const response = await authService.resendVerificationEmail(
        form.email.trim(),
      );
      setResendMessage(
        response.message || "تم إرسال رابط تحقق جديد إلى بريدك الإلكتروني.",
      );
    } catch {
      setErrors({ general: "تعذر إعادة إرسال رابط التحقق. حاول مرة أخرى." });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="login-card">
      <div className="login-card__header">
        <span className="login-card__icon">
          <FaUserLock />
        </span>
        <h1 className="login-card__title">تسجيل الدخول</h1>
        <p className="login-card__description">مرحباً بعودتك إلى منصة بصمة</p>
      </div>

      {errors.general && (
        <Alert variant={requiresVerification ? "warning" : "danger"}>
          {errors.general}

          {requiresVerification && (
            <div className="login-form__verification-actions">
              <Button
                size="sm"
                variant="warning"
                type="button"
                disabled={resending}
                onClick={() => void resendVerification()}
              >
                {resending ? <Spinner size="sm" /> : "إعادة إرسال رابط التحقق"}
              </Button>
              <Link to="/verify-email" state={{ email: form.email }}>
                صفحة تأكيد البريد
              </Link>
            </div>
          )}
        </Alert>
      )}

      {resendMessage && <Alert variant="success">{resendMessage}</Alert>}

      <Form className="login-form" noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login-email">
          <Form.Label className="login-form__label">
            البريد الإلكتروني <span className="login-form__required">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={() => validateField("email")}
            isInvalid={Boolean(errors.email)}
            autoComplete="email"
            dir="ltr"
            placeholder="name@example.com"
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="login-password">
          <Form.Label className="login-form__label">
            كلمة المرور <span className="login-form__required">*</span>
          </Form.Label>
          <div className="login-form__password-wrap">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => validateField("password")}
              isInvalid={Boolean(errors.password)}
              autoComplete="current-password"
              placeholder="أدخل كلمة المرور"
            />
            <button
              className="login-form__password-toggle"
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        <div className="login-form__options mb-4">
          <Form.Check
            id="remember-me"
            checked={form.remember_me}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                remember_me: event.target.checked,
              }));
            }}
            label="تذكرني لمدة 30 يوماً"
          />
          <Link to="/forgot-password">نسيت كلمة المرور؟</Link>
        </div>

        <Button
          className="login-form__submit w-100"
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Spinner size="sm" className="ms-2" /> جاري تسجيل الدخول...
            </>
          ) : (
            <>
              <FaSignInAlt className="ms-2" /> تسجيل الدخول
            </>
          )}
        </Button>
      </Form>

      <p className="login-card__footer">
        ليس لديك حساب؟ <Link to="/register">إنشاء حساب جديد</Link>
      </p>
    </div>
  );
};

export default LoginForm;
