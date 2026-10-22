import React, {type ComponentProps} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function DocumentationLink(props: ComponentProps<typeof Link>) {
  const {siteConfig} = useDocusaurusContext();
  const portal = siteConfig.customFields!.developerPortalUrl as string;
  const docs = siteConfig.customFields!.documentationUrl as string;
  const resolve = (value: string | undefined) => {
    if (value === '/docs') return `${docs}/`;
    if (value?.startsWith('/docs/')) return `${docs}${value.slice(5)}`;
    if (value && /^\/(hardware|software|contact|community|blog)([\/#?]|$)/.test(value)) return `${portal}${value}`;
    return value;
  };
  const download = (props.href ?? props.to)?.startsWith('/downloads/') ? true : props.download;
  const value = resolve(props.href ?? props.to);
  const assetHref = useBaseUrl(value ?? '');
  if (value?.startsWith('/') && /\.(svg|png|jpe?g|gif|webp|pdf|zip|txt|json)(?:[?#]|$)/i.test(value)) {
    // A binary/file URL is not a document route. Link's trailingSlash handling
    // must not turn "figure.svg" into "figure.svg/" on static hosting.
    const {to: _to, href: _href, ...attributes} = props;
    return <a {...attributes} download={download} href={assetHref} />;
  }
  return <Link {...props} download={download} to={resolve(props.to)} href={resolve(props.href)} />;
}
