import React, { useCallback, useMemo, useRef, useState } from 'react';
import '../styles/index.less';
import '../styles/login.less';
import { Button, Checkbox, Input } from 'antd';
import User from '@/storage/User';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { loginUser } from '@/services/global';
import { history } from '@@/core/history';

declare interface ILoginState {
    remember: boolean;
    userName?: string;
    password?: string; // 真实密码
    showPassword?: string; // 显示密码，防止浏览器记住密码
    userNameActive: boolean;
    passwordActive: boolean;
    userNameError?: string;
    passwordError?: string;
    login: boolean;
}

const Login = () => {
    const [userName, setUserName] = useState(User.userName);
    const [password, setPassword] = useState(User.password || '');
    const [userNameError, setUserNameError] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>();
    const [userNameActive, setUserNameActive] = useState(!!User.userName);
    const [passwordActive, setPasswordActive] = useState(!!User.password);
    const [login, setLogin] = useState(false);
    const [remember, setRemember] = useState(!!User.password);

    const onUserNameFocus = useCallback(() => {
        setUserNameActive(true);
    }, []);
    const onInputUserName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    }, []);

    const onUserNameBlur = useCallback(() => {
        setUserNameActive(!!userName);
    }, [userName]);

    const onPasswordFocus = useCallback(() => {
        setPasswordActive(true);
    }, []);

    const onInputPassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const onPasswordBlur = useCallback(() => {
        setPasswordActive(!!password);
    }, [password]);

    const onRememberChange = useCallback((e: CheckboxChangeEvent) => {
        setRemember(e.target.checked);
    }, []);

    const onLogin = () => {
        if (!userName) {
            setUserNameError('请输入用户名');
            return;
        }
        if (!password) {
            setPasswordError('请输入密码');
            return;
        }
        setLogin(true);
        loginUser({
            username: userName,
            password: password,
        })
            .then(({ data }) => {
                User.setUser({
                    password,
                    userName,
                    token: data,
                });
                history.replace('/');
            })
            .finally(() => {
                setLogin(false);
            });
    };

    return useMemo(() => {
        return (
            <main className="main login-bg">
                <div className="login-logo">供应链管理中台</div>
                <div className="login-box">
                    <div className="login-title">登录</div>
                    <div className={`login-item ${userNameError ? 'login-error' : ''}`}>
                        <Input
                            spellCheck={false}
                            value={userName}
                            className="login-input"
                            onFocus={onUserNameFocus}
                            onChange={onInputUserName}
                            onBlur={onUserNameBlur}
                        />
                        <label
                            className={`login-input-label ${
                                userNameActive ? 'login-input-label-value' : ''
                            }`}
                        >
                            用户名
                        </label>
                        <label className="login-error-label">{userNameError}</label>
                    </div>
                    <div className={`login-item ${passwordError ? 'login-error' : ''}`}>
                        <Input
                            type="password"
                            autoComplete="new-password"
                            spellCheck={false}
                            value={password}
                            className="login-input"
                            onFocus={onPasswordFocus}
                            onChange={onInputPassword}
                            onBlur={onPasswordBlur}
                        />
                        <label
                            className={`login-input-label ${
                                passwordActive ? 'login-input-label-value' : ''
                            }`}
                        >
                            密码
                        </label>
                        <label className="login-error-label">{passwordError}</label>
                    </div>
                    <Checkbox
                        checked={remember}
                        className="login-remember"
                        onChange={onRememberChange}
                    >
                        下次自动登录
                    </Checkbox>
                    <Button
                        loading={login}
                        disabled={!userName || !password}
                        type="primary"
                        className="login-btn"
                        onClick={onLogin}
                    >
                        登录
                    </Button>
                </div>
            </main>
        );
    }, [password, userName, passwordActive, userNameActive, login]);
};

export default Login;
