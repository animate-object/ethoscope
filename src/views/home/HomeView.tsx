import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listSchemas } from '@/lib/schema/repository';
import { ROUTES } from '@/routes';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import styles from './HomeView.module.css';

type NavItemProps = {
  title: string;
  description: string;
  onClick: () => void;
};

function NavItem({ title, description, onClick }: NavItemProps) {
  return (
    <button className={styles.navItem} onClick={onClick}>
      <p className={styles.navItemTitle}>{title}</p>
      <p className={styles.navItemDescription}>{description}</p>
    </button>
  );
}

export function HomeView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hasSchemas, setHasSchemas] = useState(false);
  const { showInstallButton, install } = usePWAInstall();

  useEffect(() => {
    setHasSchemas(listSchemas().length > 0);
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>{t('home.title')}</h1>

      {hasSchemas ? (
        <NavItem
          title={t('home.nav.viewBehaviorSchemas')}
          description={t('home.nav.viewBehaviorSchemasDescription')}
          onClick={() => navigate(ROUTES.behaviorSchemas)}
        />
      ) : (
        <NavItem
          title={t('home.nav.newBehaviorSchema')}
          description={t('home.nav.newBehaviorSchemaDescription')}
          onClick={() => navigate(ROUTES.behaviorSchema)}
        />
      )}
      <NavItem
        title={t('home.nav.startObservation')}
        description={t('home.nav.startObservationDescription')}
        onClick={() => navigate(ROUTES.observationNew)}
      />
      <NavItem
        title={t('home.nav.analyzeSessions')}
        description={t('home.nav.analyzeSessionsDescription')}
        onClick={() => navigate(ROUTES.analysis)}
      />
      {showInstallButton && (
        <NavItem
          title={t('home.nav.installApp')}
          description={t('home.nav.installAppDescription')}
          onClick={install}
        />
      )}
    </main>
  );
}
