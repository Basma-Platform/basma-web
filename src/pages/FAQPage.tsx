import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { faqService } from '../services/faqService';
import FAQSearch from '../components/faq/FAQSearch';
import FAQCategoryFilter from '../components/faq/FAQCategoryFilter';
import FAQAccordion from '../components/faq/FAQAccordion';
import FAQPerPageDropdown from '../components/faq/FAQPerPageDropdown';
import FAQPagination from '../components/faq/FAQPaginations';
import type { FAQ } from '../types';
import SEO from '../components/SEO';

// ============================================
// Mock data fallback — mirrors backend seeder
// ============================================
const MOCK_FAQS: FAQ[] = [
  // ---- عام ----
  {
    id: 1,
    question: 'ما هي منصة بصمة؟',
    answer:
      'بصمة هي منصة مجتمعية متكاملة لأهل غزة، تجمع ثلاث ركائز في مكان واحد: تبادل الخدمات بين الأفراد، صندوق بصمة لدعم المحتاجين وتوثيق الإنجازات، ومنشورات المجتمع لنشر الوعي والتعاون. هدفنا بناء مجتمع متكافل ومترابط.',
    category: 'عام',
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    question: 'من يمكنه استخدام منصة بصمة؟',
    answer:
      'جميع سكان غزة فوق سن 18 عاماً يمكنهم التسجيل في بصمة والاستفادة من خدماتها. بعض الميزات — مثل صندوق بصمة ومنشورات المجتمع — تتطلب توثيق الهوية.',
    category: 'عام',
    order: 2,
    is_active: true,
  },
  {
    id: 3,
    question: 'هل استخدام المنصة مجاني؟',
    answer:
      'نعم، التسجيل والاستخدام الأساسي للمنصة مجاني تماماً. توجد خدمة اختيارية مدفوعة لتمييز الخدمات مقابل رسوم رمزية، لدعم استمرارية المنصة.',
    category: 'عام',
    order: 3,
    is_active: true,
  },
  // ---- الحساب والتسجيل ----
  {
    id: 4,
    question: 'كيف يمكنني التسجيل في منصة بصمة؟',
    answer:
      'يمكنك التسجيل بسهولة عبر ملء نموذج التسجيل: الاسم الكامل، البريد الإلكتروني، كلمة المرور، رقم واتساب (يبدأ بـ +970 أو +972)، والمنطقة (المحافظة والمدينة). ثم وافق على الشروط وستصلك رسالة تفعيل على بريدك الإلكتروني.',
    category: 'الحساب والتسجيل',
    order: 1,
    is_active: true,
  },
  {
    id: 5,
    question: 'كيف يمكنني تغيير كلمة المرور؟',
    answer:
      'من صفحة "الملف الشخصي" → قسم "تغيير كلمة المرور"، أدخل كلمة المرور الحالية ثم الجديدة (8 أحرف على الأقل) وأكدها. سيتم تحديث كلمة المرور فوراً.',
    category: 'الحساب والتسجيل',
    order: 2,
    is_active: true,
  },
  {
    id: 6,
    question: 'كيف يمكنني حذف حسابي؟',
    answer:
      'من صفحة "الإعدادات" → قسم "منطقة الخطر"، يمكنك طلب حذف حسابك. سيتم تعطيله فوراً وحذف جميع بياناتك نهائياً خلال 30 يوماً. لا يمكن التراجع عن هذا الإجراء بعد انتهاء المدة.',
    category: 'الحساب والتسجيل',
    order: 3,
    is_active: true,
  },
  // ---- تبادل الخدمات ----
  {
    id: 7,
    question: 'كيف يمكنني نشر عرض أو طلب خدمة؟',
    answer:
      'من لوحة التحكم، اضغط على "نشر عرض أو طلب". اختر نوع المنشور (عرض خدمة أو طلب خدمة)، الفئة، العنوان، الوصف، طريقة التبادل (مدفوع أو مقايضة)، المنطقة، وإعدادات الخصوصية. أضف صوراً للتوضيح ثم انشر.',
    category: 'تبادل الخدمات',
    order: 1,
    is_active: true,
  },
  {
    id: 8,
    question: 'ما الفرق بين "عرض" و "طلب"؟',
    answer:
      '"العرض" يعني أن لديك خدمة أو سلعة تقدّمها للمجتمع. أما "الطلب" فيعني أنك تبحث عن خدمة أو سلعة يحتاجها غيرك لتقديمها لك. الفرق يظهر في طريقة البحث والتصفية.',
    category: 'تبادل الخدمات',
    order: 2,
    is_active: true,
  },
  {
    id: 9,
    question: 'ما هي طرق التبادل المتاحة؟',
    answer:
      'هناك طريقتان: "مدفوع" — حيث تحدد سعراً معيناً بالشيكل، مع خيار "قابل للتفاوض". و"مقايضة" — حيث تعرض ما تقدّمه مقابل ما تطلبه من الطرف الآخر دون استخدام المال.',
    category: 'تبادل الخدمات',
    order: 3,
    is_active: true,
  },
  {
    id: 10,
    question: 'كم عدد الخدمات التي يمكنني نشرها؟',
    answer:
      'المستخدم العادي يمكنه نشر 5 عروض أو طلبات شهرياً. أما المستخدم الموثق (بعد توثيق هويته) فيمكنه النشر بعدد غير محدود. يتم احتساب الحد الشهري لجميع المنشورات بغض النظر عن حالتها.',
    category: 'تبادل الخدمات',
    order: 4,
    is_active: true,
  },
  {
    id: 11,
    question: 'هل يمكنني تعديل أو حذف إعلاني بعد نشره؟',
    answer:
      'نعم. يمكنك تعديل الإعلان أو حذفه من قسم "خدماتي". عند الحذف، يتم إخفاؤه فوراً من المنصة، ثم يُحذف نهائياً من قاعدة البيانات بعد 30 يوماً.',
    category: 'تبادل الخدمات',
    order: 5,
    is_active: true,
  },
  {
    id: 12,
    question: 'كيف يمكنني التواصل مع صاحب العرض أو الطلب؟',
    answer:
      'يظهر رقم واتساب صاحب الإعلان في صفحة التفاصيل (للمستخدمين المسجلين فقط). اضغط على الزر للتواصل مباشرة عبر واتساب. الزوار غير المسجلين يرون زر "سجل الدخول للتواصل".',
    category: 'تبادل الخدمات',
    order: 6,
    is_active: true,
  },
  // ---- صندوق بصمة ----
  {
    id: 13,
    question: 'ما هو صندوق بصمة؟',
    answer:
      'صندوق بصمة هو مبادرة خيرية مجتمعية تتيح لأهل غزة تقديم طلبات مساعدة موثّقة، وللمتبرعين الوصول إليها بسهولة وأمان. كل حالة تُراجع من فريق بصمة قبل نشرها، وكل تبرّع يُترجم إلى إنجاز ملموس يوثّق أثر المتبرعين.',
    category: 'صندوق بصمة',
    order: 1,
    is_active: true,
  },
  {
    id: 14,
    question: 'من يمكنه تقديم طلب مساعدة؟',
    answer:
      'يجب أن يكون المستخدم مسجلاً في بصمة وموثّق هويته. هذا الشرط يضمن مصداقية الحالات المعروضة، ويحمي المتبرعين من أي محاولات احتيال.',
    category: 'صندوق بصمة',
    order: 2,
    is_active: true,
  },
  {
    id: 15,
    question: 'كيف أقدّم طلب مساعدة؟',
    answer:
      'من لوحة التحكم، اذهب إلى "صندوق بصمة" → "تقديم طلب جديد". أدخل عنواناً عاماً ووصفاً مختصراً، وأضف فيديو قصير (من 60 إلى 90 ثانية) يوضح حالتك، ثم البيانات التفصيلية. تتم مراجعة الطلب قبل النشر.',
    category: 'صندوق بصمة',
    order: 3,
    is_active: true,
  },
  {
    id: 16,
    question: 'هل بياناتي الشخصية محمية عند تقديم طلب؟',
    answer:
      'نعم، خصوصيتك أولوية. البيانات التفصيلية (الاسم الحقيقي، العنوان، رقم التواصل) تُشفّر بالكامل، ولا يراها إلا فريق المراجعة المصرّح له، ويُسجَّل كل وصول في سجل تدقيق. ما ينشر للعامة هو فقط العنوان والوصف العام والفيديو.',
    category: 'صندوق بصمة',
    order: 4,
    is_active: true,
  },
  {
    id: 17,
    question: 'كيف أعرف أن تبرّعي وصل فعلاً للمحتاج؟',
    answer:
      'بعد اكتمال الدعم، يقوم فريق بصمة بتوثيق الحالة كإنجاز مجتمعي في قسم "الإنجازات الخيرية"، يُذكر فيه أن الحالة تم دعمها ورقمها. هذا يضمن الشفافية ويُلهم الآخرين للعطاء.',
    category: 'صندوق بصمة',
    order: 5,
    is_active: true,
  },
  // ---- منشورات المجتمع ----
  {
    id: 18,
    question: 'ما هي منشورات المجتمع؟',
    answer:
      'مساحة مجتمعية للتوعية والتنبيه: تحذيرات أمنية، منشورات مفقود/موجود، وإعلانات عامة تخدم أهالي منطقتك. كل منشور يُراجَع قبل النشر لضمان المصداقية.',
    category: 'منشورات المجتمع',
    order: 1,
    is_active: true,
  },
  {
    id: 19,
    question: 'ما أنواع المنشورات المتاحة؟',
    answer:
      'أربعة أنواع: "تحذير" — لتنبيه المجتمع من خطر أو احتيال. "مفقود" — للإعلان عن شخص أو شيء مفقود. "موجود" — للإعلان عن شيء تم إيجاده. "عام" — لأي إعلان يخدم المجتمع.',
    category: 'منشورات المجتمع',
    order: 2,
    is_active: true,
  },
  {
    id: 20,
    question: 'هل يمكنني نشر منشور دون توثيق هويتي؟',
    answer:
      'لا. يتطلب النشر في منشورات المجتمع توثيق الهوية أولاً. هذا الشرط يحمي مصداقية المحتوى، ويمنع انتشار التحذيرات أو المعلومات الكاذبة.',
    category: 'منشورات المجتمع',
    order: 3,
    is_active: true,
  },
  {
    id: 21,
    question: 'كم عدد المنشورات المسموح بها؟',
    answer:
      'يمكنك نشر 3 منشورات نشطة كحد أقصى في الوقت الواحد، بما لا يتجاوز 3 منشورات شهرياً. هذا الحد يحافظ على جودة المحتوى ويحمي المجتمع من الإغراق.',
    category: 'منشورات المجتمع',
    order: 4,
    is_active: true,
  },
  {
    id: 22,
    question: 'ما معنى "تم الحل"؟',
    answer:
      '"تم الحل" هي حالة يضعها صاحب المنشور عندما يُحل الموضوع — مثل العثور على المفقود، أو زوال سبب التحذير. المنشور يُوسم بهذه الحالة ويظل ظاهراً للتوعية.',
    category: 'منشورات المجتمع',
    order: 5,
    is_active: true,
  },
  // ---- التوثيق والأمان ----
  {
    id: 23,
    question: 'كيف أوثّق هويتي في بصمة؟',
    answer:
      'من صفحة "الملف الشخصي" → "توثيق الهوية"، ارفع صورة واضحة لوثيقة رسمية (هوية وطنية، جواز سفر، رخصة قيادة، أو بطاقة جامعية) بصيغة JPG أو PNG أو PDF. يراجع فريق بصمة الطلب خلال 24-48 ساعة.',
    category: 'التوثيق والأمان',
    order: 1,
    is_active: true,
  },
  {
    id: 24,
    question: 'لماذا أحتاج لتوثيق الهوية؟',
    answer:
      'التوثيق يمنحك شارة "موثق" على حسابك وخدماتك، ويبني ثقة أكبر مع المستخدمين الآخرين. كما يمنحك ميزات إضافية: نشر غير محدود، الوصول لخيارات خصوصية إضافية، والمساهمة في صندوق بصمة ومنشورات المجتمع.',
    category: 'التوثيق والأمان',
    order: 2,
    is_active: true,
  },
  {
    id: 25,
    question: 'هل بيانات وثيقة الهوية آمنة؟',
    answer:
      'نعم، أمانك أولوية. الوثيقة تُشفّر بالكامل وتُحفظ في مخزن محمي، ولا يمكن الوصول إليها إلا لفريق مراجعة مصرّح له، ويُسجَّل كل وصول (المشرف، الوقت، السبب). تُحذف الصورة تلقائياً بعد 90 يوماً من الموافقة.',
    category: 'التوثيق والأمان',
    order: 3,
    is_active: true,
  },
  {
    id: 26,
    question: 'ما هي إرشادات الأمان في التعامل مع الآخرين؟',
    answer:
      'اختر مكاناً عاماً ومزدحماً للقاء. أخبر شخصاً موثوقاً بموعد اللقاء. تحقق من تقييمات الطرف الآخر. لا تشارك بياناتك الحساسة. ألغِ اللقاء فوراً إذا شعرت بعدم الأمان، وأبلغ عن أي سلوك مشبوه.',
    category: 'التوثيق والأمان',
    order: 4,
    is_active: true,
  },
  {
    id: 27,
    question: 'كيف أبلّغ عن مستخدم أو محتوى مخالف؟',
    answer:
      'زر "الإبلاغ" متاح في صفحة الإعلان، الملف الشخصي، التعليقات، والمنشورات. اختر سبب الإبلاغ من القائمة (احتيال، محتوى مسيء، معلومات مضللة، سبام، انتهاك خصوصية، تهديد، أو أخرى)، وأضف تفاصيل إن أردت.',
    category: 'التوثيق والأمان',
    order: 5,
    is_active: true,
  },
  // ---- التقييمات والسمعة ----
  {
    id: 28,
    question: 'كيف يمكنني تقييم مستخدم بعد التعامل معه؟',
    answer:
      'بعد إتمام التعامل، ادخل إلى صفحة الطرف الآخر، واضغط "تقييم التجربة". اختر عدد النجوم من 1 إلى 5، وأضف تعليقاً (اختياري). تقييمك يساهم في بناء سمعة شفافة داخل المجتمع.',
    category: 'التقييمات والسمعة',
    order: 1,
    is_active: true,
  },
  {
    id: 29,
    question: 'هل يمكنني تقييم نفس المستخدم أكثر من مرة؟',
    answer:
      'يمكنك تقييم المستخدم مرة واحدة لكل إعلان مختلف تتعاملون بشأنه. لا يمكن تقييم نفس التعامل مرتين. هذا يضمن مصداقية النظام ويمنع التلاعب بالتقييمات.',
    category: 'التقييمات والسمعة',
    order: 2,
    is_active: true,
  },
  {
    id: 30,
    question: 'هل يمكنني تعديل أو حذف تقييمي؟',
    answer:
      'نعم، خلال 24 ساعة من إضافة التقييم، يمكنك تعديله أو حذفه. بعد هذه المدة، يصبح التقييم نهائياً للحفاظ على نزاهة سجل السمعة.',
    category: 'التقييمات والسمعة',
    order: 3,
    is_active: true,
  },
  // ---- تمييز خدماتي والدفع ----
  {
    id: 31,
    question: 'ما هي ميزة "تمييز خدماتي"؟',
    answer:
      'تمييز خدماتي يضع خدمتك في أعلى نتائج البحث وفي قسم خاص، مع شارة ذهبية. يحصل على مشاهدات أكثر بـ 10 أضعاف، ويزيد فرص التواصل مع المهتمين.',
    category: 'تمييز خدماتي والدفع',
    order: 1,
    is_active: true,
  },
  {
    id: 32,
    question: 'كيف أميّز خدمتي؟',
    answer:
      'من "خدماتي"، اختر الخدمة واضغط "ميّز". اختر الباقة (7 أيام، 14 يوماً، أو 30 يوماً)، ثم حوّل المبلغ عبر إحدى الطرق المتاحة (PalPay، Jawwal Pay، BOP)، وأرفق صورة الإيصال. تتم الموافقة خلال 24 ساعة.',
    category: 'تمييز خدماتي والدفع',
    order: 2,
    is_active: true,
  },
  {
    id: 33,
    question: 'ما هي أسعار التمييز؟',
    answer:
      'توجد ثلاث باقات: باقة 7 أيام بـ 25 شيكلاً، باقة 14 يوماً بـ 45 شيكلاً، وباقة 30 يوماً بـ 80 شيكلاً. جميع الأسعار معروضة بوضوح في صفحة "ميّز خدمتك".',
    category: 'تمييز خدماتي والدفع',
    order: 3,
    is_active: true,
  },
  {
    id: 34,
    question: 'ما هي طرق الدفع المتاحة؟',
    answer:
      'نقبل الدفع عبر ثلاث طرق: PalPay، Jawwal Pay، و Bank of Palestine (BOP). تُعرض تفاصيل الحساب عند اختيار الطريقة، مع تعليمات واضحة للتحويل.',
    category: 'تمييز خدماتي والدفع',
    order: 4,
    is_active: true,
  },
  {
    id: 35,
    question: 'ماذا لو رُفض طلب التمييز؟',
    answer:
      'إذا رُفض الطلب (بسبب صورة غير واضحة، مبلغ غير مطابق، أو أي مشكلة أخرى)، ستُعلم بالسبب. لا يتم خصم أي مبلغ في حال الرفض، ويمكنك إعادة إرسال الطلب بعد تصحيح المشكلة.',
    category: 'تمييز خدماتي والدفع',
    order: 5,
    is_active: true,
  },
];

