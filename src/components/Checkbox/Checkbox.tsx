import React from 'react';
import './checkbox.scss';

interface ICheckboxProps {
    checked: boolean;
    onChange: () => void;
    children: React.ReactNode;
}

const Checkbox = (props: ICheckboxProps) => {
    const { checked, onChange, children} = props;

    return (
        <label className="checkbox">
            <input
                className="checkbox__input"
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            {children}
        </label>
    )
};

export default Checkbox;