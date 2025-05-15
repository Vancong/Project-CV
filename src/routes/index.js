import HomePage from "../pages/HomePage/HomePage"
import NotFoudPage from "../pages/NotFoudPage/NotFoudPage"
import OrderPage from "../pages/OrderPage/OrderPage"
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage"
import ProductsPage from "../pages/ProductsPage/ProductsPage"
import SigninPage from "../pages/SigninPage/SigninPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import TypeProductsPage from "../pages/TypeProductsPage/TypeProductsPage"

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
        isShowHeader: true
    },
     {
        path: "/sign-up",
        page: SignUpPage,
        isShowHeader: true
    },
     {
        path: "/product-details",
        page: ProductDetailPage,
        isShowHeader: true
    },
    {
        path: "*",
        page:NotFoudPage
    }

]
