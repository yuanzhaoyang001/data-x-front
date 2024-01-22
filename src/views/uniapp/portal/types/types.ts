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
  /**
   * pagePath: "/pages/index/index",
   *     iconPath:
   *       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAANmSURBVGiB7Zmxb9NAFMa/ZydDW4Q8IYSQSGFhQWr/goKQOoeNsZ0YIaK1lQl3IfK5yKydKH9B0xF1oEyMrYTYPSBVYgoIdWjiewy5tKlxbCc5pwHyk6KLz8939+ndF99dgBkzZqRBRTYuhFgCsAfAYuZ1x3GaRfVlFNWw53kugCMAFQAWEe2pukIoJCO+7wfM/EJdtlRpqbJZLpfXa7VaK+HRkdEqpNFoVEzT/IhuFgAgjKLokWmaFrpT7FJ9vV4PdfWtbWoJIZb6RRDRYW+wtm0fl8vlZSI6VOEV0zSPPM+r6upfS0Y8z3OJ6FXvmpm3HMdxk2Jj0y41dhjGFhL3AxFtbW5uvk17RgixBiCARt+MLGSQH/LO+76f5pGejzOSR9L8kLcN3b4ZOiPD+CEvOnwzlJBR/JCXcX2TS8i4fsjLOL7J9EjcDwCaRYgAxvNNakaK8ENehu17oJCE9VLNtu1dXQPNwzC++UNIgh9gGMbuxsbGejHDTWd7e/udlHKtryrRN5c8kuCHaSTRN+dCYvsHMPMWgHBy48skVGMCEvY3BtDNRJ+xWkRUm5Sph8FxHJeZn0DtcYjoVS8zBgBEUdRSN8MoipZ1veSKwHGcZhRFy+jOllBKeQwAJQCo1+thEASLundtRaGMvthfd+6Rv0XEIAo7fJg0MyHTRkl3g41Go2IYRpWIVojI6r/HzC1m/iSlbOpedGrNiO/7D03T/EhEAYAqMz/s/wCoElFgmuaR7/vPdPatLSNBEFjtdnsPFwu8rwBkLGwBwF10j1DfCCF+np6e7ruuezpu/9qEnJ2drfWmknr7fiOim/E4Zn5ARK/RFfV0YWEhBPB53P61TS0iWlFfjx3HaSaJUHFfAHxRl4tEdH1nZ6c8bv86hViqbLmuO58R/l2VN6SU5ZOTk+kRctXMhEwbMyHTxn8jpAUAUkorI+7KyRISqnIpCIKJiwmCwJJSdvfkhnGYFpu1RNkHUAVQ6XQ6e0KI94MCmbn3Jr89Nzf3kpnvpbR7h4gAYI6ZH8/Pz98SQpzF2rPa7fZzqLWblPJT2kAzD7HjR/5XxK5t26kHhGZWCwcHBx9WV1d/ALiPi5XtpDgmIs+27XpW4FD/jyifDBTT6XSuGYZxLU9bUspfpVLpV0pI628/EJnxT/AbuGLMIIW1rrMAAAAASUVORK5CYII=",
   *     text: "首页"
   */
  pagePath: string;
  iconPath: string;
  text: string;
}

export interface PortalConfig {
  bannerList: Banner[];
  navList: Nav[];
  tabBarList: Tabbar[];
}
