import { ref } from "vue";
import { PortalConfig } from "@/views/uniapp/portal/types/types";

export function usePortalConfigStore() {
  const portalConfig = ref<PortalConfig>({
    navList: [],
    tabBarList: [],
    bannerList: []
  });

  return {
    portalConfig
  };
}

export const portalConfigStore = usePortalConfigStore();
