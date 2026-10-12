import React from 'react';
import { Image } from 'react-native';
import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';

export const MenuIcon = ({ size = 22, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20M4 12H20M4 18H20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const WalletIcon = ({ size = 18, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 7H3C2.44772 7 2 7.44772 2 8V18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18V8C22 7.44772 21.5523 7 21 7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z"
      fill={color}
    />
    <Path
      d="M2 10C2 8.5 3 5 7 5H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const BellIcon = ({ size = 22, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RupeeIcon = ({ size = 20, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 4H18M6 8.5H18M6 4H12C14.5 4 16.5 5.5 16.5 8C16.5 10.5 14.5 12 12 12H6L15 21"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PlayIcon = ({ size = 18, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M8 5V19L19 12L8 5Z" />
  </Svg>
);

export const PauseIcon = ({ size = 18, color = '#C82333' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Rect x="6" y="5" width="4" height="14" rx="1.5" />
    <Rect x="14" y="5" width="4" height="14" rx="1.5" />
  </Svg>
);

export const ChartIcon = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="14" width="3.5" height="7" rx="1" fill={color} />
    <Rect x="10.25" y="10" width="3.5" height="11" rx="1" fill={color} />
    <Rect x="16.5" y="6" width="3.5" height="15" rx="1" fill={color} />
    <Path
      d="M3 10L9 5L14 8L21 2M21 2H16M21 2V7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CalendarIcon = ({ size = 16, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
  </Svg>
);

export const ChevronRight = ({ size = 16, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ChevronDown = ({ size = 16, color = '#4A5568' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BackArrow = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CloseIcon = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowUpIcon = ({ size = 18, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 19V5M5 12L12 5L19 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const HomeIcon = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 21V12H15V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ClockIcon = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PassbookIcon = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M8 7H16M8 11H16M8 15H13" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const SupportIcon = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M8 10H8.01M12 10H12.01M16 10H16.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const UserIcon = ({ size = 20, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

export const StarIcon = ({ size = 20, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </Svg>
);

export const TrophyIcon = ({ size = 20, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 4H18V10C18 13.3137 15.3137 16 12 16C8.68629 16 6 13.3137 6 10V4Z" stroke={color} strokeWidth="2" />
    <Path d="M6 6H3C2.44772 6 2 6.44772 2 7V9C2 10.6569 3.34315 12 5 12H6" stroke={color} strokeWidth="2" />
    <Path d="M18 6H21C21.5523 6 22 6.44772 22 7V9C22 10.6569 20.6569 12 19 12H18" stroke={color} strokeWidth="2" />
    <Path d="M12 16V20M8 20H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ShareIcon = ({ size = 20, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2" />
    <Path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke={color} strokeWidth="2" />
  </Svg>
);

export const GlobeIcon = ({ size = 20, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M3.6 9H20.4M3.6 15H20.4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M11.5 3C9.5 6 8.5 9 8.5 12C8.5 15 9.5 18 11.5 21" stroke={color} strokeWidth="2" />
    <Path d="M12.5 3C14.5 6 15.5 9 15.5 12C15.5 15 14.5 18 12.5 21" stroke={color} strokeWidth="2" />
  </Svg>
);

export const NoticeIcon = ({ size = 20, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="5" width="16" height="16" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M9 3H15M8 10H16M8 14H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const HeadphoneIcon = ({ size = 20, color = '#6B4226' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 14V11C3 6.02944 7.02944 2 12 2C16.9706 2 21 6.02944 21 11V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Rect x="2" y="14" width="4" height="7" rx="2" fill={color} />
    <Rect x="18" y="14" width="4" height="7" rx="2" fill={color} />
  </Svg>
);

export const ShieldIcon = ({ size = 15, color = '#2E7D32' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L4 5V11C4 16.52 7.41 21.62 12 22C16.59 21.62 20 16.52 20 11V5L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BoltIcon = ({ size = 15, color = '#E65100' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
  </Svg>
);

export const AuthUserIcon = ({ size = 22, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
  </Svg>
);

export const AuthPhoneIcon = ({ size = 22, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="2.2" />
    <Line x1="10" y1="18" x2="14" y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="11" y1="5" x2="13" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const AuthLockIcon = ({ size = 22, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="9" width="14" height="11" rx="2.5" fill={color} stroke={color} strokeWidth="1.5" />
    <Path d="M8 9V6.5C8 4.29 9.79 2.5 12 2.5C14.21 2.5 16 4.29 16 6.5V9" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Circle cx="12" cy="14" r="1.3" fill="#FFFFFF" />
    <Line x1="12" y1="15.2" x2="12" y2="17.2" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
    <Circle cx="6.5" cy="22.5" r="0.9" fill={color} />
    <Circle cx="10" cy="22.5" r="0.9" fill={color} />
    <Circle cx="13.5" cy="22.5" r="0.9" fill={color} />
    <Circle cx="17" cy="22.5" r="0.9" fill={color} />
  </Svg>
);

export const AuthCheckIcon = ({ size = 12, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AuthEyeIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AuthEyeOffIcon = ({ size = 20, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12C2.24 9.8 4.09 7.94 6.27 6.72M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12C22.18 13.46 21.05 14.8 19.68 15.88M1 1L23 23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9.88 9.88A3 3 0 1 0 14.12 14.12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AuthTicketIcon = ({ size = 20, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 9C3.66 9 5 7.66 5 6H19C19 7.66 20.34 9 22 9V15C20.34 15 19 16.34 19 18H5C5 16.34 3.66 15 2 15V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="12" y1="7" x2="12" y2="17" stroke={color} strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
  </Svg>
);

export const BankBuildingIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9.5L12 4L21 9.5M5 10V18M9 10V18M15 10V18M19 10V18M3 19H21M2 21H22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AtmCardIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="3" stroke={color} strokeWidth="2" />
    <Line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth="2" />
    <Rect x="6" y="14" width="4" height="2" rx="0.5" fill={color} />
  </Svg>
);

export const WalletUploadIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke={color} strokeWidth="2" />
    <Path d="M12 3V11M8 7L12 3L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PhoneCardIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="12" height="17" rx="2" stroke={color} strokeWidth="2" />
    <Rect x="10" y="10" width="12" height="8" rx="2" stroke={color} strokeWidth="2" />
    <Line x1="6" y1="18" x2="8" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const GiftIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 12V21H4V12M2 7H22V12H2V7ZM12 21V7M12 7H7.5C6.11929 7 5 5.88071 5 4.5C5 3.11929 6.11929 2 7.5 2C9.5 2 12 7 12 7ZM12 7H16.5C17.8807 7 19 5.88071 19 4.5C19 3.11929 17.8807 2 16.5 2C14.5 2 12 7 12 7Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const DoorExitIcon = ({ size = 32, color = '#E11D48' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 3V21M3 21H21M15 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H15M11 12H11.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ExitDoorGraphic = ({ size = 80 }) => (
  <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    {/* Soft pink / coral rounded blob */}
    <Circle cx="40" cy="38" r="26" fill="#F87171" opacity="0.6" />
    {/* Outer door frame */}
    <Rect x="26" y="18" width="28" height="42" rx="1" stroke="#991B1B" strokeWidth="2" fill="none" />
    {/* Open door panel swung open */}
    <Path
      d="M34 20L51 24V57L34 60V20Z"
      fill="#FFFFFF"
      stroke="#991B1B"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Door knob dot */}
    <Circle cx="48" cy="42" r="2.2" fill="#991B1B" />
    {/* Base floor line */}
    <Line x1="21" y1="60" x2="59" y2="60" stroke="#991B1B" strokeWidth="2.4" strokeLinecap="round" />
  </Svg>
);

export const ClockHistoryIcon = ({ size = 22, color = '#7A5524' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 3v5h5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 7v5l3 2"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const NoticeDocIcon = ({ size = 22, color = '#7A5524' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const DrawerWalletIcon = ({ size = 22, color = '#7A5524' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M16 14h4v-4h-4a2 2 0 100 4z" stroke={color} strokeWidth="2" fill="none" />
    <Circle cx="18" cy="12" r="1" fill={color} />
  </Svg>
);

export const PowerIcon = ({ size = 20, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2V12M18.36 6.64C19.78 8.06 20.57 10 20.57 12C20.57 16.73 16.73 20.57 12 20.57C7.27 20.57 3.43 16.73 3.43 12C3.43 10 4.22 8.06 5.64 6.64" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const InfoIcon = ({ size = 20, color = '#7A5524' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 8V8.01M12 11V16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const NaviIcon = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M8 28V12L20 28V12" stroke="#00D09C" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="26" y="22" width="6" height="6" rx="1.5" fill="#00D09C" />
  </Svg>
);

export const PhonePeIcon = ({ size = 28, style, ...props }) => (
  <Image
    source={require('../assets/icon/phonepe.png')}
    style={[{ width: size, height: size }, style]}
    resizeMode="contain"
    {...props}
  />
);

export const PaytmIcon = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 50 30" fill="none">
    <Rect width="50" height="30" rx="6" fill="#002E6E" />
    <Path d="M9 9H16C17.6 9 19 10.4 19 12C19 13.6 17.6 15 16 15H9V21H6V9H9Z" fill="#FFFFFF" />
    <Path d="M22 15C22 12 24 10 27 10C30 10 32 12 32 15V21H29V15C29 13.5 28 12.5 27 12.5C26 12.5 25 13.5 25 15V21H22V15Z" fill="#00B9F5" />
    <Path d="M37 10H40V21H37V10Z" fill="#00B9F5" />
  </Svg>
);

export const GPayIcon = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Path d="M32 20C32 13.4 26.6 8 20 8C13.4 8 8 13.4 8 20C8 26.6 13.4 32 20 32C26.6 32 32 26.6 32 20Z" fill="#FFFFFF" />
    <Path d="M29 20.3C29 19.5 28.9 18.8 28.8 18.2H20V21.8H25.1C24.9 22.9 24.2 23.9 23.2 24.5V26.8H26.3C28.1 25.1 29 22.9 29 20.3Z" fill="#4285F4" />
    <Path d="M20 29.5C22.6 29.5 24.7 28.6 26.3 26.8L23.2 24.5C22.4 25 21.3 25.4 20 25.4C17.5 25.4 15.3 23.7 14.5 21.4H11.3V23.9C13 27.2 16.2 29.5 20 29.5Z" fill="#34A853" />
    <Path d="M14.5 21.4C14.1 20.2 14.1 18.8 14.5 17.6V15.1H11.3C9.9 17.9 9.9 21.1 11.3 23.9L14.5 21.4Z" fill="#FBBC05" />
    <Path d="M20 13.6C21.4 13.6 22.7 14.1 23.7 15L26.4 12.3C24.6 10.7 22.4 9.7 20 9.7C16.2 9.7 13 12 11.3 15.1L14.5 17.6C15.3 15.3 17.5 13.6 20 13.6Z" fill="#EA4335" />
  </Svg>
);

export const WalletCashIllustration = ({ size = 56 }) => (
  <Svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    {/* Cash bill sticking out */}
    <Rect x="16" y="10" width="30" height="20" rx="3" fill="#34D399" stroke="#059669" strokeWidth="2" transform="rotate(-10 16 10)" />
    <Circle cx="30" cy="18" r="4" fill="#A7F3D0" />
    {/* Second cash bill */}
    <Rect x="20" y="8" width="30" height="20" rx="3" fill="#10B981" stroke="#047857" strokeWidth="2" transform="rotate(4 20 8)" />
    {/* Front Wallet */}
    <Rect x="8" y="20" width="44" height="32" rx="6" fill="#C2410C" stroke="#9A3412" strokeWidth="2" />
    <Path d="M8 26H52" stroke="#7C2D12" strokeWidth="2" />
    <Rect x="36" y="30" width="16" height="12" rx="3" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    <Circle cx="42" cy="36" r="2.5" fill="#FDE047" />
  </Svg>
);

export const NavHistoryIcon = ({ size = 26, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.5 12A8.5 8.5 0 1 0 6.5 5.5L3.5 8.5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.5 3.5V8.5H8.5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 7V12L15.5 14"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const NavWalletIcon = ({ size = 26, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3.5 8.5C3.5 6.8 4.8 5.5 6.8 5.5H18C19.5 5.5 20.5 6.2 21 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Rect x="2.5" y="7.5" width="19" height="13" rx="2.5" stroke={color} strokeWidth="2" />
    <Path
      d="M16 11H20C21.1 11 22 11.9 22 13V15C22 16.1 21.1 17 20 17H16C15.2 17 14.5 16.3 14.5 15.5V12.5C14.5 11.7 15.2 11 16 11Z"
      stroke={color}
      strokeWidth="1.8"
      fill="#061224"
    />
    <Circle cx="18" cy="14" r="1.1" fill={color} />
  </Svg>
);

export const NavHomeIcon = ({ size = 28, color = '#F2B83B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10.5L12 3.5L21 10.5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.5 9.5V20C5.5 20.55 5.95 21 6.5 21H17.5C18.05 21 18.5 20.55 18.5 20V9.5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5 21V12.5C9.5 12.22 9.72 12 10 12H14C14.28 12 14.5 12.22 14.5 12.5V21"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const NavPassbookIcon = ({ size = 26, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="3" width="16" height="18" rx="3" stroke={color} strokeWidth="2" />
    <Circle cx="8" cy="7.5" r="1.2" fill={color} />
    <Line x1="11" y1="7.5" x2="16" y2="7.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="8" cy="12" r="1.2" fill={color} />
    <Line x1="11" y1="12" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="8" cy="16.5" r="1.2" fill={color} />
    <Line x1="11" y1="16.5" x2="16" y2="16.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const NavSupportIcon = ({ size = 26, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13.5 10.5C13.5 7.46 11 5 7.8 5C4.5 5 2 7.46 2 10.5C2 12.2 2.85 13.7 4.2 14.7L3.5 18L6.8 16.7C7.1 16.8 7.45 16.88 7.8 16.88C11 16.88 13.5 14.42 13.5 11.38"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.5 6.8C14.2 6.3 15.1 6 16.2 6C19.1 6 21.5 8 21.5 10.5C21.5 12 20.7 13.3 19.5 14.2L20 17L17.2 15.8C16.9 15.9 16.5 16 16.2 16C15 16 13.9 15.5 13.1 14.6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="15.8" cy="11" r="0.9" fill={color} />
    <Circle cx="17.8" cy="11" r="0.9" fill={color} />
    <Circle cx="19.8" cy="11" r="0.9" fill={color} />
  </Svg>
);

export const CapsuleRupeeIcon = ({ size = 25, color = '#7A4200' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 3.5H18M6 8H18M6 3.5H12C14.76 3.5 17 5.51 17 8C17 10.49 14.76 12.5 12 12.5H6L15 21.5"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BlackShieldCheckIcon = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L4 5V11C4 16.52 7.41 21.62 12 22C16.59 21.62 20 16.52 20 11V5L12 2Z"
      fill="#1C1C1C"
    />
    <Path
      d="M9 12L11 14L15 9.5"
      stroke="#FFFFFF"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RefreshIcon = ({ size = 22, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5V9H8"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 13A8.1 8.1 0 0 0 19.5 15M20 19V15H16"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ReceiptGirlIllustration = ({ size = 120 }) => (
  <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    {/* Soft lavender circular backdrop */}
    <Circle cx="60" cy="70" r="36" fill="#EDE9FE" />

    {/* Left paper invoice */}
    <G transform="rotate(-12 36 60)">
      <Rect x="26" y="36" width="20" height="32" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
      <Line x1="30" y1="42" x2="42" y2="42" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="30" y1="46" x2="42" y2="46" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="30" y1="50" x2="38" y2="50" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="30" y1="54" x2="42" y2="54" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="30" y1="58" x2="36" y2="58" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    </G>

    {/* Right paper invoice */}
    <G transform="rotate(12 84 60)">
      <Rect x="74" y="36" width="20" height="32" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
      <Line x1="78" y1="42" x2="90" y2="42" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="78" y1="46" x2="90" y2="46" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="78" y1="50" x2="86" y2="50" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="78" y1="54" x2="90" y2="54" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="78" y1="58" x2="84" y2="58" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    </G>

    {/* Girl body */}
    <Path d="M46 72C46 66 52 64 60 64C68 64 74 66 74 72V86H46V72Z" fill="#5B5CE5" />
    {/* Collar */}
    <Path d="M55 64L60 70L65 64" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

    {/* Arms holding papers */}
    <Path d="M46 68L35 60" stroke="#5B5CE5" strokeWidth="5" strokeLinecap="round" />
    <Circle cx="35" cy="59" r="3.5" fill="#FFE4D6" />
    <Path d="M74 68L85 60" stroke="#5B5CE5" strokeWidth="5" strokeLinecap="round" />
    <Circle cx="85" cy="59" r="3.5" fill="#FFE4D6" />

    {/* Skirt / lower body */}
    <Path d="M50 86H70V94H50V86Z" fill="#0F172A" />

    {/* Girl Face & Hair */}
    <Circle cx="60" cy="53" r="10" fill="#FFE4D6" />
    {/* Cheeks */}
    <Circle cx="54" cy="56" r="1.5" fill="#FCA5A5" />
    <Circle cx="66" cy="56" r="1.5" fill="#FCA5A5" />
    {/* Eyes */}
    <Circle cx="56" cy="53" r="1.2" fill="#0F172A" />
    <Circle cx="64" cy="53" r="1.2" fill="#0F172A" />
    {/* Smile */}
    <Path d="M58 57C59 58 61 58 62 57" stroke="#0F172A" strokeWidth="1" strokeLinecap="round" />

    {/* Hair */}
    <Path d="M48 54C48 44 54 41 60 41C66 41 72 44 72 54C72 56 70 60 70 60C68 53 66 47 60 47C54 47 52 53 50 60C50 60 48 56 48 54Z" fill="#0F172A" />
    <Path d="M49 49C52 47 57 47 60 50C63 47 68 47 71 49" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

export const WalletBonusIcon = ({ size = 44 }) => (
  <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <Circle cx="22" cy="22" r="22" fill="#0B1728" />
    <Rect x="12" y="15" width="20" height="15" rx="3.5" fill="#15803D" />
    <Path d="M12 18H32" stroke="#166534" strokeWidth="1.5" />
    <Rect x="23" y="20.5" width="7" height="6" rx="2" fill="#FACC15" />
    <Circle cx="26.5" cy="23.5" r="1.2" fill="#78350F" />
  </Svg>
);

export const BankBuildingPillIcon = ({ size = 48 }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill="#E2E8F0" />
    {/* Roof Triangle */}
    <Path d="M15 20L24 14L33 20" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="13" y1="21" x2="35" y2="21" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    {/* Pillars */}
    <Line x1="17" y1="23" x2="17" y2="30" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="22" y1="23" x2="22" y2="30" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="26" y1="23" x2="26" y2="30" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="31" y1="23" x2="31" y2="30" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    {/* Base */}
    <Line x1="13" y1="32" x2="35" y2="32" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="11" y1="35" x2="37" y2="35" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const PhonePeAppIcon = ({ size = 44, style, ...props }) => (
  <Image
    source={require('../assets/icon/phonepe.png')}
    style={[{ width: size, height: size }, style]}
    resizeMode="contain"
    {...props}
  />
);

export const GooglePayAppIcon = ({ size = 44 }) => (
  <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <Path d="M22 13C16 13 13 18 13 22C13 26 16 31 22 31C27 31 29.5 28 30.5 25H22V20H35C35.5 21.5 35.5 23 35.5 24C35.5 31 30.5 35 22 35C14.8 35 9 29.2 9 22C9 14.8 14.8 9 22 9C26 9 29.5 10.5 32 12.8L28.2 16.6C26.5 15 24.5 13 22 13Z" fill="#4285F4" />
    <Path d="M35 18L27 26L21 20L25 16L27 18L32 13L35 18Z" fill="#34A853" />
    <Path d="M11 26C9.5 23.5 9.5 20.5 11 18L15 21C14.5 22.5 14.5 23.5 15 25L11 26Z" fill="#FBBC05" />
    <Path d="M22 9C25.5 9 28.5 10.2 31 12.5L27 16.5C25.5 15 23.8 14 22 14C17.5 14 14.5 17 13.5 20.5L9.5 17.5C12 12.5 16.5 9 22 9Z" fill="#EA4335" />
  </Svg>
);

export const PaytmAppIcon = ({ size = 44 }) => (
  <Svg width={size * 1.5} height={size * 0.75} viewBox="0 0 66 33" fill="none">
    <Path
      d="M4 10H12C14.2 10 16 11.8 16 14C16 16.2 14.2 18 12 18H8V24H4V10ZM8 14H12C12.6 14 13 13.6 13 13C13 12.4 12.6 12 12 12H8V14Z"
      fill="#002E6E"
    />
    <Path
      d="M20 18C20 15 22 13 25 13C28 13 30 15 30 18V24H27V18C27 16.5 26 15.5 25 15.5C24 15.5 23 16.5 23 18V24H20V18Z"
      fill="#00B9F5"
    />
    <Path
      d="M33 11V14H37V16H33V22C33 23 33.5 23.5 34.5 23.5H37V25.5C36 25.8 34.8 26 33.5 26C31 26 30 24.5 30 22V16H28V14H30V11H33Z"
      fill="#00B9F5"
    />
    <Path
      d="M39 14H42L45 20L48 14H51L46.5 22.5V28H43.5V22.5L39 14Z"
      fill="#00B9F5"
    />
  </Svg>
);

export const EditPencilIcon = ({ size = 20, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 3A2.828 2.828 0 1 1 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DiceIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth="2.2" />
    <Circle cx="8" cy="8" r="1.5" fill={color} />
    <Circle cx="16" cy="8" r="1.5" fill={color} />
    <Circle cx="8" cy="16" r="1.5" fill={color} />
    <Circle cx="16" cy="16" r="1.5" fill={color} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
  </Svg>
);

export const TrophySilhouette = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Path
      d="M20 14H44V26C44 32.6 38.6 38 32 38C25.4 38 20 32.6 20 26V14Z"
      fill="#CBD5E1"
    />
    <Path
      d="M20 18H14C11.8 18 10 19.8 10 22C10 26 13.5 28 17 28H20V18Z"
      fill="#CBD5E1"
    />
    <Path
      d="M44 18H50C52.2 18 54 19.8 54 22C54 26 50.5 28 47 28H44V18Z"
      fill="#CBD5E1"
    />
    <Rect x="29" y="38" width="6" height="12" fill="#CBD5E1" />
    <Rect x="20" y="50" width="24" height="6" rx="2" fill="#94A3B8" />
  </Svg>
);

export const AppGridIcon = ({ size = 18, color = '#0284C7' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <Rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <Rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <Rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </Svg>
);

export const LineChartIcon = ({ size = 18, color = '#D97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17L9 11L13 15L21 7"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 7H21V12"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x="3" y="19" width="18" height="2" rx="1" fill={color} />
  </Svg>
);

export const TrophyOrangeIcon = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 3H18V9C18 12.31 15.31 15 12 15C8.69 15 6 12.31 6 9V3Z"
      fill="#F97316"
      stroke="#EA580C"
      strokeWidth="1.5"
    />
    <Path
      d="M6 5H3C2.45 5 2 5.45 2 6C2 8.5 3.5 10 6 10V5Z"
      fill="#F97316"
      stroke="#EA580C"
      strokeWidth="1.2"
    />
    <Path
      d="M18 5H21C21.55 5 22 5.45 22 6C22 8.5 20.5 10 18 10V5Z"
      fill="#F97316"
      stroke="#EA580C"
      strokeWidth="1.2"
    />
    <Path d="M10 15V18H14V15" fill="#EA580C" />
    <Rect x="7" y="18" width="10" height="3" rx="1" fill="#C2410C" />
  </Svg>
);

export const PanelTrendIcon = ({ size = 18, color = '#D97706' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 18V13L8 9.5L13 12.5L20 6V18H3Z"
      fill={color}
      fillOpacity="0.25"
    />
    <Path
      d="M3 13L8 9.5L13 12.5L20 6"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="8" cy="9.5" r="1.8" fill={color} />
    <Circle cx="13" cy="12.5" r="1.8" fill={color} />
    <Circle cx="20" cy="6" r="1.8" fill={color} />
    <Rect x="3" y="18" width="18" height="2" rx="1" fill={color} />
  </Svg>
);

export const ContactPhoneIcon = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M21 5C23.2 5 25 6.8 25 9C25 11.2 23.2 13 21 13H19.5L17.5 15V13H21C23.2 13 25 11.2 25 9"
      fill="#F59E0B"
    />
    <Circle cx="20.5" cy="9" r="1.1" fill="#FFFFFF" />
    <Circle cx="23" cy="9" r="1.1" fill="#FFFFFF" />
    <Path
      d="M9.5 8C9 9 9.5 11 11.5 14C13.5 17 16 19 18 20C19.5 20.7 20.8 20.3 21.8 19.3L23 18C23.6 17.4 23.4 16.4 22.6 16L19.5 14.3C18.8 13.9 17.9 14.1 17.4 14.7L16.6 15.5C15.8 15 14.5 14 13.5 12.7L14.2 11.8C14.7 11.2 14.8 10.3 14.3 9.7L12.3 6.8C11.8 6.1 10.8 6 10.1 6.6L9.5 8Z"
      fill="#0284C7"
      stroke="#0369A1"
      strokeWidth="1.2"
    />
  </Svg>
);

export const ContactTelegramIcon = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="14" fill="#24A1DE" />
    <Path
      d="M8.5 15.5L22 9.5L19 23L14.5 18.5L11 19.5L13.5 15.5L20 11.5L12 16.5L8.5 15.5Z"
      fill="#FFFFFF"
    />
  </Svg>
);

export const ContactWhatsappIcon = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="14" fill="#25D366" />
    <Path
      d="M12.8 11.8C12.5 11.2 12.2 11.2 11.8 11.2C11.5 11.2 11.2 11.2 10.9 11.5C10.6 11.8 9.8 12.6 9.8 14.1C9.8 15.7 11 17.2 11.2 17.4C11.4 17.7 13.6 21 16.8 22.3C19.5 23.4 20 23.2 20.6 23.1C21.2 23 22.5 22.3 22.8 21.5C23.1 20.7 23.1 20 23 19.8C22.9 19.7 22.6 19.6 22.1 19.3C21.6 19.1 19.2 17.9 18.8 17.7C18.4 17.6 18.1 17.5 17.8 17.9C17.5 18.4 16.7 19.3 16.5 19.6C16.3 19.8 16 19.9 15.5 19.6C15 19.4 13.5 18.9 12.3 17.8C11.4 17 10.8 16 10.6 15.6C10.4 15.1 10.6 14.9 10.8 14.7C11 14.5 11.3 14.1 11.5 13.8C11.7 13.5 11.8 13.3 11.9 13C12 12.7 11.9 12.5 11.8 12.3C11.7 12.1 11.1 10.5 10.8 9.9Z"
      fill="#FFFFFF"
    />
  </Svg>
);

export const ContactChatIcon = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M7 10C7 7.8 8.8 6 11 6H19C21.2 6 23 7.8 23 10V14C23 16.2 21.2 18 19 18H16L12 21V18H11C8.8 18 7 16.2 7 14V10Z"
      fill="#FFFFFF"
      stroke="#475569"
      strokeWidth="1.5"
    />
    <Circle cx="12" cy="12" r="1.2" fill="#475569" />
    <Circle cx="15" cy="12" r="1.2" fill="#475569" />
    <Circle cx="18" cy="12" r="1.2" fill="#475569" />
    <Path
      d="M15 15C15 13.3 16.3 12 18 12H24C25.7 12 27 13.3 27 15V19C27 20.7 25.7 22 24 22H23V25L20 22H18C16.3 22 15 20.7 15 19V15Z"
      fill="#0D9488"
    />
    <Line x1="18" y1="16" x2="24" y2="16" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    <Line x1="18" y1="18.5" x2="22" y2="18.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
  </Svg>
);

export const SupportTeamIllustration = ({ width = 280, height = 170 }) => (
  <Svg width={width} height={height} viewBox="0 0 320 185" fill="none">
    {/* Desk base */}
    <Rect x="40" y="148" width="240" height="7" rx="3.5" fill="#B2DFDB" />

    {/* Rep 1 (Left man with dark hair & green shirt) */}
    <Circle cx="75" cy="80" r="17" fill="#FBCFE8" />
    <Path d="M60 70C60 60 90 60 90 70V80H60V70Z" fill="#1E293B" />
    <Circle cx="58" cy="80" r="4.5" fill="#10B981" />
    <Circle cx="92" cy="80" r="4.5" fill="#10B981" />
    <Path d="M58 80C58 66 92 66 92 80" stroke="#047857" strokeWidth="2.5" />
    <Path d="M50 110C50 100 100 100 100 110V148H50V110Z" fill="#059669" />

    {/* Rep 2 (Back blonde woman) */}
    <Circle cx="120" cy="65" r="16" fill="#FED7AA" />
    <Path d="M104 56C104 46 136 46 136 56V72C136 74 130 76 120 76C110 76 104 74 104 72V56Z" fill="#B45309" />
    <Circle cx="106" cy="65" r="4" fill="#0D9488" />
    <Circle cx="134" cy="65" r="4" fill="#0D9488" />
    <Path d="M106 65C106 52 134 52 134 65" stroke="#0D9488" strokeWidth="2.2" />
    <Path d="M96 90C96 80 144 80 144 90V135H96V90Z" fill="#10B981" />

    {/* Rep 3 (Center woman with orange hair & glasses) */}
    <Circle cx="155" cy="82" r="17" fill="#FEE2E2" />
    <Path d="M138 72C138 58 172 58 172 72V86C172 88 166 90 155 90C144 90 138 88 138 86V72Z" fill="#EA580C" />
    <Circle cx="140" cy="82" r="4.5" fill="#0284C7" />
    <Circle cx="170" cy="82" r="4.5" fill="#0284C7" />
    <Path d="M140 82C140 68 170 68 170 82" stroke="#0284C7" strokeWidth="2.2" />
    <Circle cx="149" cy="82" r="4" stroke="#0F172A" strokeWidth="1.2" />
    <Circle cx="161" cy="82" r="4" stroke="#0F172A" strokeWidth="1.2" />
    <Line x1="153" y1="82" x2="157" y2="82" stroke="#0F172A" strokeWidth="1.2" />
    <Path d="M130 112C130 100 180 100 180 112V148H130V112Z" fill="#0D9488" />

    {/* Rep 4 (Back dark man) */}
    <Circle cx="185" cy="64" r="16" fill="#C2410C" />
    <Path d="M170 52C170 42 200 42 200 52V60H170V52Z" fill="#0F172A" />
    <Circle cx="172" cy="64" r="4" fill="#10B981" />
    <Circle cx="198" cy="64" r="4" fill="#10B981" />
    <Path d="M172 64C172 50 198 50 198 64" stroke="#047857" strokeWidth="2.2" />
    <Path d="M165 88C165 78 210 78 210 88V135H165V88Z" fill="#047857" />

    {/* Rep 5 (Middle brunette woman) */}
    <Circle cx="215" cy="82" r="17" fill="#FED7AA" />
    <Path d="M200 70C200 58 230 58 230 70V88C230 90 224 92 215 92C206 92 200 90 200 88V70Z" fill="#1E293B" />
    <Circle cx="202" cy="82" r="4.5" fill="#059669" />
    <Circle cx="228" cy="82" r="4.5" fill="#059669" />
    <Path d="M202 82C202 68 228 68 228 82" stroke="#059669" strokeWidth="2.2" />
    <Path d="M190 110C190 100 240 100 240 110V148H190V110Z" fill="#065F46" />

    {/* Rep 6 (Right curly hair woman) */}
    <Circle cx="255" cy="75" r="17" fill="#9A3412" />
    <Path d="M238 64C238 50 272 50 272 64V84C272 86 266 88 255 88C244 88 238 86 238 84V64Z" fill="#1E293B" />
    <Circle cx="241" cy="75" r="4.5" fill="#10B981" />
    <Circle cx="269" cy="75" r="4.5" fill="#10B981" />
    <Path d="M241 75C241 60 269 60 269 75" stroke="#047857" strokeWidth="2.2" />
    <Path d="M232 102C232 92 280 92 280 102V148H232V102Z" fill="#34D399" />

    {/* Laptops in front */}
    <Rect x="85" y="125" width="42" height="26" rx="3" fill="#6EE7B7" />
    <Circle cx="106" cy="138" r="2.5" fill="#047857" />
    <Rect x="160" y="126" width="45" height="27" rx="3" fill="#34D399" />
    <Circle cx="182.5" cy="139.5" r="2.5" fill="#047857" />
    <Rect x="230" y="125" width="42" height="26" rx="3" fill="#6EE7B7" />
    <Circle cx="251" cy="138" r="2.5" fill="#047857" />
  </Svg>
);

export const CalendarGoldIcon = ({ size = 20, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="2" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1.8" />
    <Circle cx="8" cy="13" r="1.2" fill={color} />
    <Circle cx="12" cy="13" r="1.2" fill={color} />
    <Circle cx="16" cy="13" r="1.2" fill={color} />
    <Circle cx="8" cy="17" r="1.2" fill={color} />
    <Circle cx="12" cy="17" r="1.2" fill={color} />
    <Circle cx="16" cy="17" r="1.2" fill={color} />
  </Svg>
);

export const HourglassRedIcon = ({ size = 24, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2H18M6 22H18M7 2V6C7 8.21 8.79 10 11 10H13C15.21 10 17 8.21 17 6V2M7 22V18C7 15.79 8.79 14 11 14H13C15.21 14 17 15.79 17 18V22"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M10 17H14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Path d="M11 7H13" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

export const CalendarRedIcon = ({ size = 18, color = '#E11D48' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="1.8" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1.6" />
    <Circle cx="8" cy="13" r="1.2" fill={color} />
    <Circle cx="12" cy="13" r="1.2" fill={color} />
    <Circle cx="16" cy="13" r="1.2" fill={color} />
    <Circle cx="8" cy="17" r="1.2" fill={color} />
    <Circle cx="12" cy="17" r="1.2" fill={color} />
    <Circle cx="16" cy="17" r="1.2" fill={color} />
  </Svg>
);

export const AlarmClockRedIcon = ({ size = 18, color = '#E11D48' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="13" r="7.5" stroke={color} strokeWidth="1.8" />
    <Path d="M12 9.5V13L14.5 14.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4.5 4.5L7.5 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M19.5 4.5L16.5 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const ClockCrossedRedIcon = ({ size = 18, color = '#E11D48' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="13" r="7.5" stroke={color} strokeWidth="1.8" />
    <Path d="M12 9.5V13L14.5 14.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="5" y1="6" x2="19" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const BlueTrendingLineIcon = ({ size = 26, color = '#2563EB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3V21H21"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 14L12 9L16 13L21 6"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 6H21V10"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const GoldLockIcon = ({ size = 15, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="10" width="16" height="12" rx="3" fill={color} />
    <Path
      d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10"
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="15" r="1.5" fill="#1E293B" />
  </Svg>
);

export const GoldTrophySmallIcon = ({ size = 15, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 4H17V9C17 11.76 14.76 14 12 14C9.24 14 7 11.76 7 9V4Z"
      fill={color}
    />
    <Path d="M7 6H4C4 8.5 5.5 10 7 10.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M17 6H20C20 8.5 18.5 10 17 10.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M10 17H14V14H10V17Z" fill={color} />
    <Path d="M8 20H16V17H8V20Z" fill={color} />
  </Svg>
);

export const WhatsAppGreenIcon = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <Circle cx="18" cy="18" r="18" fill="#25D366" />
    <Path
      d="M18 7C12.48 7 8 11.48 8 17C8 18.85 8.5 20.58 9.38 22.08L8.2 26.5L12.75 25.32C14.2 26.12 16.05 26.6 18 26.6C23.52 26.6 28 22.12 28 16.6C28 11.08 23.52 7 18 7ZM23.05 20.85C22.82 21.48 21.75 22.02 21.2 22.08C20.65 22.15 20.08 22.12 18.15 21.32C15.82 20.35 14.32 17.98 14.2 17.82C14.08 17.65 13.25 16.55 13.25 15.42C13.25 14.28 13.82 13.72 14.05 13.48C14.28 13.25 14.58 13.2 14.78 13.2C14.98 13.2 15.15 13.2 15.28 13.2C15.45 13.2 15.65 13.12 15.85 13.62C16.08 14.18 16.62 15.52 16.7 15.65C16.78 15.78 16.82 15.95 16.72 16.12C16.62 16.3 16.55 16.4 16.4 16.58C16.25 16.75 16.08 16.95 15.95 17.08C15.8 17.22 15.65 17.38 15.82 17.68C16 17.98 16.62 19 17.52 19.82C18.68 20.85 19.65 21.18 19.98 21.32C20.28 21.45 20.48 21.42 20.65 21.22C20.85 20.98 21.32 20.38 21.55 20.05C21.78 19.72 22.02 19.78 22.32 19.88C22.62 19.98 24.28 20.8 24.62 20.98C24.95 21.15 25.18 21.25 25.25 21.38C25.32 21.5 25.32 22.18 25.08 22.82"
      fill="#FFFFFF"
    />
  </Svg>
);

export const SmileyIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.8" />
    <Circle cx="8.5" cy="10" r="1.3" fill={color} />
    <Circle cx="15.5" cy="10" r="1.3" fill={color} />
    <Path
      d="M8 14.5C9.2 16.5 14.8 16.5 16 14.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

export const ClipIcon = ({ size = 22, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.44 11.05L12.25 20.24C10.14 22.35 6.72 22.35 4.61 20.24C2.5 18.13 2.5 14.71 4.61 12.6L13.8 3.41C15.21 2 17.49 2 18.9 3.41C20.31 4.82 20.31 7.1 18.9 8.51L10.42 16.99C9.72 17.69 8.58 17.69 7.87 16.99C7.16 16.29 7.16 15.15 7.87 14.44L15.65 6.66"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SendPaperPlaneIcon = ({ size = 22, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const WarningAlertIcon = ({ size = 32, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 9V14M12 17.5V18"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <Path
      d="M10.29 3.86L1.82 18C1.65 18.3 1.55 18.64 1.55 19C1.55 20.1 2.45 21 3.55 21H20.45C20.81 21 21.15 20.9 21.45 20.73C22.45 20.17 22.78 18.91 22.18 17.91L13.71 3.86C13.53 3.56 13.27 3.32 12.96 3.17C11.97 2.68 10.77 3.03 10.29 3.86Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TranslateIcon = ({ size = 22, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12.87 15.07L10.33 12.56C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H11.17C10.5 7.92 9.44 9.75 8 11.35C7.07 10.32 6.3 9.19 5.69 8H3.69C4.42 9.63 5.42 11.17 6.67 12.56L1.58 17.58L3 19L8 14L11.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z"
      fill={color}
    />
  </Svg>
);

export const CheckCircleFillIcon = ({ size = 22, color = '#E2B048' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" fill={color} />
    <Path
      d="M8 12.5L10.8 15.3L16.5 9"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CalendarClockIcon = ({ size = 22, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="14" height="15" rx="2" stroke={color} strokeWidth="2" />
    <Line x1="13" y1="2" x2="13" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="7" y1="2" x2="7" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="3" y1="9" x2="17" y2="9" stroke={color} strokeWidth="2" />
    <Circle cx="17" cy="17" r="5" fill="#061224" stroke={color} strokeWidth="1.8" />
    <Path d="M17 14.5V17L18.5 18.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

