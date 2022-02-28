/* tslint:disable */
/* eslint-disable */

/**
 * local storage structure.
 */
export interface StorageDrawerData<T> {
  /** storage key. */
  key: string;
  /** real data. */
  data: T;
}

export interface ToggleStatus {
  open: boolean;
}

export interface CheatSheetData {
  /** name */
  name: string;
  /** label */
  label: string;
  /** link to resource */
  link?: string;
  /** content: can be copied. */
  content: string;
  /** order: used by sort */
  order: number;
  /** type */
  type: string;
  /** create time */
  createTime: Date;
  /** modify time */
  modifyTime: Date;
  /** url pattern: show this cheatsheet when url matched. */
  url?: string;
}

export interface UriData {
  /** 主键id */
  id: string;
  /** 名称 */
  label: string;
  /** 字符串匹配模式 */
  value: string;
  /** url */
  url: string;
  /** 环境 */
  env?: string;
  /** 背景色 */
  color?: string;
}
