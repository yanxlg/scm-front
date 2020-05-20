import React, { useCallback, useMemo, useRef, useState } from 'react';
import '../styles/index.less';
import '../styles/login.less';
import { Button, Checkbox, Input } from 'antd';
import { userLogin } from '@/services/user';
import { history } from 'umi';
import User from '@/storage/User';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { getPageQuery } from '@/utils/utils';
import request from '@/utils/request';

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
    const [userNameError, setUserNameError] = useState();
    const [passwordError, setPasswordError] = useState();
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
        setLogin(true);

        // 获取页面中的execution

        request
            .get(
                'https://cas-t.vova.com.hk/cas/login?service=https://scm-front-t.vova.com.hk/auth/cas_login',
                {
                    mode: 'cors',
                },
            )
            .then(result => {
                console.log(result);
            });
        return;
        userLogin({
            username: userName,
            password: password,
        })
            .then(res => {
                // 登录成功，跳转到原来的页面
                // 缓存用户信息
                User.setUser(
                    Object.assign({}, User.localUser, {
                        ...(remember
                            ? {
                                  userName: userName,
                                  password: password,
                              }
                            : {
                                  userName: '',
                                  password: '',
                              }),
                        token: res?.data?.token,
                    }),
                );
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params as { redirect: string };
                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        window.location.href = redirect;
                        return;
                    }
                }
                history.replace(redirect || '/');
            })
            .catch(({ message }) => {
                setUserNameError(message);
            })
            .finally(() => {
                setLogin(false);
            });
    };

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const onLoaded = useCallback(() => {
        console.log(iframeRef.current);
        // 读取url
        alert('loaded');
    }, []);
    const iframe = useMemo(() => {
        // 有可能会直接访问中台页面，如果直接是中台页面说明登陆状态仍然存在，否则才走登陆
        return (
            <iframe
                ref={iframeRef}
                src="https://cas-t.vova.com.hk/cas/login?service=https://scm-front-t.vova.com.hk/auth/cas_login"
                onLoad={onLoaded}
                style={{ display: 'none' }}
            />
        );
    }, []);
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
                {iframe}
            </main>
        );
    }, [password, userName]);
};

export default Login;
