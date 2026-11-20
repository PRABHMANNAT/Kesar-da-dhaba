// Keep press feedback visible briefly when an order link opens in a new tab.
document.querySelectorAll('.menu-delivery-card').forEach(link => {
  let release;
  const resetPress = () => {
    clearTimeout(release);
    link.classList.remove('is-pressed');
  };
  const showPress = () => {
    clearTimeout(release);
    link.classList.add('is-pressed');
  };
  const releasePress = () => {
    release = setTimeout(resetPress, 350);
  };

  link.addEventListener('pointerdown', showPress, { passive: true });
  link.addEventListener('pointerup', releasePress, { passive: true });
  link.addEventListener('pointercancel', resetPress, { passive: true });
  link.addEventListener('blur', resetPress);
  link.addEventListener('click', () => {
    showPress();
    releasePress();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetPress();
  });
});
