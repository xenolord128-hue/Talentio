import React from 'react';
import { useGuide, getPathFromPage, TalentioPage } from '../context/GuideContext';

export interface TalentioLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: TalentioPage;
  search?: string;
  hash?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}

export const TalentioLink: React.FC<TalentioLinkProps> = ({
  to,
  href,
  search,
  hash,
  onClick,
  children,
  ...props
}) => {
  const { setActivePage } = useGuide();

  const targetPath = to ? getPathFromPage(to) : (href || '/');
  const queryPart = search ? (search.startsWith('?') ? search : `?${search}`) : '';
  const hashPart = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
  const fullHref = `${targetPath}${queryPart}${hashPart}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (!e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
      e.preventDefault();
      if (to) {
        setActivePage(to, { search, hash });
      } else if (href) {
        if (href.startsWith('#')) {
          const elem = document.querySelector(href);
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
            try {
              window.history.pushState(null, '', href);
            } catch (err) {}
          }
        } else if (href.startsWith('/')) {
          try {
            window.history.pushState(null, '', fullHref);
            window.dispatchEvent(new PopStateEvent('popstate'));
          } catch (err) {}
        }
      }
    }
  };

  return (
    <a href={fullHref} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
