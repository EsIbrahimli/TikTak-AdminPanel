import React, { type ReactNode } from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
    children: ReactNode;
    size?: 'small' | 'medium' | 'large';
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    size,
    type = 'button',
    className,
    onClick,
    disabled = false,
}) => {
    const classes = [
        styles.btn,
        size ? styles[`btn-${size}`] : '',
        className ?? '',
    ].filter(Boolean).join(' ');

    return (
        <button type={type} className={classes} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;



