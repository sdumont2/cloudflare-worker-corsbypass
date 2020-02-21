const allowedMethodsArr = [ "GET", "HEAD"];
const allowMethods = 'GET, HEAD, OPTIONS';
// We support the GET, HEAD, and OPTIONS methods from any origin,
// and accept the Content-Type header on requests. These headers must be
// present on all responses to all CORS requests. In practice, this means
// all responses to OPTIONS requests.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': allowMethods,
  'Access-Control-Allow-Headers': 'Content-Type',
};
// The endpoint you want the CORS reverse proxy to be on
const proxyEndpoint = '/proxy';

addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.pathname.startsWith(proxyEndpoint)) {
    if (request.method === 'OPTIONS') {//Options is separate because it's preflight
      // Handle CORS preflight requests
      event.respondWith(handleOptions(request));
    } else if (allowedMethodsArr.includes(request.method)) {
      // Handle requests to the API server
      event.respondWith(handleRequest(request));
    } else {
      //Not on our method list. Shouldn't be using it
      event.respondWith(async () => {
        return new Response(null, {
          status: 405,
          statusText: 'Method Not Allowed',
        });
      });
    }
  } else {
    // Serve ysbh page.
    event.respondWith(rawHtmlResponse(goAwayPage));
  }
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const apiUrl = url.searchParams.get('apiurl');
  // Rewrite request to point to API url. This also makes the request mutable
  // so we can add the correct Origin header to make the API server think
  // that this request isn't cross-site.
  request = new Request(apiUrl, request);
  request.headers.set('Origin', new URL(apiUrl).origin);
  let response = await fetch(request);
  // Recreate the response so we can modify the headers
  response = new Response(response.body, response);
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', "*");
  response.headers.set('Content-Type', 'text/plain');
  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append('Vary', 'Origin');
  return response;
}

function handleOptions(request) {
  // Make sure the necesssary headers are present
  // for this to be a valid pre-flight request
  if ( request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null ) {
    // Handle CORS pre-flight request.
    // If you want to check the requested method + headers
    // you can do that here.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: allowMethods,
      },
    });
  }
}

// The rest of this is for the page
async function rawHtmlResponse(html) {
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}
const goAwayPage = `
<!DOCTYPE html>
<html>
<body>
  This isn't yours. You shouldn't be here.
</body>
</html>`