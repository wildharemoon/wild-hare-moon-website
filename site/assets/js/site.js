document.getElementById('year').textContent = new Date().getFullYear();

gsap.registerPlugin(ScrollTrigger);

// Hero content is already in view on load, so it gets a simple staggered
// fade-in rather than a ScrollTrigger (which can get stuck mid-progress
// for elements whose trigger point is already past on initial layout).
gsap.to('#hero-mark, #hero-tagline, #hero-cta', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out',
  stagger: 0.15,
  delay: 0.1,
});

document.querySelectorAll('section .reveal').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
  });
});
