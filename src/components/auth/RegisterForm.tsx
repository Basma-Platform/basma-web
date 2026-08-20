import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Button, Col, Form, Row, Spinner, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { FaEye, FaEyeSlash, FaShieldAlt, FaUserPlus } from "react-icons/fa";
import { authService } from "../../services/authService";
import { regionService } from "../../services/regionService";
import type { City, Governorate, RegisterPayload } from "../../types";
import "./RegisterForm.css";

type FieldName =
  | "name"
  | "email"
  | "password"
  | "password_confirmation"
  | "whatsapp"
  | "governorate_id"
  | "city_id"
  | "terms_accepted";

type FormErrors = Partial<Record<FieldName | "general", string>>;

type PhonePrefix = "+970" | "+972";

const countryOptions = [
  { value: "+970", label: "+970", flag: "https://flagcdn.com/w40/ps.png", alt: "ps" },
  { value: "+972", label: "+972", flag: "https://flagcdn.com/w40/il.png", alt: "il" },
];

// const [phonePrefix, setPhonePrefix] = useState<PhonePrefix>("+970");

interface LaravelValidationError {
  message?: string;
  errors?: Partial<Record<FieldName, string[]>>;
}

const initialForm: RegisterPayload = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  whatsapp: "",
  governorate_id: 0,
  city_id: 0,
  terms_accepted: false,
};

