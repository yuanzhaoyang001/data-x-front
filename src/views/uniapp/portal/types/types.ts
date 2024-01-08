export enum MobileComType {
  BANNER = "BANNER",
  NAV = "NAV",
  TABBAR = "TABBAR"
}

export interface Banner {
  name: "";
  url: "";
  type: "";
  addressUrl: "";
  appId: "";
}

export interface Nav {
  name: "";
  imgUrl: "";
  type: "";
  addressUrl: "";
  appId: "";
}

export interface Tabbar {
  id: string;
}

export interface PortalConfig {
  bannerList: Banner[];
  navList: Nav[];
  tabBarList: Tabbar[];
}
