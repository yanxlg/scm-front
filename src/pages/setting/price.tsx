import React, { useCallback, useEffect, useState } from 'react';

const Test = () => {
    useEffect(() => {
        console.log('a');
        return () => {
            console.log('b');
        };
    }, []);
    return <div>111</div>;
};

const Price = () => {
    const [state1, setState1] = useState<string>();
    const [state2, setState2] = useState<string>();
    const [state3, setState3] = useState<string>();
    const [state4, setState4] = useState<string>();
    const [state5, setState5] = useState<string>();
    const [state6, setState6] = useState<string>();

    const action = useCallback(
        (() => {
            console.log('我的自执行控制');
            return () => {};
        })(),
        [],
    );
    const OnTest = () => {
        setTimeout(() => {
            setState1('1');
            setState2('2');
            setState3('1');
            setState4('1');
            setState5('1');
            setState6('1');
        }, 0);
    };

    console.log('render');
    return <div onClick={OnTest}>1111{state1 === '1' ? null : <Test />}</div>;
};

export default Price;
