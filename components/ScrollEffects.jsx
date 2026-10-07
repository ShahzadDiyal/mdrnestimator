'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Replicates the original vanilla-JS scroll behaviours:
 *  - reveal-on-scroll (.reveal -> .in)
 *  - animated stat counters (.counter[data-target])
 *  - hero estimate-card bar fills (.bar-fill[data-width])
 * Renders nothing; runs once after mount.
 */
export default function ScrollEffects() {
  const pathname = usePathname();

  // Mark that JS is ready — CSS uses .js-ready to gate the opacity:0
  // so content is always visible if JS fails.
  useEffect(() => {
    document.documentElement.classList.add('js-ready');
  }, []);

  useEffect(() => {
    // Re-runs on every route change so freshly navigated content animates too.
    let io;
    let co;
    let barTimer;
    let mo;

    const raf = requestAnimationFrame(() => {
      const revealNow = (el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in');
          return true;
        }
        return false;
      };

      // Observe hidden elements for scroll-triggered reveal.
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.05 }
      );

      const watchReveals = (root) => {
        root.querySelectorAll('.reveal:not(.in):not([data-reveal-self])').forEach((el) => {
          if (!revealNow(el)) io.observe(el);
        });
      };

      // Elements present at load.
      watchReveals(document);

      // Elements added later (API-loaded sections): without this they would
      // stay at opacity:0 forever because the one-time query above missed them.
      mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            if (node.matches('.reveal:not(.in):not([data-reveal-self])')) {
              if (!revealNow(node)) io.observe(node);
            }
            const nested = node.querySelectorAll('.reveal:not(.in):not([data-reveal-self])');
            nested.forEach((el) => {
              if (!revealNow(el)) io.observe(el);
            });
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });

      // Counters
      const counters = document.querySelectorAll('.counter');
      co = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.target;
            const duration = 1600;
            const start = performance.now();
            const tick = (now) => {
              const t = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              el.textContent = Math.round(target * eased).toLocaleString();
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            co.unobserve(el);
          });
        },
        { threshold: 0.05 }
      );
      counters.forEach((c) => co.observe(c));

      // Hero estimate card bars
      barTimer = setTimeout(() => {
        document.querySelectorAll('.bar-fill').forEach((el, i) => {
          setTimeout(() => {
            el.style.width = el.dataset.width + '%';
          }, i * 150);
        });
      }, 400);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (co) co.disconnect();
      if (mo) mo.disconnect();
      if (barTimer) clearTimeout(barTimer);
    };
  }, [pathname]);

  return null;
}
