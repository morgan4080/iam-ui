import { Notification } from "@/types";
import { ref } from "vue";

export const useNotification = () => {
  const notification = ref();

  async function toggleNotification(payload: Notification) {
    notification.value = payload;
    // setTimeout(async () => await resetNotification(), 10000);
  }

  async function resetNotification() {
    notification.value = {
      message: null,
      success: false,
      warning: false,
      error: false,
    };
  }

  return { notification, toggleNotification, resetNotification };
};
