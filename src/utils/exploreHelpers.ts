import type { IconType } from 'react-icons';
import {
  FaExchangeAlt,
  FaHandHoldingHeart,
  FaBullhorn,
  FaExclamationTriangle,
  FaSearch,
  FaCheckCircle,
  FaStore,
  FaUserShield,
  FaLock,
  FaListAlt,
  FaShieldAlt,
  FaUserCheck,
  FaEye,
  FaGlobe,
} from 'react-icons/fa';

/* ============================================
   Types
   ============================================ */

export interface ExploreChip {
  label: string;
  color: string;
  Icon: IconType;
}

export interface ExplorePillar {
  key: 'exchange' | 'fund' | 'community';
  title: string;
  tagline: string;
  description: string;
  features: string[];
  chips?: ExploreChip[];
  Icon: IconType;
  color: string;
  colorLight: string;
  /** Button label (or the "coming soon" label when not available) */
  cta: string;
  path: string;
  /** Set to true once the route exists in App.tsx */
  available: boolean;
}

export interface ExplorePoint {
  title: string;
  description: string;
  Icon: IconType;
}

export interface ExplorePrinciple {
  title: string;
  items: string[];
  Icon: IconType;
}

export interface ExploreStep {
  number: string;
  title: string;
  description: string;
}

/* ============================================
   Design constants
   ============================================ */

export const EXPLORE_DESIGN: {
  ease_out_expo: [number, number, number, number];
  column: { gap: number };
} = {
  ease_out_expo: [0.16, 1, 0.3, 1],
  column: { gap: 28 },
};

/* ============================================
   Pillars
   ============================================ */

export const EXPLORE_PILLARS: ExplorePillar[] = [
  {
    key: 'exchange',
    title: 'التبادل',
    tagline: 'سلعك وخدماتك، بين أهلك',
    description:
      'مساحة رقمية يتبادل فيها أبناء المجتمع السلع والخدمات مباشرة، بدون وسيط وبأقل تكلفة ممكنة.',
    features: [
      'عروض وطلبات في تصنيفات متنوعة',
      'دفع نقدي أو مقايضة بدون نقود',
      'أربعة مستويات خصوصية تتحكم بمن يرى إعلانك',
      'تواصل مباشر عبر واتساب للأعضاء المسجلين',
      'تقييمات بعد كل تعامل تبني الثقة',
    ],
    Icon: FaExchangeAlt,
    color: '#E87A20',
    colorLight: '#F5A623',
    cta: 'تصفّح الإعلانات',
    path: '/announcements',
    available: true,
  },
  {
    key: 'fund',
    title: 'صندوق بصمة',
    tagline: 'عطاء آمن يحفظ الكرامة',
    description:
      'نظام تبرعات تقف فيه المنصة وسيطاً موثوقاً بين المحتاج والمتبرع، مع حماية كاملة لخصوصية المستفيد.',
    features: [
      'طلبات مساعدة من مستخدمين موثّقين وتُراجَع قبل نشرها',
      'فيديو محمي: صورة ضبابية للجميع، ومشاهدة برابط مؤقت لمن يستفسر',
      'البيانات الحساسة للمستفيد مشفّرة ولا تُعرض علناً',
      'التنسيق عبر إدارة المنصة دون تواصل مباشر',
      'كود تتبع لكل استفسار تبرع',
    ],
    Icon: FaHandHoldingHeart,
    color: '#17A2B8',
    colorLight: '#20C9E0',
    cta: 'زيارة صندوق بصمة',
    path: '/basma-fund',
    available: true,
  },
  {
    key: 'community',
    title: 'المجتمع',
    tagline: 'ما يهم الجميع، في مكان واحد',
    description:
      'فضاء عام تُنظَّم فيه المعلومات المجتمعية المهمة بدل أن تتشتت على وسائل التواصل.',
    features: [
      'منشورات يكتبها الأعضاء الموثّقون',
      'مراجعة قبل النشر لمنع المحتوى المخالف',
      'التحذيرات والمنشورات العامة تنتهي تلقائياً',
      'المفقودات والموجودات تُغلق بوسم «تم الحل»',
    ],
    chips: [
      { label: 'تحذير', color: '#DC3545', Icon: FaExclamationTriangle },
      { label: 'مفقود', color: '#F5A623', Icon: FaSearch },
      { label: 'موجود', color: '#28A745', Icon: FaCheckCircle },
      { label: 'عام', color: '#17A2B8', Icon: FaBullhorn },
    ],
    Icon: FaBullhorn,
    color: '#9C27B0',
    colorLight: '#BA68C8',
    cta: 'قريباً',
    path: '/community',
    available: false,
  },
];

/* ============================================
   "Why Basma" points
   ============================================ */

