import HomePage from "../pages/HomePage/HomePage"
import NotFoudPage from "../pages/NotFoudPage/NotFoudPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProductsPage from "../pages/ProductsPage/ProductsPage"
import SigninPage from "../pages/SigninPage/SigninPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import TypeProductsPage from "../pages/TypeProductsPage/TypeProductsPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"
import AdminPage from "../pages/AdminPage/AdminPage"
import CartPage from "../pages/CartPage/CartPage"
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage"
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage"
import OrderDetailPage from "../pages/OrderDetailPage/OrderDetailPage"
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage"
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage"
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage "

 export const routes= [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true
    },
    {
        path: "/checkout",
        page: CheckoutPage,
        isShowHeader: true,
        isPrivate: true

    },
    {
        path: "/order-success",
        page: OrderSuccessPage,
        isShowHeader: true,
        isPrivate: true
    },
    {
        path: "/cart",
        page: CartPage,
        isShowHeader: true,
        isPrivate: true
    },

    {
        path: "/my-order",
        page: MyOrderPage,
        isShowHeader: true,
        isPrivate: true
    },

    {
        path: "/my-order/detail/:orderCode",
        page: OrderDetailPage,
        isShowHeader: true,
        isPrivate: true
    },

    {
        path: "/product",
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: "/type/:type",
        page: TypeProductsPage,
        isShowHeader: true
    },
     {
        path: "/forgot-password",
        page: ForgotPasswordPage,
        isShowHeader: true
    },
    {
        path: "/reset-password",
        page: ResetPasswordPage,
        isShowHeader: true
    },
     {
        path: "/sign-in",
        page: SigninPage,
        isShowHeader: true
    },
     {
        path: "/sign-up",
        page: SignUpPage,
        isShowHeader: false
    },
     {
        path: "/product-details/:slug",
        page: ProductDetailPage,
        isShowHeader: true
    },

    {
        path: "/profile-user",
        page:ProfilePage,
        isShowHeader: true,
        isPrivate: true
    },
    {
        path: "/admin/dashboard",
        page:AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: "*",
        page:NotFoudPage
    }

]
