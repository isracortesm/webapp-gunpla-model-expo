'use client';
import '@/components/ui/PageHeader.css';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  position?: 'fixed' | 'static';
}

export default function PageHeader({ title, onBack, rightAction, position = 'fixed' }: PageHeaderProps) {
  return (
    <div className={`page-header ${position === 'static' ? 'page-header--static' : ''}`}>
      <div className="page-header__side">
        {onBack && (
          <button onClick={onBack} className="page-header__back-btn">
            ← Volver
          </button>
        )}
      </div>
      <h1 className="page-header__title">{title}</h1>
      <div className="page-header__side page-header__side--right">
        {rightAction}
      </div>
    </div>
  );
}
