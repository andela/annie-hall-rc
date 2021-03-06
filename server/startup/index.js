import Accounts from "./accounts";
import i18n from "./i18n";
import Packages from "./packages";
import Registry from "./registry";
import Init from "./init";
import Prerender from "./prerender";
import { initTemplates } from "/server/api/core/templates";
import env from "./env";
import RestAPIs from "./RestAPI";

export default function () {
  Accounts();
  i18n();
  initTemplates();
  Packages();
  Registry();
  Init();
  Prerender();
  env();
  RestAPIs();
}
