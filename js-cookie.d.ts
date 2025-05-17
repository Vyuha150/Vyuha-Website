declare module "js-cookie" {
  const Cookies: {
    get: (name: string) => string | undefined;
    set: (
      name: string,
      value: string,
      options?: { path?: string; expires?: number }
    ) => void;
    remove: (name: string, options?: { path?: string }) => void;
  };
  export default Cookies;
}
