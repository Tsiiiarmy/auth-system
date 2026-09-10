export function navigateWithTransition(navigate, to, options = {}) {
  navigate(to, {
    ...options,
    viewTransition: true,
  });
}