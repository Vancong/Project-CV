import HomePage from "../pages/HomePage/HomePage"
import NotFoudPage from "../pages/NotFoudPage/NotFoudPage"
import OrderPage from "../pages/OrderPage/OrderPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProductsPage from "../pages/ProductsPage/ProductsPage"
import SigninPage from "../pages/SigninPage/SigninPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import TypeProductsPage from "../pages/TypeProductsPage/TypeProductsPage"
import ProfilePage from "../pages/ProfilePage/ProfilePage"

 export const routes= [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true
    },
    {
        path: "/order",
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: "/product",
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: "/:type",
        page: TypeProductsPage,
        isShowHeader: true
    },
     {
        path: "/sign-in",
        page: SigninPage,
        isShowHeader: false
    },
     {
        path: "/sign-up",
        page: SignUpPage,
        isShowHeader: false
    },
     {
        path: "/product-details",
        page: ProductDetailPage,
        isShowHeader: true
    },

    {
        path: "/profile-user",
        page:ProfilePage,
        isShowHeader: true
    },
    {
        path: "*",
        page:NotFoudPage
    }

]
