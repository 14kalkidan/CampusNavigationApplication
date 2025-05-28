import React, { createContext, useContext } from 'react';
import { LanguageContext } from '../context/SettingContext'; 

type TranslationsType = {
  en: Record<string, string>;
  am: Record<string, string>;
};

const translationsData: TranslationsType = {
  en: {
    settings: 'Settings',
    theme: 'Theme',
    language: 'Language',
    accessibility: 'Accessibility',
    textSize: 'Text Size',
    highContrast: 'High Contrast',
    textToSpeech: 'Text to Speech',
    light: 'Light',
    dark: 'Dark',
    english: 'English',
    amharic: 'Amharic',
    enlarge: 'Enlarge Text',
    enable: 'Enable',
    disable: 'Disable',
    signIn: 'Sign In',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signUp: 'Sign Up',
    login: 'Log In',
    createAccount: 'Create an Account',
    welcome: 'Welcome to uStogo!',
    loggedIn: 'Logged in as: ',
    register: 'Register',
    forgotPassword: 'Forgot Password?',
    loginFailed: 'Login failed. Please check your credentials.',
    registerFailed: 'Registration failed. Passwords must match.',
    successfullyLoggedIn: 'Successfully logged in!',
    successfullyRegistered: 'Successfully registered!',
    usernameAndPasswordRequired: 'Username and password are required.',
    emailAndPasswordRequired: 'Email and password are required.',
    allFieldsRequired: 'All fields are required.',
    usernameRequiredForSignup: 'Username is required for signup.',
    validEmailRequired: 'Please enter a valid email address.',
    anErrorOccurred: 'An error occurred. Please try again.',
    loginToYourAccount: 'Login to your Account',
    createYourAccount: 'Create your Account',
    logIn: 'Log In',
    dontHaveAccountSignUp: "Don't have an account? Sign up",
    alreadyHaveAccountLogIn: 'Already have an account? Log in',
    emailInUsePleaseLogin: 'This email is already in use. Please log in.',
    passwordsDoNotMatch: 'Passwords do not match.',
    profile: 'Profile',
    usernameRequired: 'Username is required.',
    updateProfile: 'Update Profile',
    profileUpdated: 'Profile Updated',
    profileUpdatedSuccess: 'Your profile has been updated successfully.',
    deleteAccount: 'Delete Account',
    deleteAccountConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
    accountDeleted: 'Account Deleted',
    accountDeletedSuccess: 'Your account has been deleted successfully.',
    cancel: 'Cancel',
    delete: 'Delete',
  },
  am: {
    settings: 'ቅንብሮች',
    theme: 'ገጽታ',
    language: 'ቋንቋ',
    accessibility: 'ተገቢነት',
    textSize: 'የጽሑፍ መጠን',
    highContrast: 'ከፍተኛ መልክ',
    textToSpeech: 'ጽሑፍ ወደ ድምፅ',
    light: 'ቀላል',
    dark: 'ጨለማ',
    english: 'እንግሊዝኛ',
    amharic: 'አማርኛ',
    enlarge: 'ጨምር ጽሑፍ',
    enable: 'አንቃ',
    disable: 'ተግባር',
    signIn: 'ግባ',
    email: 'ኢሜይል',
    password: 'የይለፍ ቃል',
    confirmPassword: 'የይለፍ ቃልን ያረጋግጡ',
    signUp: 'ይመዝገቡ',
    login: 'ግባ',
    createAccount: 'መለያ ፍጠር',
    welcome: 'እንኳን ደህና መጡ ወደ uStogo!',
    loggedIn: 'ገባህ እንደዚህ መለያ ጠቅላላ ነው: ',
    register: 'መዝግብ',
    forgotPassword: 'የይለፍ ቃል ረስተዋል?',
    loginFailed: 'ግባ አልተቻለም። የተመደበ መረጃ ይፈልጉ።',
    registerFailed: 'መዝግብ አልተቻለም። የይለፍ ቃል መልካም መሆን አለበት።',
    successfullyLoggedIn: 'በተሳካ ሁን ገብተህ!',
    successfullyRegistered: 'በተሳካ ሁን ተመዝገብቷል!',
    usernameAndPasswordRequired: 'የተጠቃሚ ስም እና የይለፍ ቃል ይኖርብዎታል።',
    emailAndPasswordRequired: 'ኢሜይል እና የይለፍ ቃል ይኖርብዎታል።',
    allFieldsRequired: 'ሁሉም መስኮች አስፈላጊ ናቸው።',
    usernameRequiredForSignup: 'የተጠቃሚ ስም ለመመዝገብ አስፈላጊ ነው።',
    validEmailRequired: 'እባክዎ እርስዎ የተፈቀደ ኢሜይል አድራሻ ያስገቡ።',
    anErrorOccurred: 'ስህተት አጋጠመ። እባክዎ ደግመው ይሞክሩ።',
    loginToYourAccount: 'ወደ መለያዎ ይግቡ',
    createYourAccount: 'መለያዎን ፍጠሩ',
    logIn: 'ግባ',
    dontHaveAccountSignUp: 'መለያ የለዎትም? ይመዝገቡ',
    alreadyHaveAccountLogIn: 'መለያ አለዎት? ይግቡ',
    emailInUsePleaseLogin: 'ይህ ኢሜይል አስቀድሞ ጥቅም ላይ ውሏል። እባክዎ ይግቡ።',
    passwordsDoNotMatch: 'የይለፍ ቃሎች አይዛመዱም።',
    profile: 'መገለጫ',
    usernameRequired: 'የተጠቃሚ ስም አስፈላጊ ነው።',
    updateProfile: 'መገለጫ አዘምን',
    profileUpdated: 'መገለጫ ተዘምኗል',
    profileUpdatedSuccess: 'መገለጫዎ በተሳካ ሁኔታ ተዘምኗል።',
    deleteAccount: 'መለያ ሰርዝ',
    deleteAccountConfirm: 'መለያዎን መሰረዝ እርግጠኛ ነዎት? ይህ እርምጃ መቀልበስ አይቻልም።',
    accountDeleted: 'መለያ ተሰርዟል',
    accountDeletedSuccess: 'መለያዎ በተሳካ ሁኔታ ተሰርዟል።',
    cancel: 'ይቅር',
    delete: 'ሰርዝ',
  },
};

const TranslationContext = createContext<{
  t: (key: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
} | undefined>(undefined);

export const TranslationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { language, setLanguage } = useContext(LanguageContext);

  const t = (key: string) => translationsData[language][key] || key;

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslations = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};