import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Had this file been part of a PR, I wouldn't have requested any changes
// however, going to use this file as an opportunity to showcase some principles of software engineering.
// Don't feel the need to apply any of these suggestions to this file, just some food for thought and potential areas to explore.

// The main point I wanted to convey is regarding the importance of readable code over use of comments.


// Point of study:
// * OOP + SOLID principles
// * Encapsulation
// Note: if you didn't want OOP style, you could also just have a few pure functions exposed via another file
// (Pure functions are functions that given the same input, will always return the same output, and have no side effects. They are easier to test and reason about, and can be used in functional programming paradigms.)
class RouteConfig {
  private authPaths = ['/login', '/signup'];
  private publicPaths = ['/login', '/signup', '/invoice'];
  private homePath = '/';
  private onboardingPath = '/onboarding';

  isRoutePublic(pathname: string) {
    return this.publicPaths.some((publicPath) => pathname.startsWith(publicPath));
  }
  isRouteAuthOnly(pathname: string) {
    return this.authPaths.some((authPath) => pathname.startsWith(authPath));
  }
  isHomePath(pathname: string) {
    return pathname === this.homePath;
  }
  isOnboardingPath(pathname: string) {
    return pathname === this.onboardingPath;
  }
  isAnonymousOnlyPath(pathname: string) {
    return this.isHomePath(pathname) || this.isRouteAuthOnly(pathname);
  }
  canAccessAnonymously(pathname: string) {
    return this.isRoutePublic(pathname) || this.isHomePath(pathname);
  }
  // JSDoc gives IDEs better hints, and also serves as documentation for other developers (or yourself in the future) to understand the code better without having to read through and understand the implementation.
  // JSDoc is particularly useful if you are producing open source libraries, they can generate documentation from JSDoc comments, and users of the library can get better autocompletion hints in their IDEs.
  // IMHO don't worry about putting jsdoc everywhere in your code, just in places where the code might be re-used by other devs, or in library code shared among many projects
  /**
   * Check if the route requires verification of onboarding status. This is true for any non public route that is not the onboarding path itself.
   * @param pathname the url route of the incoming request
   * @returns true if the route requires verification of onboarding status, false otherwise
   */
  requiresOnboardingCheck(pathname: string) {
    return !this.isRoutePublic(pathname) && !this.isOnboardingPath(pathname);
  }
}

export async function middleware(request: NextRequest) {
  let middlewareResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          middlewareResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            middlewareResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // many ways to do route based authentication, but following this centralised registry approach
  // generally makes sense if more routes require auth than not.
  // Another approach (not sure how easy this would be in nextjs) is to use declarative approach
  // where each endpoint defines whether it is authenticated.
  // Another approach is convention over configuration, where all public paths are placed under one (or a few) route prefix, and private paths under another so
  // auth happens by convention of where the file is placed.
  // Note that convention over configuration is not a rule to apply everywhere.
  // Each new convention adds cognitive overhead, requiring developers to learn and remember it.
  // A good example of this is nextjs's file based routing.
  // Conventions should ideally be obvious and intuitive - another example is the public folder at the root of this repo
  // where any file placed there is automatically served statically, this is a common convention in web development and thus easy to understand and remember.
  // https://en.wikipedia.org/wiki/Convention_over_configuration
  const routeConfig = new RouteConfig();
  const loggedIn = !!user?.id;
  const canAccessAnonymously = routeConfig.canAccessAnonymously(pathname);
  const requiresOnboardingCheck = routeConfig.requiresOnboardingCheck(pathname);

  // DRY
  // https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
  // My general rule is twice is fine, 3 times consider refactoring
  const redirectToPath = (path: string): NextResponse<unknown> => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  const fetchSettings = async (userId: string) =>
    supabase
      .from('settings')
      .select('user_id')
      .eq('user_id', userId)
      .single();

  if (!loggedIn) {
    return canAccessAnonymously ? middlewareResponse : redirectToPath('/login');
  }

  const userId = user!.id;

  if (routeConfig.isAnonymousOnlyPath(pathname)) {
    return redirectToPath('/overview');
  }

  if (requiresOnboardingCheck || routeConfig.isOnboardingPath(pathname)) {
    const { data: settings } = await fetchSettings(userId);
    const userIsOnboarded = !!settings;

    if (requiresOnboardingCheck && !userIsOnboarded) {
      return redirectToPath('/onboarding');
    }

    if (routeConfig.isOnboardingPath(pathname) && userIsOnboarded) {
      return redirectToPath('/overview');
    }
  }

  return middlewareResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
