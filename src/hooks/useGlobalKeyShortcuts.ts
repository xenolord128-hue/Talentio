import { useEffect, useCallback } from 'react';
import { useGuide, TalentioPage } from '../context/GuideContext';
import { useTheme } from '../context/ThemeContext';

export interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Navigation' | 'Actions' | 'Modals & Search' | 'Accessibility';
  actionName: string;
}

export const SHORTCUTS_REGISTRY: ShortcutItem[] = [
  {
    keys: ['⌘', 'K'],
    description: 'Open Global Search & Command Palette',
    category: 'Modals & Search',
    actionName: 'Search Modal'
  },
  {
    keys: ['/'],
    description: 'Quick search (when not editing text)',
    category: 'Modals & Search',
    actionName: 'Quick Search'
  },
  {
    keys: ['Esc'],
    description: 'Close active modal, drawer, or overlay',
    category: 'Modals & Search',
    actionName: 'Close / Dismiss'
  },
  {
    keys: ['⌘', 'J'],
    description: 'Post a New Project / RFP Escrow Request',
    category: 'Actions',
    actionName: 'Post Project'
  },
  {
    keys: ['Alt', 'N'],
    description: 'Create Service Gig / Post RFP',
    category: 'Actions',
    actionName: 'New Listing'
  },
  {
    keys: ['Alt', 'D'],
    description: 'Toggle Voice Dictation & Speech Recognition in Chat',
    category: 'Actions',
    actionName: 'Speech Dictation'
  },
  {
    keys: ['Alt', 'T'],
    description: 'Cycle Theme (Light ⇄ Dark ⇄ High-Contrast)',
    category: 'Accessibility',
    actionName: 'Cycle Theme'
  },
  {
    keys: ['?'],
    description: 'Show Keyboard Shortcuts Guide',
    category: 'Modals & Search',
    actionName: 'Shortcuts Cheat Sheet'
  },
  {
    keys: ['Alt', '1'],
    description: 'Go to Explore / Home',
    category: 'Navigation',
    actionName: 'Explore'
  },
  {
    keys: ['Alt', '2'],
    description: 'Go to Freelancers Directory',
    category: 'Navigation',
    actionName: 'Freelancers'
  },
  {
    keys: ['Alt', '3'],
    description: 'Go to Services Catalog',
    category: 'Navigation',
    actionName: 'Services'
  },
  {
    keys: ['Alt', '4'],
    description: 'Go to Workstation & Escrow Milestones',
    category: 'Navigation',
    actionName: 'Workstation'
  },
  {
    keys: ['Alt', '5'],
    description: 'Go to Messages & Secure Chat',
    category: 'Navigation',
    actionName: 'Messages'
  },
  {
    keys: ['Alt', '6'],
    description: 'Go to Client / Freelancer Dashboard',
    category: 'Navigation',
    actionName: 'Dashboard'
  },
  {
    keys: ['Alt', '7'],
    description: 'Go to Escrow Playbook & Security Guide',
    category: 'Navigation',
    actionName: 'Security Playbook'
  }
];

export const useGlobalKeyShortcuts = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    isPostJobModalOpen,
    setIsPostJobModalOpen,
    isHireModalOpen,
    setIsHireModalOpen,
    isServiceModalOpen,
    setIsServiceModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
    isProposalModalOpen,
    setIsProposalModalOpen,
    isCreateGigModalOpen,
    setIsCreateGigModalOpen,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    closeAllModals,
    isAnyModalOpen,
    setActivePage,
    user,
    showToast
  } = useGuide();

  const { cycleTheme } = useTheme();

  const isInputElement = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    const tagName = target.tagName.toUpperCase();
    return (
      tagName === 'INPUT' ||
      tagName === 'TEXTAREA' ||
      tagName === 'SELECT' ||
      target.isContentEditable ||
      target.getAttribute('role') === 'textbox'
    );
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isInput = isInputElement(e.target);
      const isMetaOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key;

      // 1. GLOBAL CMD/CTRL + K: Toggle Search Modal (works anywhere, even in inputs)
      if (isMetaOrCtrl && (key === 'k' || key === 'K')) {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
        return;
      }

      // 2. ESCAPE: Close active modals or unfocus active inputs
      if (key === 'Escape') {
        if (isAnyModalOpen) {
          e.preventDefault();
          closeAllModals();
          return;
        }
        if (isInput && e.target instanceof HTMLElement) {
          e.target.blur();
          return;
        }
      }

      // 3. CMD/CTRL + J or Alt + N: Post Job / Create Gig
      if (
        (isMetaOrCtrl && (key === 'j' || key === 'J')) ||
        (e.altKey && (key === 'n' || key === 'N'))
      ) {
        e.preventDefault();
        if (user?.userType === 'freelancer') {
          setIsCreateGigModalOpen(true);
        } else {
          setIsPostJobModalOpen(true);
        }
        return;
      }

      // 4. CMD/CTRL + / or ? (Shift + /): Open Keyboard Shortcuts Guide
      if ((isMetaOrCtrl && key === '/') || (!isInput && key === '?')) {
        e.preventDefault();
        setIsShortcutsModalOpen(!isShortcutsModalOpen);
        return;
      }

      // 5. Alt + T or CMD + Shift + T: Cycle Theme
      if ((e.altKey && (key === 't' || key === 'T')) || (isMetaOrCtrl && e.shiftKey && (key === 't' || key === 'T'))) {
        e.preventDefault();
        cycleTheme();
        return;
      }

      // 6. Quick Search with '/' (only when NOT in input field)
      if (!isInput && !isMetaOrCtrl && !e.altKey && key === '/') {
        e.preventDefault();
        setIsSearchModalOpen(true);
        return;
      }

      // 7. Fast Alt + Number Navigation (Alt+1 to Alt+7)
      if (e.altKey && !isMetaOrCtrl) {
        const pageMap: Record<string, TalentioPage> = {
          '1': 'explore',
          '2': 'freelancers',
          '3': 'services',
          '4': 'workstation',
          '5': 'chat',
          '6': 'dashboard',
          '7': 'playbook'
        };

        if (pageMap[key]) {
          e.preventDefault();
          setActivePage(pageMap[key]);
          showToast(`Navigated to ${pageMap[key].toUpperCase()}`, 'info');
          return;
        }
      }
    },
    [
      isSearchModalOpen,
      setIsSearchModalOpen,
      isAnyModalOpen,
      closeAllModals,
      user,
      setIsCreateGigModalOpen,
      setIsPostJobModalOpen,
      isShortcutsModalOpen,
      setIsShortcutsModalOpen,
      cycleTheme,
      setActivePage,
      showToast
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    shortcuts: SHORTCUTS_REGISTRY,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen
  };
};
