/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
// Composables
import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";
import { VDataTableServer, VDatePicker } from "vuetify/labs/components";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

const Lighttheme: ThemeDefinition = {
  dark: false,
  variables: {
    "high-emphasis-opacity": 1,
  },
  colors: {
    background: "#f2f5f8",
    surface: "#ffffff",
    primary: "#3C7AB7",
    secondary: "#081419",
    accent: "#705CF6",
    error: "#ef476f",
    info: "#2196F3",
    success: "#43A047",
    "on-success": "#ffffff",
    warning: "#ffd166",
    "dark-blue": "#28637F",
  },
};

const Darktheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#111b27",
    surface: "#1E293B",
    primary: "#705CF6",
    secondary: "#598EF3",
    accent: "#705CF6",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
  },
};

export default createVuetify({
  components: {
    VDataTableServer,
    VDatePicker,
  },
  theme: {
    themes: {
      light: Lighttheme,
      dark: Darktheme,
    },
  },
  defaults: {
    VBtn: {
      rounded: "md",
      fontWeight: "400",
      letterSpacing: "0",
    },
    VCard: {},
    VSheet: {
      elevation: 1,
    },
    VTable: {
      elevation: 1,
    },

    VDataTable: {
      fixedHeader: true,
      noDataText: "Results not found",
    },
    VTextField: {
      variant: "solo",
    },
    VSelect: {
      variant: "solo",
    },
  },
});
