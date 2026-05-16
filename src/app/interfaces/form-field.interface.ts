export interface FormField {
    id: number;
    type:
    | 'required'
    | 'email'
    | 'minLength'
    | 'select';
    name: string;
    label: string;
    validators?: string[];
    options?: string[];
}

export interface ValidatorConfig {
  type:
    | 'required'
    | 'email'
    | 'minLength'
    | 'select';

  value?: number;
}