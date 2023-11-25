export interface ProjectItem {
  defaultValue?: string[];
  formItemId?: string;
  formKey?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showLabel?: boolean;
  span?: number;
  type?: string;
  scheme?: Scheme[];
}

export interface Scheme {}

export interface FormConfType {
  title: string;
  description: string;
  labelPosition: any;
  labelWidth: number;
  type: number | null;
  formKey: string | null;
  status: number | null;
}

export interface FormActiveType {
  vModel: string;
  sort: string;
  config: FormConfigType;
  typeId: string;
  key: string | undefined;
  fieldMapping?: string | null;
  placeholder: string | undefined;

  [key: string]: any;
}

export interface FormConfigType {
  tag: string;
  tagIcon: string;
  document: string;
  defaultValue: string;
  span: string;
  label: string;
  formId?: number;
}
