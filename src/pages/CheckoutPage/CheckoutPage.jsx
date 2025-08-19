import CheckoutComponent from "../../components/CheckoutComponent/CheckoutComponent";
import NavigationPathComponent from "../../components/NavigationPathComponent/NavigationPathComponent";
import ProductListSection from "../../components/ProductListSection/ProductListSection";

const CheckoutPage = () => {
 

  return (
    <div className='container'>
        <NavigationPathComponent category="Thanh toán" />
        <CheckoutComponent />
        <ProductListSection 
            title="Sản phẩm đang trong thời gian khuyến mãi" 
            queryKey="saleProducts" 
            keySort="discount" 
            valueSort={-1} 
        />
    </div>
  );
};

export default CheckoutPage;
