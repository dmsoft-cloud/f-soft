export interface SelectOption {
    code: string;
    description: string;
}

export function enumToSelectOptions<T extends Record<string, string>>(enumObj: T): SelectOption[] {
    return Object.keys(enumObj).map(key => ({
      code: enumObj[key as keyof T],
      description: key
    }));
}