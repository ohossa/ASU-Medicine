import type {ButtonHTMLAttributes,HTMLAttributes,ReactNode} from 'react';
export function StudyButton({variant='primary',busy=false,className='',children,disabled,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary';busy?:boolean}){
 return <button type="button" {...props} disabled={disabled||busy} aria-busy={busy||undefined} className={`study-control report-${variant} ${className}`}><span>{children}</span>{busy&&<span aria-hidden="true" className="study-spinner"/>}</button>;
}
export function StatusMessage({kind='status',children,...props}:HTMLAttributes<HTMLDivElement>&{kind?:'status'|'error';children:ReactNode}){
 return <div {...props} role={kind==='error'?'alert':'status'} className={`study-status ${kind==='error'?'report-error':'report-muted'} ${props.className??''}`}>{children}</div>;
}
export function StudySurface({children,...props}:HTMLAttributes<HTMLElement>){return <section {...props} className={`study-surface ${props.className??''}`}>{children}</section>;}
