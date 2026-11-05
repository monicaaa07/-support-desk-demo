import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' };

export function Button({ variant = 'secondary', className, ...rest }: Props) {
  return <button {...rest} className={`${styles.button} ${styles[variant]} ${className ?? ''}`} />;
}
