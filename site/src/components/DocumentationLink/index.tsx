import React, {type ComponentProps} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

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
  return <Link {...props} download={download} to={resolve(props.to)} href={resolve(props.href)} />;
}
