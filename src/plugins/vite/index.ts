import { PLUGIN_NAME, DEFAULT_OPTION } from '../../constant';
import { getHtmlScript } from '../../utils';
import type { IViteOption } from './interface';

interface HtmlTagDescriptor {
  tag: string;
  attrs?: Record<string, string | boolean | undefined>;
  children?: string | HtmlTagDescriptor[];
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend';
}

interface VitePlugin {
  name: string;
  enforce?: 'pre' | 'post';
  apply?: 'build' | 'serve';
  transformIndexHtml?: (html: string) => HtmlTagDescriptor[] | string;
}

export function ConsoleTagVitePlugin(opts: IViteOption = {}): VitePlugin {
  const option = Object.assign({}, DEFAULT_OPTION, opts);

  return {
    name: PLUGIN_NAME,
    enforce: 'post' as const,
    transformIndexHtml(): HtmlTagDescriptor[] {
      return [
        {
          tag: 'script',
          children: getHtmlScript(option),
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}
