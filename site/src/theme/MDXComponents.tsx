import MDXComponents from '@theme-original/MDXComponents';
import type {ComponentProps} from 'react';
import DocumentationLink from '@site/src/components/DocumentationLink';
import DocumentationTable from '@site/src/components/DocumentationTable';

function Code({children,...props}: ComponentProps<'code'>) {
  const OriginalCode = MDXComponents.code;
  if(typeof children!=='string'||props.className||children.includes('\n')) return <OriginalCode {...props}>{children}</OriginalCode>;
  return <code {...props}>{children.split(/(\s+)/).map((token,index)=>
    /^\s+$/.test(token)?token:<span className="mo-code-token" key={index}>{token}</span>)}</code>;
}
export default {...MDXComponents,a:DocumentationLink,table:DocumentationTable,code:Code};
