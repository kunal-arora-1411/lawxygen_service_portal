declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export const initializeFacebook = () => {
  return new Promise<void>((resolve) => {
    if (window.FB) {
      resolve();
      return;
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v24.0",
      });

      resolve();
    };

    const script = document.createElement("script");

    script.id = "facebook-jssdk";
    script.src =
      "https://connect.facebook.net/en_US/sdk.js";

    document.body.appendChild(script);
  });
};