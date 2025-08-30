declare module "js-cookie" {
  export interface CookieAttributes {
    /**
     * Define when the cookie will be removed. Value can be a Number
     * which will be interpreted as days from time of creation or a
     * Date instance. If omitted, the cookie becomes a session cookie.
     */
    expires?: number | Date | undefined;

    /**
     * Define the path where the cookie is available. Defaults to '/'
     */
    path?: string | undefined;

    /**
     * Define the domain where the cookie is available. Defaults to
     * the domain of the page where the cookie was created.
     */
    domain?: string | undefined;

    /**
     * A Boolean indicating if the cookie transmission requires a
     * secure protocol (https). Defaults to false.
     */
    secure?: boolean | undefined;

    /**
     * Asserts that a cookie must not be sent with cross-origin requests,
     * providing some protection against cross-site request forgery
     * attacks (CSRF)
     */
    sameSite?: 'strict' | 'Strict' | 'lax' | 'Lax' | 'none' | 'None' | undefined;

    /**
     * An attribute which will be serialized, conformably to RFC 6265
     * section 5.2.
     */
    [property: string]: any;
  }

  export interface CookiesStatic {
    /**
     * Allows default cookie attributes to be accessed, changed, or reset
     */
    defaults: CookieAttributes;

    /**
     * Create a cookie
     */
    set(name: string, value: string | object, options?: CookieAttributes): string | undefined;

    /**
     * Read a cookie. If the cookie doesn't exist, return undefined.
     */
    get(name: string): string | undefined;

    /**
     * Read a cookie with decoding. If the cookie doesn't exist, return undefined.
     */
    getJSON(name: string): any;

    /**
     * Remove a cookie
     */
    remove(name: string, options?: CookieAttributes): void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}