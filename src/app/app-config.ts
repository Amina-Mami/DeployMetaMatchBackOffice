import { CoreConfig } from "@core/types";

export const coreConfig: CoreConfig = {
  app: {
    appName: 'Metamatch', // App Name from the second version
    appTitle: 'Metamatch', // App Title from the second version
    appLogoImage: 'assets/images/logo/logo1.png', // App Logo from the second version

    appLanguage: 'en', // Default language setting from the first version
  },
  layout: {
    skin: 'default', // Default layout settings from the first version
    type: 'vertical', // Default layout type from the first version
    animation: 'fadeIn', // Default animation from the first version

    menu: {
      hidden: false, // Default menu settings from the first version
      collapsed: false, // Default menu settings from the first version
    },
    navbar: {
      hidden: false, // Default navbar settings from the first version
      type: 'floating-nav', // Default navbar type from the first version
      background: 'navbar-light', // Default navbar background from the first version
      customBackgroundColor: true, // Custom background color setting from the first version
      backgroundColor: '', // Background color from the first version
    },
    footer: {
      hidden: false, // Default footer settings from the first version
      type: 'footer-static', // Default footer type from the first version
      background: 'footer-light', // Default footer background from the first version
      customBackgroundColor: false, // Custom background color setting from the first version
      backgroundColor: '', // Background color from the first version
    },
    enableLocalStorage: true, // Local storage setting from the first version
    customizer: true, // Theme customizer setting from the first version
    scrollTop: true, // Scroll to top button setting from the first version
    buyNow: false // Buy now setting from the first version, for demo purposes
  }
}
