import { ref, watch } from "vue";
import { PortalConfig } from "@/views/uniapp/portal/types/types";
import { useRoute } from "vue-router";
import { watchDebounced } from "@vueuse/core";
import { updatePortal } from "@/api/uniapp/portal";

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

export const allTabBarList = [
  {
    pagePath: "/pages/index/index",
    iconPath:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAANmSURBVGiB7Zmxb9NAFMa/ZydDW4Q8IYSQSGFhQWr/goKQOoeNsZ0YIaK1lQl3IfK5yKydKH9B0xF1oEyMrYTYPSBVYgoIdWjiewy5tKlxbCc5pwHyk6KLz8939+ndF99dgBkzZqRBRTYuhFgCsAfAYuZ1x3GaRfVlFNWw53kugCMAFQAWEe2pukIoJCO+7wfM/EJdtlRpqbJZLpfXa7VaK+HRkdEqpNFoVEzT/IhuFgAgjKLokWmaFrpT7FJ9vV4PdfWtbWoJIZb6RRDRYW+wtm0fl8vlZSI6VOEV0zSPPM+r6upfS0Y8z3OJ6FXvmpm3HMdxk2Jj0y41dhjGFhL3AxFtbW5uvk17RgixBiCARt+MLGSQH/LO+76f5pGejzOSR9L8kLcN3b4ZOiPD+CEvOnwzlJBR/JCXcX2TS8i4fsjLOL7J9EjcDwCaRYgAxvNNakaK8ENehu17oJCE9VLNtu1dXQPNwzC++UNIgh9gGMbuxsbGejHDTWd7e/udlHKtryrRN5c8kuCHaSTRN+dCYvsHMPMWgHBy48skVGMCEvY3BtDNRJ+xWkRUm5Sph8FxHJeZn0DtcYjoVS8zBgBEUdRSN8MoipZ1veSKwHGcZhRFy+jOllBKeQwAJQCo1+thEASLundtRaGMvthfd+6Rv0XEIAo7fJg0MyHTRkl3g41Go2IYRpWIVojI6r/HzC1m/iSlbOpedGrNiO/7D03T/EhEAYAqMz/s/wCoElFgmuaR7/vPdPatLSNBEFjtdnsPFwu8rwBkLGwBwF10j1DfCCF+np6e7ruuezpu/9qEnJ2drfWmknr7fiOim/E4Zn5ARK/RFfV0YWEhBPB53P61TS0iWlFfjx3HaSaJUHFfAHxRl4tEdH1nZ6c8bv86hViqbLmuO58R/l2VN6SU5ZOTk+kRctXMhEwbMyHTxn8jpAUAUkorI+7KyRISqnIpCIKJiwmCwJJSdvfkhnGYFpu1RNkHUAVQ6XQ6e0KI94MCmbn3Jr89Nzf3kpnvpbR7h4gAYI6ZH8/Pz98SQpzF2rPa7fZzqLWblPJT2kAzD7HjR/5XxK5t26kHhGZWCwcHBx9WV1d/ALiPi5XtpDgmIs+27XpW4FD/jyifDBTT6XSuGYZxLU9bUspfpVLpV0pI628/EJnxT/AbuGLMIIW1rrMAAAAASUVORK5CYII=",
    text: "首页"
  },
  {
    pagePath: "/pages/home/index",
    iconPath:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAYAAACoYAD2AAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAOpSURBVFiF7VgxcqRGFH2/AZXDuYHxCRafYJlAseQTeBQ6kgiYKaKVIgo6YDd0JPkEWmd2SVXCJ/Aoc7ZstuHkTPMdTCP1omGBGaZqA72IbrofD7r5//UnGJBS+lVVeZZlvUEHlFKPQohlGIZ511gTcRy7lmVlADwAEyJaMvMf8/n8pm0OAUCWZZOyLK8BnA55oMaNUuoqiqKia6CU8oKZ3wGYbONxHCcIgmDVvCEAoCzLf3cUCAAz27avuwYlSXLJzFmLQACYlWX5kGXZi/uk3y7T7SURBbZtF10PXa/XLjNfA3B111nbkiVJcklE77o4aw2O40zNL2oDONHXK6XUL32WTaOI43hqWdYn3T4B8ELkQIEA4Okv+iRUMLMHAES0HCAQAKDH13O8EQQ2hU6AzZ5s2yO9QETFtv40TWc7CqzhrdfrW0D/OGMjjmMXwD4CAQDM7EspLw4iUghxiucfal+cHErkj2NxMbN3EJEjoziISGZ+HJHuMCJ1UF+OwaWUCg653GcAXuThIWDmqyiKCgEdjJl5p3jJzK6+/ErQfD5fApg2+4cIXCwWl8AmTtbL4kkp/SFEUsoLPIeaF8u7q1BTILAxGD4zPxhjbgD804PrLYBZ3VBK/dSWVtM09QA8oEd2awoEtJ+UUmbMfNFDWG/iXYS28VB9oS3bOYZlihUzny0Wi499BmtX/rDlGSsiugrD8P22edTsSNPUY2aXiL65NI7j5EEQFH3ENZEkyakQ4i0RTZRSj1VVfRzqwF6xC8w96RPRr1VV+T3nrgAUSqngW0ulo8c5NqbY7eIkoiWAP839ScBeDnpDQhRs2/R7Ro1CKTWNoqjYFieLNrdtQmca1+j6WQfvWqB5wBvC69fXRJSHYTi1YTjoti/SBnMFhBDn2OTr+mHnBu+0bxFBh6lbAJ525r55EMuHCAQAHXgLADD3sg7crm7eDKlyRFFUEFFQt6uq8g5yEGvE2D4p9ivYtv20bSzLevNdOvNmqeW7FNnEq8ix8CpyLLyKHAsC+pC0x2mxnvdc9DSKsETUWX9vQmcsAIBS6rMAkOu2lyTJoJK0Pi3WhE/CtGOvX36mq2y9oGuST35CCJHbRPSBmU8BgIhupZR5G4EJZp7UeR/YVBrM+0R0VdfILcv6JKXMu1xQVVWTsix96FSt/UQ+ip9sO+WN5SctALi/v8+Pj48/a2MwAfBDD5IVgL+I6Le2gv7d3d3fA3lXAP5j5t+Pjo7OwjD8AgD/A2xB6kKEdJ1vAAAAAElFTkSuQmCC",
    text: "工作台"
  },
  {
    pagePath: "/pages/form/index",
    iconPath:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAKnSURBVGiB7ZpNdtowFIXfsxzG3kHpCkJXELKD7KBkBcUD4GTkMvLBGjhdQZMV0K4AZwd0BXV3wBjZvp3ktMZIBAUTXOpvJvlivYslvecfopaWo8C7DkophwCuiKhPRN6bRLTNkojSPM/9u7u71CTSGonj2MuybA6gf6TgXgWA6WQy+aw75ug6sywLmmaCiIiZAyllX3fMrXaEYdgFMCx1pQC+MPPqWAG+wBUR3dDfqR0QUVIVbRlxHKdXbud5fr1rbr4BD7PZ7BczB0REAHpxHHu+72/8sVtTi5k3FvWJTRARkeM4SanpkWbj0a6Rf5GzMbK1Rl4ijmNPKXUDYDWZTL7to2XmdDQaJXVpdVhdkTAMu0qpn0T0lZnnUsrFPloAiyiK5nVoTVgZcV33E5UWGoC+aV8XQgS0uShvoijqHao1YWWkuqMRERVFoS1dHGf71Lrf22pNWBkB8FjpSjudTrKPFsDUNPdttCasjIxGoyTP8/fMfM/M9xcXFx+qicmgvTbVSLZaE9a71nOC9E+p1XE2eaQ10jRaI03DateK49hbr9dDIcS7ugIoiuJpPB4/HHoeKyNZlgXMPCyK4tBxywyklK8qFMv8n1PLdd2pUspj5m4dgwNYMfPToVeDyNLIczlye+igx+BsplZrpGm0RprGazL7QAhxeayAAKwA/LDN9lZG1uv1kJmDmjO7liiKluPxeLmv3mpq1VljvYTtwwerK6KUmgohqK7MvoPvttneysjzfXWb2Y9Ja6RpnK8RABtPDsMw7L5ZNAYAbMTg+35a1WztWp1OZ6mU+tMWQixms9nJXoYy8yWAQamdaHW6TillXHmz2yRudeWLdo24rjs1OT8lAKamGmznJxxRFA2Y+SOAHp3uE47UcZwEwGMd9/YtLZb8BnIbQxCNgDa+AAAAAElFTkSuQmCC",
    text: "表单"
  },
  {
    pagePath: "/pages/me/index",
    iconPath:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAX2SURBVGiB5VpNbBtFFP6+WW9DFVFZPbQVB+SIG6QicOqhUlMhcUK0vVTQC+mhXOk2siOfap8s25Xc5lpQUiG1hwr1514lPSW3hj8hQRUWJCQaDliQECve2cchs+lmtXbssQOIfpK1M+OZ99638/fes4H/CbhfghuNRrbdbudEJKeUaopI03Vd3/O85n7oGyqRRqOR3dramlJKnRGRyVSF5KKI3CoUCvPD1D00IrVabQrAVQC5Hof4AMrDIjQUIvV6vSEil2NNPsn7YRg+JumTzIZhmCV5BsAkYmRFpDwzM1Ma1IaBiSRI+OjhLSdnbxhkBiJSrVZLJK+a6orW+lyxWPR7GVupVHKO4yzAkCHp5fP567a2WBMxhvxoqr7rum/1eyIlyDRd1x2zPdWUzSAAcBwnmglorU/bGFAsFn2SF001GwTB1a4DusBqRswd8bupzhcKhYtdB+yBer2+YI5r61mxmpF2u302KpO8ZSMjgbJ5ZoMgmLARYEWE5Jum2Mzn84s2MuLIZDIrAKJZOGMjw4qIiORM0bcZn4RZSk0AIJm1kWG92Y3SoflNJH1g10vqC1ZElFLNQZSmQUSywHNCfdtkM0hr/ZMpZhuNhtVSSEEuIbsv2M7IoilanzJxVKvVswCyCdn92WQzyJxU0f6wvsQiGGcSGOAUtN7sInLDPCfr9fqkrRwzG1NxmTawJnLgwIHrMLMiIvcqlUquXxmVSiVHsmGqfhiG87b2WBPxPK9J8pypZh3HWeiHTK1Wm4h7vyLi9eo5p2EY8chlEYneKkSkHIbhfCejTDh8meQnMBv8X49HIiTJGNwXkS/jF51S6lQylh80DtmR00/nKLlA8hS2l0QWwIrruhdbrVbWuPZTPSneTkJ4ruv6QRDcM5drk2RTRG5prRf7WWo9EUlbDgmsuK572vO8Zr1enxSRjwBMmE8cPsn7AB7k8/lFEw4spPSLMK+1LvdCaE8iJoq7l1DmA1ghmY0tFV9rfTqptNFo5ADA87xd7YZwI5JrZqhp6rm4rjS5fRFJiasXAZTjl1atVpvD7uU0T/Lzra2t7zKZzCGllKu13tGjlBrHdibl46hNRObie0wpdRJACcCRiAyAdwuFwg9WRGq12hOYN9btZEkkISKsAVg1TwAYBTAO4GiszwbJ2yLyME2uiFwg+WEkTyn13vr6+relUumvnomYlM3cXiQiXLt27fUwDGcBvNOtXwzLIvIpyWfdOonIJZLvAwDJmyS/EJEn+Xx+Ld6vG5FoNvxCoTDWTdns7OzI5ubmSZIHReQogHGSJ7A9C9HyWAOwJiKrJB8B2NiLqcEogM/McwPABwBCrfVSsViM8gbIpI00N3S0uctpfeJotVpvkDwIAOYNPwPwKK0v2ffVtUHygYhcADAqIsdJfq2UertUKj0ulUoB0MFFUUrtnFBa68VuWqrV6ssAXunXun4QhuE3seoYAJA8ODIy8mrU2MnXykWFHs7wfSUBACRXo7JSajTWvqO7E5Ho0vP3UqKUGlaE2A07+8nswUj3IREhMGDywQh+aVAZA0CVy2UXGAKR+GX3b+Dw4cPDmZH/Cl4YIv/ERu4XqRdpKpFYkmyYeStrkNw5qUQk1aXZiwj2ylu5rhtY2tczwjAcj1V3+VjHjh3rfLPH81YmSOqIdrvdq89kDZLHTXGD5HLUrrVunT9/XgNd9kgsxzTVLW81MjKy1um7YUBETuC5R70c/47kb1G5I5FE3mquU6pnaWnpV5KtQQ1Og4gcJXnJVDdE5E78+12uSychnuc1RST6SS3nOM6CiVF24e7duxrAV4ObvRvGy70BEwaQvB2PXZRST2dmZv6M6nveysnoj+RiGIYPlFIr5v8lTQAIgiAH4LVBjA/D8AiAMRPLRPsCInKH5O2o7jjOL9PT00/iY3tyL6rV6lmT2swNYqgFNkjeFJEotgkdx3k6PT39fbJjX36SScRFqZ79xCrJZRF5GIbhH0qpdRFZc1335ytXrmymDbD+eToIggnz/5KhXZgk/Uwm4ydTRy8U/gZHt8Sexfo5bgAAAABJRU5ErkJggg==",
    text: "我的"
  }
];

export const portalConfigStore = usePortalConfigStore();
