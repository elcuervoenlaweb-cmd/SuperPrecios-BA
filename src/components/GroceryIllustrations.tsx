import React from 'react';

interface GroceryIllustrationProps {
  type: string;
  className?: string;
  size?: number;
}

export const GroceryIllustration: React.FC<GroceryIllustrationProps> = ({
  type,
  className = '',
  size = 40,
}) => {
  switch (type) {
    case 'milk':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="12" y="16" width="24" height="26" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M16 16L20 8H28L32 16" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="21" y="4" width="6" height="5" rx="1.5" fill="#0284C7" />
          <path d="M17 26C21 24 27 28 31 26" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="33" r="3.5" fill="#38BDF8" />
        </svg>
      );

    case 'cheese':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M8 36L40 36L38 18L8 36Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M8 36L8 28L38 18L38 26L8 36Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="22" cy="27" r="2.5" fill="#EAB308" />
          <circle cx="30" cy="24" r="1.8" fill="#EAB308" />
          <circle cx="16" cy="32" r="1.5" fill="#EAB308" />
        </svg>
      );

    case 'yogurt':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M14 18H34L31 40H17L14 18Z" fill="#FCE7F3" stroke="#DB2777" strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="24" cy="18" rx="11" ry="3.5" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
          <path d="M20 18V10C20 9 21 8 22 8H26C27 8 28 9 28 10V18" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
          <path d="M21 28C24 26 27 30 27 30" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
          <circle cx="24" cy="33" r="2" fill="#DB2777" />
        </svg>
      );

    case 'pasta':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="13" y="10" width="22" height="32" rx="3" fill="#FEF9C3" stroke="#EAB308" strokeWidth="2.5" />
          <path d="M19 16C19 22 29 20 29 26C29 32 19 30 19 36" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
          <path d="M23 16C23 22 25 20 25 26C25 32 23 30 23 36" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="22" width="16" height="6" rx="1" fill="#FACC15" />
        </svg>
      );

    case 'spinach':
    case 'veggie':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M24 38C24 38 12 30 12 18C12 10 20 8 24 8C28 8 36 10 36 18C36 30 24 38 24 38Z" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M24 12V36" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 20L18 16M24 26L17 23M24 23L30 19M24 29L31 25" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'tomato':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <circle cx="24" cy="27" r="15" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2.5" />
          <path d="M24 13V7M24 13L19 10M24 13L29 10M24 13L22 17M24 13L26 17" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 22C29 22 33 26 33 30" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'oil':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="15" y="16" width="18" height="26" rx="4" fill="#FEF08A" stroke="#EAB308" strokeWidth="2.5" />
          <path d="M19 16V10C19 9 20 8 21 8H27C28 8 29 9 29 10V16" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <rect x="22" y="4" width="4" height="4" rx="1" fill="#CA8A04" />
          <path d="M24 25C26 27 26 31 24 33C22 31 22 27 24 25Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
        </svg>
      );

    case 'pastry':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <ellipse cx="24" cy="24" rx="17" ry="17" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.5" />
          <ellipse cx="24" cy="24" rx="13" ry="13" stroke="#F97316" strokeWidth="2" strokeDasharray="4 3" />
          <path d="M17 18L31 30M17 30L31 18" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'chips':
    case 'cookies':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="12" y="12" width="24" height="28" rx="4" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.5" />
          <path d="M12 16L16 12L20 16L24 12L28 16L32 12L36 16" stroke="#EA580C" strokeWidth="2" />
          <circle cx="24" cy="27" r="5" fill="#FDBA74" stroke="#EA580C" strokeWidth="2" />
          <circle cx="22" cy="26" r="1" fill="#9A3412" />
          <circle cx="26" cy="28" r="1" fill="#9A3412" />
        </svg>
      );

    case 'deodorant':
    case 'shaving':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="16" y="18" width="16" height="24" rx="5" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2.5" />
          <rect x="19" y="8" width="10" height="10" rx="3" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="2" />
          <circle cx="24" cy="6" r="2" fill="#4F46E5" />
          <path d="M20 28H28" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'meat':
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M12 28C10 20 16 12 26 12C36 12 40 20 38 28C36 36 28 38 20 38C14 38 12 34 12 28Z" fill="#FFE4E6" stroke="#E11D48" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="4" fill="#FFFFFF" stroke="#BE123C" strokeWidth="2" />
          <path d="M28 20C32 22 34 26 33 29" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'fruit':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
          <circle cx="20" cy="28" r="11" fill="#FED7AA" stroke="#EA580C" strokeWidth="2.5" />
          <circle cx="29" cy="25" r="10" fill="#FECDD3" stroke="#E11D48" strokeWidth="2.5" />
          <path d="M24 15C24 10 28 7 30 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M27 10C29 11 32 10 33 8" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};

export const FloatingGroceryDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft floating illustrations in background corners */}
      <div className="absolute top-4 left-6 opacity-35 hover:opacity-70 transition-opacity hidden lg:block transform -rotate-12">
        <GroceryIllustration type="spinach" size={48} />
      </div>
      <div className="absolute top-8 right-8 opacity-35 hover:opacity-70 transition-opacity hidden lg:block transform rotate-12">
        <GroceryIllustration type="cheese" size={44} />
      </div>
      <div className="absolute bottom-12 left-10 opacity-30 hover:opacity-60 transition-opacity hidden md:block transform rotate-6">
        <GroceryIllustration type="tomato" size={42} />
      </div>
      <div className="absolute bottom-8 right-12 opacity-30 hover:opacity-60 transition-opacity hidden md:block transform -rotate-6">
        <GroceryIllustration type="milk" size={46} />
      </div>
    </div>
  );
};
