import { DeviceMatrixItem } from '../types';

export const DEVICE_MATRIX: DeviceMatrixItem[] = [
  {
    id: 'dm_1',
    featureName: 'Gig Creation & Multi-tab Wizard',
    featureNameBn: 'নতুন গিগ তৈরি ও পাবলিশ করা',
    category: 'Gigs',
    mobileApp: {
      status: 'desktop_required',
      note: 'Not supported in mobile app. Must use desktop browser.',
      noteBn: 'মোবাইল অ্যাপে গিগ তৈরি করা যায় না।'
    },
    mobileWeb: {
      status: 'limited',
      note: 'Layout breaks on small screens; package table requires desktop mode.',
      noteBn: 'মোবাইল ব্রাউজারে টেবিল ও গ্যালারি কাজ করা অনেক কঠিন।'
    },
    desktopWeb: {
      status: 'available',
      note: '100% full feature support with image cropping and pricing matrix.',
      noteBn: 'সম্পূর্ণ সাপোর্ট, গ্যালারি আপলোড ও প্যাকেজ এডিটের জন্য আদর্শ।'
    },
    recommendedDevice: 'desktop'
  },
  {
    id: 'dm_2',
    featureName: 'Inbox Messaging & Rapid Response',
    featureNameBn: 'ইনবক্স মেসেজিং ও দ্রুত বায়ারকে উত্তর দেওয়া',
    category: 'Communication',
    mobileApp: {
      status: 'available',
      note: 'Instant push notifications. Best tool for 15-minute response time.',
      noteBn: 'তাৎক্ষণিক পুশ নোটিফিকেশন পাওয়া যায়; দ্রুত উত্তরের জন্য সেরা।'
    },
    mobileWeb: {
      status: 'available',
      note: 'Full chat capability with basic attachments.',
      noteBn: 'ব্রাউজার থেকেও চ্যাট করা যায়।'
    },
    desktopWeb: {
      status: 'available',
      note: 'Ideal for sending long technical replies and large attachments.',
      noteBn: 'বড় মেসেজ ও কোড পাঠানোর জন্য সুবিধাজনক।'
    },
    recommendedDevice: 'both'
  },
  {
    id: 'dm_3',
    featureName: 'Creating & Sending Custom Offers',
    featureNameBn: 'ইনবক্স থেকে কাস্টম অফার পাঠানো',
    category: 'Communication',
    mobileApp: {
      status: 'available',
      note: 'Supported directly in chat drawer with custom price and days.',
      noteBn: 'মোবাইল অ্যাপ থেকেই সরাসরি কাস্টম অফার পাঠানো যায়।'
    },
    mobileWeb: {
      status: 'available',
      note: 'Available in chat view.',
      noteBn: 'মোবাইল ব্রাউজারেও পাঠানো যায়।'
    },
    desktopWeb: {
      status: 'available',
      note: 'Full milestone setup and detailed breakdown preview.',
      noteBn: 'মাইলস্টোন অর্ডার ও বিস্তারিত বিবরণ লেখার জন্য দারুণ।'
    },
    recommendedDevice: 'both'
  },
  {
    id: 'dm_4',
    featureName: 'Final Order Delivery (File Uploads)',
    featureNameBn: 'অর্ডার ডেলিভারি ও কাজের ফাইল আপলোড',
    category: 'Orders',
    mobileApp: {
      status: 'limited',
      note: 'Can deliver small files/photos, but ZIP source files fail often.',
      noteBn: 'ছোট ছবি পাঠানো গেলেও বড় ZIP ফাইল আপলোডে সমস্যা হতে পারে।'
    },
    mobileWeb: {
      status: 'limited',
      note: 'File picker issues on some mobile operating systems.',
      noteBn: 'কিছু ফোনে ব্রাউজারের মাধ্যমে বড় ফাইল আপলোড ব্যাহত হয়।'
    },
    desktopWeb: {
      status: 'available',
      note: 'Smooth drag-and-drop up to 5GB per delivery with clean formatting.',
      noteBn: '৫ জিবি পর্যন্ত বড় সোর্স ফাইল অনায়াসে ড্র্যাগ-এন্ড-ড্রপ ডেলিভারি দিন।'
    },
    recommendedDevice: 'desktop'
  },
  {
    id: 'dm_5',
    featureName: 'Profile Bio & Skill Tag Editing',
    featureNameBn: 'প্রোফাইল তথ্য, বায়ো ও স্কিল পরিবর্তন',
    category: 'Profile',
    mobileApp: {
      status: 'limited',
      note: 'Can edit photo and basic bio, but some skill tags require desktop.',
      noteBn: 'ছবি পরিবর্তন করা গেলেও কিছু সার্টিফিকেশন ও টেস্ট দেওয়া যায় না।'
    },
    mobileWeb: {
      status: 'available',
      note: 'Available via profile settings page.',
      noteBn: 'প্রোফাইল সেটিংস থেকে এডিট করা যায়।'
    },
    desktopWeb: {
      status: 'available',
      note: 'Complete editing of portfolio, education, skills, and languages.',
      noteBn: 'সম্পূর্ণ প্রোফাইল ও পোর্টফোলিও সাজানোর জন্য সেরা।'
    },
    recommendedDevice: 'desktop'
  },
  {
    id: 'dm_6',
    featureName: 'Withdrawal & Bank Account Setup',
    featureNameBn: 'ব্যাংক অ্যাকাউন্ট লিঙ্ক ও টাকা তোলা',
    category: 'Finance',
    mobileApp: {
      status: 'limited',
      note: 'Can trigger withdrawal, but initial Payoneer/Bank linking needs web.',
      noteBn: 'টাকা তোলা গেলেও নতুন ব্যাংক লিংক করার জন্য ব্রাউজার দরকার।'
    },
    mobileWeb: {
      status: 'limited',
      note: 'Redirects through Payoneer/PayPal auth portals.',
      noteBn: 'পেওনিয়ার পোর্টালে রিডাইরেক্ট করে।'
    },
    desktopWeb: {
      status: 'available',
      note: 'Secure 2FA verification and smooth payout partner authentication.',
      noteBn: 'নিরাপদে ২-ফ্যাক্টর এসএমএস দিয়ে ব্যাংক অ্যাকাউন্ট যুক্ত করার উত্তম মাধ্যম।'
    },
    recommendedDevice: 'desktop'
  },
  {
    id: 'dm_7',
    featureName: 'Order Tracking & Countdown Timers',
    featureNameBn: 'চলমান অর্ডারের কাউন্টডাউন টাইমার দেখা',
    category: 'Orders',
    mobileApp: {
      status: 'available',
      note: 'Live countdown timer in the Orders tab with push alerts.',
      noteBn: 'অর্ডার ট্যাবে সরাসরি লাইভ টাইমার দেখা যায় এবং এলার্ট আসে।'
    },
    mobileWeb: {
      status: 'available',
      note: 'Visible on Manage Orders page.',
      noteBn: 'অর্ডার পেজে দেখা যায়।'
    },
    desktopWeb: {
      status: 'available',
      note: 'Comprehensive overview with resolution center and requirements.',
      noteBn: 'সবকিছু বিস্তারিত এক নজরে দেখা যায়।'
    },
    recommendedDevice: 'both'
  }
];
