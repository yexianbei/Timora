// Cloudflare Pages Functions middleware for SPA routing
// This handles all routes and serves index.html for client-side routing

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Don't interfere with static assets, API routes, or files with extensions
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/_') ||
    pathname.includes('.') ||
    pathname === '/index.html'
  ) {
    return next();
  }
  
  // For all other routes (SPA routes), serve index.html
  // This allows React Router to handle client-side routing
  const response = await next();
  
  // If the response is 404, rewrite to index.html
  if (response.status === 404) {
    const indexUrl = new URL('/index.html', request.url);
    return fetch(indexUrl);
  }
  
  return response;
};

