// ============================================
// User Pages - Barrel Export
// ============================================
// هذا الملف يسهل استيراد جميع صفحات المستخدم
// بدلاً من استيراد كل صفحة على حدة في App.tsx

// Announcements
export {
  MyAnnouncementsPage,
  MyAnnouncementDetailsPage,
  CreateAnnouncementPage,
  EditAnnouncementPage,
  AnnouncementSuccessPage,
  RequestFeaturedPage,
  FeaturedRequestsHistoryPage,
} from './announcements';

// Profile
export { default as UserProfilePage } from './UserProfilePage';

// Verification
export { VerifyIdentityPage } from './verification';