const validateForm = (
  form: RegisterPayload,
  phonePrefix: "+970" | "+972",
): FormErrors => {
  const errors: FormErrors = {};
  const fullName = form.name.trim();
  const localNumber = form.whatsapp.replace(phonePrefix, "");

  if (!fullName) errors.name = "الاسم الكامل مطلوب";
  else if (fullName.length < 3 || fullName.length > 100) {
    errors.name = "يجب أن يكون الاسم بين 3 و100 حرف";
  }

  if (!form.email.trim()) errors.email = "عنوان البريد الإلكتروني مطلوب";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }

  if (!form.password) errors.password = "كلمة المرور مطلوبة";
  else if (form.password.length < 8)
    errors.password = "يجب ألا تقل كلمة المرور عن 8 أحرف";

  if (!form.password_confirmation) {
    errors.password_confirmation = "تأكيد كلمة المرور مطلوب";
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = "كلمتا المرور غير متطابقتين";
  }

  if (!localNumber) errors.whatsapp = "رقم واتساب مطلوب";
  else if (!/^5\d{8}$/.test(localNumber)) {
    errors.whatsapp = "أدخل رقمًا صحيحًا يبدأ بـ +970 أو +972";
  }

  if (!form.governorate_id) errors.governorate_id = "المحافظة مطلوبة";
  if (!form.city_id) errors.city_id = "المدينة/الحي مطلوبة";
  if (!form.terms_accepted)
    errors.terms_accepted = "يجب الموافقة على الشروط وسياسة الخصوصية";

  return errors;
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [phonePrefix, setPhonePrefix] = useState<"+970" | "+972">("+970");
  const [localPhone, setLocalPhone] = useState("");
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const loadGovernorates = async () => {
      try {
        const data = await regionService.getGovernorates();
        setGovernorates(data);
      } catch {
        setErrors((current) => ({
          ...current,
          general: "تعذر تحميل المحافظات. تحقق من الاتصال ثم أعد المحاولة.",
        }));
      } finally {
        setLoadingRegions(false);
      }
    };

    void loadGovernorates();
  }, []);

  const clearFieldError = (field: FieldName) => {
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      general: undefined,
    }));
  };

  const validateField = (field: FieldName) => {
    const payload: RegisterPayload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      whatsapp: `${phonePrefix}${localPhone}`,
    };

    const fieldError = validateForm(payload, phonePrefix)[field];

    setErrors((current) => ({
      ...current,
      [field]: fieldError,
    }));
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as
      | "name"
      | "email"
      | "password"
      | "password_confirmation";

    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));

    clearFieldError(field);

    if (field === "email") {
      setDuplicateEmail(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    setLocalPhone(digits);
    setForm((current) => ({ ...current, whatsapp: `${phonePrefix}${digits}` }));
    clearFieldError("whatsapp");
  };

  const handlePrefixChange = (prefix: "+970" | "+972") => {
    setPhonePrefix(prefix);
    setForm((current) => ({ ...current, whatsapp: `${prefix}${localPhone}` }));
    clearFieldError("whatsapp");
  };

  const handleGovernorateChange = async (value: string) => {
    const governorateId = Number(value);
    setForm((current) => ({
      ...current,
      governorate_id: governorateId,
      city_id: 0,
    }));
    setCities([]);
    clearFieldError("governorate_id");
    clearFieldError("city_id");

    if (!governorateId) return;

    setLoadingCities(true);
    try {
      const data = await regionService.getCities(governorateId);
      setCities(data);
    } catch {
      setErrors((current) => ({
        ...current,
        city_id: "تعذر تحميل المدن والأحياء",
      }));
    } finally {
      setLoadingCities(false);
    }
  };

  const mapServerErrors = (
    error: AxiosError<LaravelValidationError>,
  ): FormErrors => {
    const validationErrors = error.response?.data.errors;
    if (!validationErrors) {
      return {
        general:
          error.response?.data.message ?? "تعذر إنشاء الحساب. حاول مرة أخرى.",
      };
    }

    return Object.entries(validationErrors).reduce<FormErrors>(
      (result, [field, messages]) => {
        result[field as FieldName] = messages?.[0];
        return result;
      },
      {},
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      whatsapp: `${phonePrefix}${localPhone}`,
    };
    const clientErrors = validateForm(payload, phonePrefix);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setDuplicateEmail(false);
    setSubmitting(true);
    setErrors({});
    try {
      await authService.register(payload);
      navigate("/verify-email", {
        replace: true,
        state: { email: payload.email },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const serverErrors = mapServerErrors(error);

        setErrors(serverErrors);

        const emailErrors = error.response?.data.errors?.email;

        setDuplicateEmail(Array.isArray(emailErrors) && emailErrors.length > 0);
      } else {
        setErrors({
          general: "حدث خطأ غير متوقع. حاول مرة أخرى.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-card">
      <div className="register-card__header">
        <span className="register-card__eyebrow">
          <FaShieldAlt /> تسجيل آمن
        </span>
        <h1 className="register-card__title">إنشاء حساب جديد</h1>
        <p className="register-card__description">
          انضم إلى مجتمع بصمة وابدأ بالمشاركة والتبادل
        </p>
      </div>

      {errors.general && <Alert variant="danger">{errors.general}</Alert>}

      <Form className="register-form" noValidate onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="register-name">
              <Form.Label className="register-form__label">
                الاسم الكامل <span className="register-form__required">*</span>
              </Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleTextChange}
                onBlur={() => validateField("name")}
                isInvalid={Boolean(errors.name)}
                maxLength={100}
                autoComplete="name"
                placeholder="أدخل اسمك الكامل"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="register-email">
              <Form.Label className="register-form__label">
                البريد الإلكتروني{" "}
                <span className="register-form__required">*</span>
              </Form.Label>

              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleTextChange}
                onBlur={() => validateField("email")}
                isInvalid={Boolean(errors.email)}
                autoComplete="email"
                dir="ltr"
                placeholder="name@example.com"
              />

              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>

              {duplicateEmail && (
                <div className="register-form__email-suggestions">
                  <span>هل لديك حساب؟</span>

                  <Link to="/login">تسجيل الدخول</Link>

                  <span>أو</span>

                  <Link to="/forgot-password">استعادة كلمة المرور</Link>
                </div>
              )}
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="register-password">
              <Form.Label className="register-form__label">
                كلمة المرور <span className="register-form__required">*</span>
              </Form.Label>
              <div className="register-form__password-wrap">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleTextChange}
                  onBlur={() => validateField("password")}
                  isInvalid={Boolean(errors.password)}
                  autoComplete="new-password"
                  placeholder="8 أحرف على الأقل"
                />
                <button
                  className="register-form__password-toggle"
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
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="register-password-confirmation">
              <Form.Label className="register-form__label">
                تأكيد كلمة المرور{" "}
                <span className="register-form__required">*</span>
              </Form.Label>
              <div className="register-form__password-wrap">
                <Form.Control
                  type={showConfirmation ? "text" : "password"}
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleTextChange}
                  onBlur={() => validateField("password_confirmation")}
                  isInvalid={Boolean(errors.password_confirmation)}
                  autoComplete="new-password"
                  placeholder="أعد إدخال كلمة المرور"
                />
                <button
                  className="register-form__password-toggle"
                  type="button"
                  onClick={() => setShowConfirmation((value) => !value)}
                  aria-label={
                    showConfirmation
                      ? "إخفاء تأكيد كلمة المرور"
                      : "إظهار تأكيد كلمة المرور"
                  }
                >
                  {showConfirmation ? <FaEyeSlash /> : <FaEye />}
                </button>
                <Form.Control.Feedback type="invalid">
                  {errors.password_confirmation}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group controlId="register-whatsapp">
              <Form.Label className="register-form__label">
                رقم واتساب <span className="register-form__required">*</span>
              </Form.Label>
              <div className="register-form__phone">
                <Dropdown
                  className="register-form__prefix-dropdown"
                  onSelect={(eventKey) => {
                    if (eventKey) {
                      handlePrefixChange(eventKey as PhonePrefix);
                    }
                  }}
                >
                  <Dropdown.Toggle
                    id="dropdown-phone-prefix"
                    className="register-form__prefix-toggle"
                  >
                    <img
                      src={
                        countryOptions.find(
                          (country) => country.value === phonePrefix,
                        )?.flag
                      }
                      alt={
                        countryOptions.find(
                          (country) => country.value === phonePrefix,
                        )?.alt
                      }
                    />

                    <span>{phonePrefix}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="register-form__prefix-menu">
                    {countryOptions.map((country) => (
                      <Dropdown.Item
                        key={country.value}
                        eventKey={country.value}
                        active={country.value === phonePrefix}
                        className="register-form__prefix-item"
                      >
                        <img src={country.flag} alt={country.alt} />

                        <span>{country.label}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                  value={localPhone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  onBlur={() => validateField("whatsapp")}
                  isInvalid={Boolean(errors.whatsapp)}
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="5XXXXXXXX"
                />
              </div>
              {errors.whatsapp && (
                <div className="invalid-feedback d-block">
                  {errors.whatsapp}
                </div>
              )}
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="register-governorate">
              <Form.Label className="register-form__label">
                المحافظة <span className="register-form__required">*</span>
              </Form.Label>
              <Form.Select
                value={form.governorate_id || ""}
                onChange={(event) =>
                  void handleGovernorateChange(event.target.value)
                }
                isInvalid={Boolean(errors.governorate_id)}
                disabled={loadingRegions}
              >
                <option value="">
                  {loadingRegions ? "جاري تحميل المحافظات..." : "اختر المحافظة"}
                </option>
                {governorates.map((governorate) => (
                  <option key={governorate.id} value={governorate.id}>
                    {governorate.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.governorate_id}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group controlId="register-city">
              <Form.Label className="register-form__label">
                المدينة/الحي <span className="register-form__required">*</span>
              </Form.Label>
              <Form.Select
                value={form.city_id || ""}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    city_id: Number(event.target.value),
                  }));
                  clearFieldError("city_id");
                }}
                isInvalid={Boolean(errors.city_id)}
                disabled={!form.governorate_id || loadingCities}
              >
                <option value="">
                  {loadingCities
                    ? "جاري تحميل المدن..."
                    : form.governorate_id
                      ? "اختر المدينة أو الحي"
                      : "اختر المحافظة أولاً"}
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.city_id}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12}>
            <div className="register-form__terms">
              <Form.Check
                id="register-terms"
                checked={form.terms_accepted}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    terms_accepted: event.target.checked,
                  }));
                  clearFieldError("terms_accepted");
                }}
                isInvalid={Boolean(errors.terms_accepted)}
                label={
                  <span>
                    أوافق على{" "}
                    <Link to="/terms" target="_blank">
                      شروط الاستخدام
                    </Link>{" "}
                    و
                    <Link to="/privacy-policy" target="_blank">
                      سياسة الخصوصية
                    </Link>
                  </span>
                }
              />
              {errors.terms_accepted && (
                <div className="invalid-feedback d-block">
                  {errors.terms_accepted}
                </div>
              )}
            </div>
          </Col>

          <Col xs={12}>
            <Button
              className="register-form__submit w-100"
              type="submit"
              disabled={submitting || loadingRegions}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="ms-2" /> جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  <FaUserPlus className="ms-2" /> إنشاء الحساب
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      <p className="register-form__footer">
        لديك حساب بالفعل؟ <Link to="/login">تسجيل الدخول</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
