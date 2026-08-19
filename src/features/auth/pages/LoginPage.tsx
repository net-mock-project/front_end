import { AuthBanner } from "../components/AuthBanner"
import { LoginForm } from "../components/LoginForm"
import './LoginPage.css'

export const LoginPage = () => {

    return (
        <>
            <div className="login-page">
                <div className="login-page-banner">
                    <AuthBanner/>
                </div>
                <div className="login-page-content">
                    <LoginForm/>
                </div>
            </div>

        </>

    )
}