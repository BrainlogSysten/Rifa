import React, { useEffect } from 'react';
import { RaffleTheme } from '../constants/themes';

interface ThemedRafflePageProps {
  theme: RaffleTheme;
  children: React.ReactNode;
}

const ThemedRafflePage: React.FC<ThemedRafflePageProps> = ({ theme, children }) => {
  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--raffle-primary', theme.primaryColor);
    root.style.setProperty('--raffle-secondary', theme.secondaryColor);
    root.style.setProperty('--raffle-accent', theme.accentColor);
    root.style.setProperty('--raffle-bg', theme.backgroundColor);
    root.style.setProperty('--raffle-text', theme.textColor);
    root.style.setProperty('--raffle-font', theme.fontFamily);

    if (theme.backgroundImage) {
      root.style.setProperty('--raffle-bg-image', theme.backgroundImage);
    }

    const fontLink = document.getElementById('raffle-font');
    if (fontLink) {
      fontLink.remove();
    }

    const newFontLink = document.createElement('link');
    newFontLink.id = 'raffle-font';
    newFontLink.href = `https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(' ', '+')}&display=swap`;
    newFontLink.rel = 'stylesheet';
    document.head.appendChild(newFontLink);

    return () => {
      root.style.removeProperty('--raffle-primary');
      root.style.removeProperty('--raffle-secondary');
      root.style.removeProperty('--raffle-accent');
      root.style.removeProperty('--raffle-bg');
      root.style.removeProperty('--raffle-text');
      root.style.removeProperty('--raffle-font');
      root.style.removeProperty('--raffle-bg-image');
    };
  }, [theme]);

  const containerStyle: React.CSSProperties = {
    background: theme.backgroundImage || theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    minHeight: '100vh'
  };

  return (
    <div style={containerStyle} className="themed-raffle-container">
      {theme.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: theme.customCSS }} />
      )}
      {children}
    </div>
  );
};

export default ThemedRafflePage;