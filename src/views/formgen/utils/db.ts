const DRAWING_ITEMS = "drawingItems";
const DRAWING_ITEMS_VERSION = "1.2";
const DRAWING_ITEMS_VERSION_KEY = "DRAWING_ITEMS_VERSION";
const DRAWING_ID = "idGlobal";
const TREE_NODE_ID = "treeNodeId";
const FORM_CONF = "formConf";
const FORM_DATA = "formData";
const FORM_SAVE_DATA = "formSaveData";
const TEMP_FROM_DATA = "tempFormData";
const LAST_FORM_DATA_ID = "lastFormDataId";

export function getDrawingList(key: string) {
  // 加入缓存版本的概念，保证缓存数据与程序匹配
  const version = localStorage.getItem(DRAWING_ITEMS_VERSION_KEY);
  if (version !== DRAWING_ITEMS_VERSION) {
    localStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION);
    saveDrawingList([]);
    return null;
  }

  const str = localStorage.getItem(`${DRAWING_ITEMS}:${key}`);
  if (str) return JSON.parse(str);
  return null;
}

export function saveDrawingList(list: any, key?: string) {
  if (key) localStorage.setItem(`${DRAWING_ITEMS}:${key}`, JSON.stringify(list));
}

export function getIdGlobal(key: string) {
  const str = localStorage.getItem(`${DRAWING_ID}:${key}`);
  if (str) return parseInt(str, 10);
  return 100;
}

export function saveIdGlobal(id: string, key: string) {
  if (key) localStorage.setItem(`${DRAWING_ID}:${key}`, `${id}`);
}

export function getTreeNodeId() {
  const str = localStorage.getItem(TREE_NODE_ID);
  if (str) return parseInt(str, 10);
  return 100;
}

export function saveTreeNodeId(id: string) {
  localStorage.setItem(TREE_NODE_ID, `${id}`);
}

export function getFormConf(key: string) {
  const str = localStorage.getItem(`${FORM_CONF}:${key}${key}`);
  if (str) return JSON.parse(str);
  return null;
}

export function saveFormConf(obj: any, key: string) {
  if (key) localStorage.setItem(`${FORM_CONF}:${key}`, JSON.stringify(obj));
}

export function getFormData(key: string) {
  const str = localStorage.getItem(`${FORM_DATA}:${key}`);
  if (str) return JSON.parse(str);
  return null;
}

export function saveFormData(obj: any, key: string) {
  if (key) localStorage.setItem(`${FORM_DATA}:${key}`, JSON.stringify(obj));
}

export function removeFormData(key: string) {
  if (key) localStorage.removeItem(`${FORM_DATA}:${key}`);
}

export function getFormSaveData(key: string) {
  const str = localStorage.getItem(`${FORM_SAVE_DATA}:${key}`);
  if (str) return JSON.parse(str);
  return null;
}

export function saveFormSaveData(obj: any, key: string) {
  if (key) localStorage.setItem(`${FORM_SAVE_DATA}:${key}`, JSON.stringify(obj));
}

export function saveTempFormData(obj: any, key: string) {
  if (key) localStorage.setItem(`${TEMP_FROM_DATA}:${key}`, JSON.stringify(obj));
}

export function getTempFormData(key: string) {
  const str = localStorage.getItem(`${TEMP_FROM_DATA}:${key}`);
  if (str) return JSON.parse(str);
  return null;
}

export function removeTempFormData(key: string) {
  if (key) localStorage.removeItem(`${TEMP_FROM_DATA}:${key}`);
}

/**
 * 保存最后一次提交的表单的数据Id
 */
export function saveLastFormDataId(dataId: string, key: string) {
  if (key) localStorage.setItem(`${LAST_FORM_DATA_ID}:${key}`, dataId);
}

/**
 * 获取最后一次的
 */
export function getLastFormDataId(key: string) {
  return localStorage.getItem(`${LAST_FORM_DATA_ID}:${key}`);
}