export const EXPLORE_POINTS: ExplorePoint[] = [
  {
    title: 'منصة واحدة',
    description: 'سلع وخدمات وتبرعات ومعلومات مجتمعية في مكان واحد',
    Icon: FaStore,
  },
  {
    title: 'ثقة قابلة للقياس',
    description: 'توثيق للهوية وتقييمات بعد كل تعامل',
    Icon: FaUserShield,
  },
  {
    title: 'خصوصية محفوظة',
    description: 'حماية للبيانات الحساسة وصون لكرامة المستفيد',
    Icon: FaLock,
  },
  {
    title: 'معلومات منظّمة',
    description: 'تحذيرات ومفقودات وإعلانات عامة بدون فوضى',
    Icon: FaListAlt,
  },
];

/* ============================================
   Principles
   ============================================ */

export const EXPLORE_PRINCIPLES: ExplorePrinciple[] = [
  {
    title: 'الخصوصية أولاً',
    items: [
      'تشفير البيانات الحساسة',
      'صور ضبابية تحمي هوية المستفيدين',
      'تحكّم كامل بمن يرى إعلانك',
    ],
    Icon: FaShieldAlt,
  },
  {
    title: 'الثقة والأمان',
    items: [
      'توثيق الهوية وشارة «موثّق»',
      'تقييمات من 1 إلى 5 بعد كل تعامل',
      'إبلاغ عن أي محتوى مخالف',
    ],
    Icon: FaUserCheck,
  },
  {
    title: 'الشفافية',
    items: [
      'سجلّ تدقيق لكل وصول إداري للبيانات',
      'إشعارات بكل تغيّر في حالة طلبك',
      'قواعد واضحة تسري على الجميع',
    ],
    Icon: FaEye,
  },
  {
    title: 'متاحة للجميع',
    items: [
      'واجهة عربية كاملة',
      'الاستخدام الأساسي مجاني',
      'تصميم يعمل على كل الأجهزة',
    ],
    Icon: FaGlobe,
  },
];

/* ============================================
   Copy
   ============================================ */

export const EXPLORE_COPY = {
  // Hero
  hero_badge: 'منصة التبادل المجتمعي لأهل غزة',
  hero_title: 'اكتشف مجتمع بصمة',
  hero_subtitle: 'ثلاثة أعمدة تسند مجتمعاً متكافلاً',
  hero_description:
    'في ظل ظروف صعبة وموارد شحيحة، تبقى قيم التكافل أقوى ما نملك. بصمة جسر رقمي يربط أبناء المجتمع الواحد: يتبادلون السلع والخدمات، ويصلون إلى المساعدة بأمان، ويشاركون ما يهم الجميع — بثقة وخصوصية.',
  hero_cta: 'استكشف الأعمدة الثلاثة',

  // Message
  message_eyebrow: 'لماذا بصمة؟',
  message_title: 'مجتمع يعيد بناء نسيجه بيديه',
  message_body: [
    'في غزة لا تنقص الناس الرغبة في التعاون؛ ينقصهم مكان واحد منظّم يلتقون فيه. فالعروض والطلبات والتحذيرات والمفقودات موزّعة بين مجموعات متفرقة، والثقة بالطرف الآخر ليست مضمونة، ومن يحتاج مساعدة قد لا يجد قناة آمنة تحفظ كرامته وخصوصيته.',
    'من هنا وُلدت بصمة: منصة مجتمعية متكاملة تجمع التبادل والتبرع والمعلومات العامة في مكان واحد، وتبني فوقها طبقات من الثقة — توثيق للهوية، وتقييمات، وحماية للبيانات الحساسة، وسجلات شفافة.',
  ],

  // Pillars
  pillars_title: 'ثلاثة أعمدة، مجتمع واحد',
  pillars_subtitle:
    'كل عمود يعالج جانباً مختلفاً من احتياجات المجتمع، وتجتمع كلها تحت سقف واحد.',

  // Principles
  principles_title: 'ما نلتزم به تجاه كل عضو',
  principles_subtitle: 'مبادئ تحكم كل ميزة في المنصة، من أول إعلان إلى آخر تبرع.',

  // How to start
  howto_title: 'ثلاث خطوات لتكون جزءاً من المجتمع',
  howto_steps: [
    {
      number: '1',
      title: 'أنشئ حسابك',
      description:
        'سجّل مجاناً في دقائق وفعّل بريدك الإلكتروني. وللحصول على ميزات أكثر، وثّق هويتك لتنال شارة «موثّق».',
    },
    {
      number: '2',
      title: 'اختر عمودك',
      description:
        'انشر إعلاناً للتبادل، أو تصفّح طلبات صندوق بصمة، أو تابع منشورات المجتمع.',
    },
    {
      number: '3',
      title: 'شارك وتعاون',
      description:
        'تواصل عبر واتساب، وقيّم من تعاملت معهم، وساهم في مجتمع أكثر ثقة وتكافلاً.',
    },
  ] as ExploreStep[],

  // CTA
  cta_title: 'بصمة واحدة، مجتمع واحد',
  cta_description:
    'انضم إلى مجتمع يؤمن أن التعاون أقوى من الظروف. التسجيل مجاني، وبدايتك تبعد دقيقة واحدة.',
  cta_primary: 'انضم إلى بصمة',
  cta_secondary: 'تعرّف علينا أكثر',
  cta_secondary_path: '/about',
};
