import { strings } from '@angular-devkit/core';
import { eBindingSourceId, eMethodModifier } from '../enums';
import { ParameterInBody } from './api-definition';
import { Omissible } from './util';

export class Method {
  body: Body;
  signature: Signature;

  constructor(options: MethodOptions) {
    Object.assign(this, options);
  }
}

export type MethodOptions = Method;

export class Signature {
  generics = '';
  modifier = eMethodModifier.Public;
  name: string;
  parameters: Parameter[] = [];
  returnType = '';

  constructor(options: SignatureOptions) {
    Object.assign(this, options);
  }
}

export type SignatureOptions = Omissible<
  Signature,
  'generics' | 'modifier' | 'parameters' | 'returnType'
>;

export class Body {
  body?: string;
  method: string;
  params: string[] = [];
  requestType = 'any';
  responseType: string;
  url: string;

  registerActionParameter = (param: ParameterInBody) => {
    let { bindingSourceId, descriptorName, name, nameOnMethod } = param;
    name = strings.camelize(name);
    const value = descriptorName ? `${descriptorName}.${name}` : nameOnMethod;

    switch (bindingSourceId) {
      case eBindingSourceId.Model:
      case eBindingSourceId.Query:
        this.params.push(`${name}: ${value}`);
        break;
      case eBindingSourceId.Body:
        this.body = value;
        break;
      case eBindingSourceId.Path:
        const regex = new RegExp('{' + name + '}', 'g');
        this.url = this.url.replace(regex, '${' + value + '}');
        break;
      default:
        break;
    }
  };

  constructor(options: BodyOptions) {
    Object.assign(this, options);
  }
}

export type BodyOptions = Omissible<
  Omit<Body, 'registerActionParameter'>,
  'params' | 'requestType'
>;

export class Parameter {
  name: string;
  type: string;
  default: string = ''; // convert actual value with JSON.stringify if not null
  optional: '' | '?' = '';

  constructor(options: ParameterOptions) {
    Object.assign(this, options);
  }
}

export type ParameterOptions = Omissible<Parameter, 'default' | 'optional'>;