const FAQPage = () => {
  const { isDark } = useTheme();
  const [faqs, setFaqs] = useState<FAQ[]>(MOCK_FAQS);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(MOCK_FAQS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [categories, setCategories] = useState<string[]>(['الكل']);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [isUsingMock, setIsUsingMock] = useState(true);

  // ============================================
  // Fetch categories
  // ============================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await faqService.getCategories();
        if (data && data.length > 0) {
          setCategories(['الكل', ...data]);
        }
      } catch (err) {
        const mockCategories = [
          'الكل',
          ...Array.from(new Set(MOCK_FAQS.map((f) => f.category))),
        ];
        setCategories(mockCategories);
      }
    };
    fetchCategories();
  }, []);

  // ============================================
  // Fetch FAQs with pagination
  // ============================================
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);

        const params: any = {
          page: currentPage,
          per_page: perPage,
        };

        if (selectedCategory !== 'الكل') {
          params.category = selectedCategory;
        }

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        const response = await faqService.getFAQs(params);

        if (response && response.data && response.data.length > 0) {
          setFaqs(response.data);
          setFilteredFaqs(response.data);
          setTotal(response.total || response.data.length);
          setLastPage(response.last_page || 1);
          setIsUsingMock(false);
        } else {
          setFaqs(MOCK_FAQS);
          setFilteredFaqs(MOCK_FAQS);
          setTotal(MOCK_FAQS.length);
          setLastPage(1);
          setIsUsingMock(true);
        }
      } catch (err) {
        setFaqs(MOCK_FAQS);
        setFilteredFaqs(MOCK_FAQS);
        setTotal(MOCK_FAQS.length);
        setLastPage(1);
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFAQs();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, perPage, selectedCategory, searchTerm]);

  // ============================================
  // Local search filter
  // ============================================
  useEffect(() => {
    let result = faqs;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(term) ||
          item.answer.toLowerCase().includes(term)
      );
    }

    setFilteredFaqs(result);
  }, [searchTerm, faqs]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div
      style={{
        paddingTop: '100px',
        paddingBottom: '60px',
        backgroundColor: 'var(--bg-body)',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}
    >
      <SEO
        title="الأسئلة الشائعة"
        description="إجابات على أكثر الأسئلة التي يطرحها مستخدمونا حول منصة بصمة."
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-5">
            <div
              style={{
                width: '60px',
                height: '4px',
                backgroundColor: 'var(--primary-orange)',
                borderRadius: '2px',
                margin: '0 auto 1.5rem',
              }}
            />
            <h1
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 900,
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1rem',
              }}
            >
              الأسئلة الشائعة
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '1.1rem',
                fontFamily: 'Cairo, sans-serif',
                maxWidth: '640px',
                margin: '0 auto',
                lineHeight: 1.8,
                textAlign: 'center',
              }}
            >
              إجابات على أكثر الأسئلة التي يطرحها مستخدمونا حول منصة بصمة
            </p>
          </div>
        </motion.div>

        {/* Search + PerPage */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <FAQSearch onSearch={handleSearch} isDark={isDark} />
              </div>
              <div style={{ flexShrink: 0 }}>
                <FAQPerPageDropdown
                  perPage={perPage}
                  onPerPageChange={handlePerPageChange}
                  isDark={isDark}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Category Filter */}
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FAQCategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                isDark={isDark}
              />
            </motion.div>
          </Col>
        </Row>

        {/* Results Count */}
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                fontFamily: 'Cairo, sans-serif',
                marginBottom: '1rem',
                padding: '0 4px',
                flexWrap: 'wrap',
              }}
            >
              <span>
                {loading ? (
                  'جاري التحميل...'
                ) : (
                  <>
                    عرض {filteredFaqs.length} من {total} سؤال
                    {isUsingMock && ' (بيانات نموذجية)'}
                    {searchTerm && ` (نتائج البحث: "${searchTerm}")`}
                  </>
                )}
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                {!loading &&
                  lastPage > 1 &&
                  `الصفحة ${currentPage} من ${lastPage}`}
              </span>
            </div>
          </Col>
        </Row>

        {/* FAQ Accordion */}
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <FAQAccordion
                faqs={filteredFaqs}
                loading={loading}
                isDark={isDark}
                itemVariants={itemVariants}
              />
            </motion.div>

            {/* No Results */}
            {!loading && filteredFaqs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'Cairo, sans-serif',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  لا توجد نتائج
                </h3>
                <p
                  style={{
                    lineHeight: 1.8,
                    maxWidth: '480px',
                    margin: '0 auto',
                  }}
                >
                  {searchTerm
                    ? 'لم نعثر على أي أسئلة تطابق بحثك. حاول تغيير كلمات البحث.'
                    : 'لا توجد أسئلة في هذه الفئة حالياً.'}
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && lastPage > 1 && (
              <FAQPagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={handlePageChange}
                isDark={isDark}
              />
            )}

            {/* Still have questions CTA */}
            {!loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{
                  marginTop: '3rem',
                  padding: '2rem 1.75rem',
                  borderRadius: '18px',
                  background:
                    'linear-gradient(135deg, rgba(232, 122, 32, 0.08) 0%, rgba(232, 122, 32, 0.03) 100%)',
                  border: '1.5px solid rgba(232, 122, 32, 0.25)',
                  boxShadow: '0 8px 28px rgba(232, 122, 32, 0.10)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(232, 122, 32, 0.15), transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    margin: '0 auto 1rem',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #E87A20, #F5A623)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '1.5rem',
                    boxShadow: '0 6px 20px rgba(232, 122, 32, 0.35)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  💬
                </div>

                <h3
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
                    fontWeight: 900,
                    fontFamily: 'Cairo, sans-serif',
                    marginBottom: '0.5rem',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  لم تجد إجابة سؤالك؟
                </h3>

                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.92rem',
                    fontFamily: 'Cairo, sans-serif',
                    lineHeight: 1.85,
                    maxWidth: '520px',
                    margin: '0 auto 1.25rem',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  فريق بصمة جاهز لمساعدتك. إذا لم تجد ما تبحث عنه، تواصل معنا
                  مباشرة وسنرد عليك في أقرب وقت ممكن.
                </p>

                <Link
                  to="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 28px',
                    borderRadius: '30px',
                    backgroundColor: 'var(--primary-orange)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    fontFamily: 'Cairo, sans-serif',
                    boxShadow: '0 6px 20px rgba(232, 122, 32, 0.35)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 1,
                    minHeight: '44px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 10px 28px rgba(232, 122, 32, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(232, 122, 32, 0.35)';
                  }}
                >
                  تواصل مع الدعم
                  <FaChevronLeft size={11} />
                </Link>
              </motion.div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FAQPage;