import { useEffect, useState } from 'react';

/**
 * Composant pour empêcher le rendu côté serveur et éviter les problèmes d'hydratation
 */
export default function NoSSR({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback;
  }

  return children;
}

/**
 * HOC pour wrapper un composant avec NoSSR
 */
export function withNoSSR(Component, fallback) {
  return function WrappedComponent(props) {
    return (
      <NoSSR fallback={fallback}>
        <Component {...props} />
      </NoSSR>
    );
  };
}