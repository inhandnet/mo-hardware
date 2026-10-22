import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import map from './content-map.json';

const docs = (process.env.DOCUMENTATION_URL ?? 'https://inhandnet.github.io/mo-docs').replace(/\/$/, '');
const labels: Record<string,string> = {
  'getting-started':'Getting started', 'mo-os':'Mo OS', 'system-configuration':'System configuration',
  'application-deployment':'Application deployment', 'application-development':'Application development',
  'real-time-cores':'Real-time cores', 'hardware-development':'Hardware development',
  'compliance':'Compliance', 'low-level-development':'Low-level development', 'other-systems':'Other systems',
  'accessories':'Accessories', 'faq':'FAQ', 'resource-download':'Resource download',
};
function category(board: string, section: string) {
  const records = map.routes.filter(r=>r.route.startsWith(`${board}/${section}/`));
  if (!records.length) return {type:'link', label:labels[section], href:`${docs}/${board}/${section}/`};
  const index = records.find(r=>r.original.endsWith('/index.mdx'))!;
  const id = (r: typeof index) => r.original.replace(/^docs\//,'').replace(/\.mdx$/,'');
  const order = ['overview','hardware-interfaces','power-and-thermal','mechanical','schematics','hardware-revisions',
    'supported-accessories','hat-compatibility','regulatory-and-safety','certifications','declarations','integration-notes'];
  const remaining = records.filter(r=>r!==index).sort((a,b)=>
    order.indexOf(a.route.split('/').at(-2)!) - order.indexOf(b.route.split('/').at(-2)!));
  return {type:'category',label:labels[section],collapsed:true,link:{type:'doc',id:id(index)},items:remaining.map(id)};
}
const sidebars: SidebarsConfig = {documentation: [
  'index',
  ...['mo-62a','mo-68a'].map(board=>({type:'category',label:board==='mo-62a'?'Mo 62A':'Mo 68A',
    link:{type:'doc',id:`${board}/index`},items:Object.keys(labels).map(section=>category(board,section))})),
  {type:'category',label:'Accessories',link:{type:'doc',id:'accessories/index'},
    items:['accessories/overview','accessories/guides']},
  {type:'link',label:'Works with Mo',href:`${docs}/works-with-mo/`},
  {type:'link',label:'Security',href:`${docs}/security/`},
] as any};
export default sidebars;
