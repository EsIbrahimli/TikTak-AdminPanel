import React, { type ReactNode } from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
    children: ReactNode;
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    size = 'medium',
    onClick,
    disabled = false,
}) => {
    const classes = `${styles.btn} ${styles[`btn-${size}`]}`.trim();

    return (
        <button className={classes} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;



